from __future__ import annotations

from dataclasses import dataclass

from nifty_orb.config import ExitMode, StrategyConfig
from nifty_orb.costs import apply_slippage, net_pnl, round_trip_cost


@dataclass
class OpenPosition:
    day: object
    setup: str
    option_type: str
    strike: float
    entry_time: object
    entry_spot: float
    entry_premium: float
    delta: float
    one_r_premium: float
    stop_premium: float
    target_premium: float
    be_armed: bool = False
    trail_stop_premium: float | None = None
    source: str = "index_proxy"
    lots_left: int = 1


@dataclass
class ClosedTrade:
    day: object
    setup: str
    option_type: str
    strike: float
    entry_time: object
    exit_time: object
    entry_premium: float
    exit_premium: float
    entry_spot: float
    exit_spot: float
    one_r_rupees: float
    pnl: float
    r_multiple: float
    outcome: str
    source: str
    expiry_day: bool
    skip_reason: str | None = None


def rupee_risk(one_r_premium: float, config: StrategyConfig) -> float:
    return one_r_premium * config.lot_size * config.lots


def position_from_fill(
    *,
    day,
    setup: str,
    option_type: str,
    strike: float,
    entry_time,
    entry_spot: float,
    raw_premium: float,
    delta: float,
    index_stop_points: float,
    config: StrategyConfig,
    source: str,
) -> OpenPosition | None:
    fill = apply_slippage(raw_premium, "buy", config)
    one_r_premium = max(delta * index_stop_points, fill * 0.12)
    risk_rs = rupee_risk(one_r_premium, config)
    if risk_rs > config.capital * config.skip_if_1r_exceeds_capital_pct:
        return None
    stop_premium = fill - one_r_premium
    if stop_premium <= 0.5:
        return None
    target_premium = fill + config.target_r * one_r_premium
    return OpenPosition(
        day=day,
        setup=setup,
        option_type=option_type,
        strike=strike,
        entry_time=entry_time,
        entry_spot=entry_spot,
        entry_premium=fill,
        delta=delta,
        one_r_premium=one_r_premium,
        stop_premium=stop_premium,
        target_premium=target_premium,
        source=source,
        lots_left=config.lots,
    )


def manage_bar(
    position: OpenPosition,
    *,
    bar_time,
    premium_open: float,
    premium_high: float,
    premium_low: float,
    premium_close: float,
    spot_close: float,
    config: StrategyConfig,
    expiry_day: bool,
) -> ClosedTrade | None:
    favorable = premium_high
    adverse = premium_low
    move_r = (favorable - position.entry_premium) / position.one_r_premium if position.one_r_premium else 0.0

    if config.exit_mode in {ExitMode.BE_THEN_1_5, ExitMode.BE_THEN_TRAIL} and move_r >= config.be_trigger_r:
        buffer = round_trip_cost(
            position.entry_premium, position.entry_premium + position.one_r_premium, config
        ).breakeven_premium_buffer
        position.be_armed = True
        position.stop_premium = max(position.stop_premium, position.entry_premium + buffer)

    if config.exit_mode == ExitMode.BE_THEN_TRAIL and position.be_armed:
        trail = favorable - config.trail_index_points * position.delta
        position.trail_stop_premium = max(position.stop_premium, trail)
        position.stop_premium = position.trail_stop_premium

    stop = position.stop_premium
    target = position.target_premium
    flatten = config.exit_mode in {ExitMode.FLATTEN_1_5, ExitMode.BE_THEN_1_5}

    stop_hit = adverse <= stop
    target_hit = flatten and favorable >= target

    if stop_hit and target_hit:
        return _close(position, bar_time, stop, spot_close, config, "stop_priority", expiry_day)
    if stop_hit:
        outcome = "scratch" if position.be_armed and stop >= position.entry_premium else "stop"
        return _close(position, bar_time, stop, spot_close, config, outcome, expiry_day)
    if target_hit:
        return _close(position, bar_time, target, spot_close, config, "target", expiry_day)

    hh, mm = bar_time.hour, bar_time.minute
    stop_h, stop_m = (int(x) for x in config.time_stop.split(":"))
    if hh > stop_h or (hh == stop_h and mm >= stop_m):
        px = apply_slippage(premium_close, "sell", config)
        return _close(position, bar_time, px, spot_close, config, "time", expiry_day)
    return None


def _close(
    position: OpenPosition,
    exit_time,
    raw_exit: float,
    exit_spot: float,
    config: StrategyConfig,
    outcome: str,
    expiry_day: bool,
) -> ClosedTrade:
    exit_px = apply_slippage(raw_exit, "sell", config) if outcome in {"time"} else raw_exit
    if outcome != "time":
        # Stops/targets already include intended premium; still pay slippage on market stops.
        if outcome in {"stop", "scratch", "stop_priority"}:
            exit_px = apply_slippage(raw_exit, "sell", config)
    pnl = net_pnl(position.entry_premium, exit_px, config)
    one_r = rupee_risk(position.one_r_premium, config)
    r_mult = pnl / one_r if one_r else 0.0
    return ClosedTrade(
        day=position.day,
        setup=position.setup,
        option_type=position.option_type,
        strike=position.strike,
        entry_time=position.entry_time,
        exit_time=exit_time,
        entry_premium=position.entry_premium,
        exit_premium=exit_px,
        entry_spot=position.entry_spot,
        exit_spot=exit_spot,
        one_r_rupees=one_r,
        pnl=pnl,
        r_multiple=r_mult,
        outcome=outcome,
        source=position.source,
        expiry_day=expiry_day,
    )


def daily_halt(day_pnl: float, full_1r_losses: int, config: StrategyConfig) -> bool:
    if day_pnl <= -config.capital * config.daily_loss_pct:
        return True
    return full_1r_losses >= config.max_1r_losses_per_day
