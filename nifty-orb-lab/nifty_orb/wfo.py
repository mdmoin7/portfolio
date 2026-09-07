from __future__ import annotations

from dataclasses import replace
from itertools import product
from typing import Any

import pandas as pd

from nifty_orb.backtest import run_backtest, slice_index_days
from nifty_orb.config import WFO_GRID, ExitMode, StrategyConfig
from nifty_orb.data.session import trading_dates


def iter_param_sets() -> list[dict[str, Any]]:
    keys = list(WFO_GRID.keys())
    return [dict(zip(keys, values)) for values in product(*(WFO_GRID[k] for k in keys))]


def apply_params(base: StrategyConfig, params: dict[str, Any]) -> StrategyConfig:
    clean = dict(params)
    if "exit_mode" in clean and not isinstance(clean["exit_mode"], ExitMode):
        clean["exit_mode"] = ExitMode(clean["exit_mode"])
    return replace(base, **clean)


def _score(summary: dict[str, Any]) -> tuple[float, float, float]:
    pf = summary.get("profit_factor") or 0.0
    if pf == float("inf"):
        pf = 10.0
    return (
        float(summary.get("expectancy_r") or 0.0),
        float(pf),
        float(summary.get("net_pnl") or 0.0),
    )


def grid_search(
    index_bars: pd.DataFrame,
    *,
    option_bars: pd.DataFrame | None = None,
    vix: pd.DataFrame | None = None,
    base: StrategyConfig | None = None,
) -> pd.DataFrame:
    base = base or StrategyConfig()
    rows = []
    for params in iter_param_sets():
        cfg = apply_params(base, params)
        result = run_backtest(index_bars, option_bars=option_bars, vix=vix, config=cfg)
        rows.append({**{k: str(v) for k, v in params.items()}, **result.summary})
    frame = pd.DataFrame(rows)
    if not frame.empty:
        frame = frame.sort_values(["expectancy_r", "profit_factor", "net_pnl"], ascending=False)
    return frame


def walk_forward(
    index_bars: pd.DataFrame,
    *,
    option_bars: pd.DataFrame | None = None,
    vix: pd.DataFrame | None = None,
    base: StrategyConfig | None = None,
    train_days: int = 30,
    test_days: int = 10,
) -> pd.DataFrame:
    """Rolling train/test. Fit only the small WFO grid on train; report test metrics."""
    base = base or StrategyConfig()
    dates = trading_dates(index_bars)
    folds: list[dict[str, Any]] = []
    start = 0
    fold = 0
    while start + train_days + test_days <= len(dates):
        train_d = dates[start : start + train_days]
        test_d = dates[start + train_days : start + train_days + test_days]
        train_idx = slice_index_days(index_bars, train_d)
        test_idx = slice_index_days(index_bars, test_d)
        train_opt = slice_index_days(option_bars, train_d) if option_bars is not None and not option_bars.empty else None
        test_opt = slice_index_days(option_bars, test_d) if option_bars is not None and not option_bars.empty else None
        best_params = None
        best_score = None
        for params in iter_param_sets():
            cfg = apply_params(base, params)
            train_res = run_backtest(train_idx, option_bars=train_opt, vix=vix, config=cfg)
            score = _score(train_res.summary)
            if best_score is None or score > best_score:
                best_score = score
                best_params = params
        assert best_params is not None
        test_cfg = apply_params(base, best_params)
        test_res = run_backtest(test_idx, option_bars=test_opt, vix=vix, config=test_cfg)
        folds.append(
            {
                "fold": fold,
                "train_start": str(train_d[0].date()),
                "train_end": str(train_d[-1].date()),
                "test_start": str(test_d[0].date()),
                "test_end": str(test_d[-1].date()),
                **{f"param_{k}": str(v) for k, v in best_params.items()},
                **{f"test_{k}": v for k, v in test_res.summary.items() if k != "uncertainty"},
            }
        )
        fold += 1
        start += test_days
    return pd.DataFrame(folds)
