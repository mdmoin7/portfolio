from nifty_orb.config import StrategyConfig
from nifty_orb.costs import net_pnl, round_trip_cost
from nifty_orb.risk import manage_bar, position_from_fill
from nifty_orb.strikes import bs_price, nearest_strike, proxy_choice


def test_round_trip_includes_stt() -> None:
    cfg = StrategyConfig()
    cost = round_trip_cost(150, 180, cfg)
    assert cost.total > 0
    sell_stt = 180 * cfg.lot_size * cfg.lots * cfg.costs.stt_sell_premium_rate
    assert cost.sell_cash >= sell_stt
    pnl = net_pnl(150, 180, cfg)
    assert pnl < (180 - 150) * cfg.lot_size


def test_1r_skip_when_stop_too_large() -> None:
    cfg = StrategyConfig(capital=100_000, skip_if_1r_exceeds_capital_pct=0.02)
    # huge index stop → 1R rupees blow through 2% of capital
    pos = position_from_fill(
        day="2024-01-02",
        setup="orb",
        option_type="CE",
        strike=24500,
        entry_time="2024-01-02 09:35",
        entry_spot=24500,
        raw_premium=120,
        delta=0.5,
        index_stop_points=400,
        config=cfg,
        source="test",
    )
    assert pos is None


def test_breakeven_stop_after_1r() -> None:
    cfg = StrategyConfig()
    pos = position_from_fill(
        day="2024-01-02",
        setup="orb",
        option_type="CE",
        strike=24500,
        entry_time="2024-01-02 09:35",
        entry_spot=24500,
        raw_premium=100,
        delta=0.5,
        index_stop_points=40,
        config=cfg,
        source="test",
    )
    assert pos is not None
    # Favorable high reaches +1R so BE arms; close still open
    still_open = manage_bar(
        pos,
        bar_time=pd_timestamp(),
        premium_open=pos.entry_premium,
        premium_high=pos.entry_premium + pos.one_r_premium * 1.05,
        premium_low=pos.entry_premium + pos.one_r_premium * 0.5,
        premium_close=pos.entry_premium + pos.one_r_premium * 0.8,
        spot_close=24540,
        config=cfg,
        expiry_day=False,
    )
    assert still_open is None
    assert pos.be_armed
    assert pos.stop_premium >= pos.entry_premium

    scratch = manage_bar(
        pos,
        bar_time=pd_timestamp(),
        premium_open=pos.entry_premium,
        premium_high=pos.entry_premium,
        premium_low=pos.entry_premium - 0.01,
        premium_close=pos.entry_premium,
        spot_close=24500,
        config=cfg,
        expiry_day=False,
    )
    assert scratch is not None
    assert scratch.outcome == "scratch"


def pd_timestamp():
    import pandas as pd

    return pd.Timestamp("2024-01-02 10:00", tz="Asia/Kolkata")


def test_proxy_strike_is_slightly_itm() -> None:
    import pandas as pd

    ts = pd.Timestamp("2024-01-02 10:00", tz="Asia/Kolkata")
    cfg = StrategyConfig()
    ce = proxy_choice(24500, "CE", ts, cfg)
    pe = proxy_choice(24500, "PE", ts, cfg)
    assert ce.strike <= nearest_strike(24500)
    assert pe.strike >= nearest_strike(24500)
    assert bs_price(24500, ce.strike, 0.01, 0.14, "CE") > 0
    assert ce.delta >= 0.35
