from nifty_orb.backtest import run_backtest
from nifty_orb.config import ExitMode, StrategyConfig
from nifty_orb.data.synthetic import generate_index_days, generate_option_bars, generate_vix
from nifty_orb.wfo import grid_search, walk_forward


def test_synthetic_backtest_respects_trade_cap() -> None:
    cfg = StrategyConfig(
        capital=100_000,
        or_min_width=5,
        or_max_width=400,
        gap_skip_pct=0.05,
        vix_skip_above=None,
        realized_range_skip=5000,
        skip_if_1r_exceeds_capital_pct=0.08,
        allow_vwap_pullback=True,
        max_trades_per_day=3,
    )
    index = generate_index_days(sessions=18, seed=21)
    options = generate_option_bars(index, cfg)
    from nifty_orb.data.adapter import canonicalize_bars

    option_bars = canonicalize_bars(options, kind="option_bars", config=cfg).bars
    result = run_backtest(index, option_bars=option_bars, vix=generate_vix(index), config=cfg)
    assert result.summary["sessions"] == 18
    if not result.trades.empty:
        assert int(result.summary["max_trades_in_a_day"]) <= 3
        assert result.trades["r_multiple"].notna().all()
        assert set(result.trades["outcome"]).issubset({"target", "stop", "scratch", "time", "stop_priority"})
    assert "expectancy_r" in result.summary
    assert "skip_rate" in result.summary
    assert "target_pct" in result.summary
    assert result.uncertainty


def test_proxy_mode_runs_without_option_file() -> None:
    cfg = StrategyConfig(
        or_min_width=5,
        or_max_width=400,
        gap_skip_pct=0.05,
        vix_skip_above=None,
        realized_range_skip=5000,
        skip_if_1r_exceeds_capital_pct=0.08,
    )
    index = generate_index_days(sessions=10, seed=4)
    result = run_backtest(index, config=cfg)
    assert result.summary["used_option_proxy"] is True
    assert "INDICATIVE" in result.uncertainty


def test_walk_forward_and_grid_do_not_crash() -> None:
    cfg = StrategyConfig(
        or_min_width=5,
        or_max_width=400,
        gap_skip_pct=0.05,
        vix_skip_above=None,
        realized_range_skip=5000,
        skip_if_1r_exceeds_capital_pct=0.08,
        exit_mode=ExitMode.FLATTEN_1_5,
    )
    index = generate_index_days(sessions=16, seed=9)
    folds = walk_forward(index, base=cfg, train_days=8, test_days=4)
    assert not folds.empty
    assert "test_expectancy_r" in folds.columns
    table = grid_search(index.iloc[:800], base=cfg)  # subset of bars, still multiple days
    assert "expectancy_r" in table.columns
