from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pandas as pd

from nifty_orb.backtest import BacktestResult


def _fmt(value: Any) -> str:
    if isinstance(value, float):
        if abs(value) >= 100:
            return f"{value:,.2f}"
        return f"{value:.4f}"
    return str(value)


def print_summary(result: BacktestResult) -> None:
    print(result.uncertainty)
    print("-" * 60)
    keys = [
        "sessions",
        "trades",
        "skip_days",
        "skip_rate",
        "avg_trades_per_day",
        "max_trades_in_a_day",
        "net_pnl",
        "expectancy_r",
        "median_winner_r",
        "profit_factor",
        "win_rate",
        "target_pct",
        "scratch_pct",
        "stop_pct",
        "time_exit_pct",
        "max_drawdown",
        "expiry_day_trades",
        "expiry_day_pnl",
        "final_equity",
    ]
    for key in keys:
        if key in result.summary:
            print(f"{key:24} {_fmt(result.summary[key])}")


def write_report(result: BacktestResult, directory: str | Path, prefix: str = "run") -> dict[str, str]:
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    paths = {
        "summary": str(directory / f"{prefix}_summary.json"),
        "trades": str(directory / f"{prefix}_trades.csv"),
        "skips": str(directory / f"{prefix}_skips.csv"),
        "equity": str(directory / f"{prefix}_equity.csv"),
    }
    payload = dict(result.summary)
    payload["uncertainty"] = result.uncertainty
    payload["config"] = {
        "or_minutes": result.config.or_minutes,
        "vwap_filter": result.config.vwap_filter,
        "skip_expiry_tuesday": result.config.skip_expiry_tuesday,
        "exit_mode": result.config.exit_mode.value,
        "capital": result.config.capital,
        "lot_size": result.config.lot_size,
        "target_r": result.config.target_r,
    }
    Path(paths["summary"]).write_text(json.dumps(payload, indent=2, default=str))
    if not result.trades.empty:
        result.trades.to_csv(paths["trades"], index=False)
    else:
        pd.DataFrame().to_csv(paths["trades"], index=False)
    if not result.skips.empty:
        result.skips.to_csv(paths["skips"], index=False)
    else:
        pd.DataFrame().to_csv(paths["skips"], index=False)
    if not result.equity.empty:
        result.equity.to_csv(paths["equity"], index=False)
    else:
        pd.DataFrame().to_csv(paths["equity"], index=False)
    return paths
