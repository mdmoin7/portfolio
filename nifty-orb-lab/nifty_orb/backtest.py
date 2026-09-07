from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import pandas as pd

from nifty_orb.config import StrategyConfig
from nifty_orb.costs import apply_slippage
from nifty_orb.data.session import day_slice, trading_dates
from nifty_orb.risk import ClosedTrade, OpenPosition, _close, daily_halt, manage_bar, position_from_fill
from nifty_orb.signals import (
    add_vwap,
    evaluate_day_filters,
    orb_direction,
    past_last_entry,
    past_or_end,
    vwap_pullback_direction,
)
from nifty_orb.strikes import StrikeChoice, choose_from_chain, project_premium, proxy_choice


@dataclass
class DaySkip:
    day: pd.Timestamp
    reason: str
    expiry_day: bool


@dataclass
class BacktestResult:
    trades: pd.DataFrame
    skips: pd.DataFrame
    equity: pd.DataFrame
    summary: dict[str, Any]
    config: StrategyConfig
    uncertainty: str


def _vix_on_day(vix: pd.DataFrame | None, day: pd.Timestamp) -> float | None:
    if vix is None or vix.empty:
        return None
    day_naive = pd.Timestamp(day)
    if day_naive.tzinfo is not None:
        day_naive = day_naive.tz_convert("Asia/Kolkata").tz_localize(None)
    day_naive = day_naive.normalize()
    idx = pd.DatetimeIndex(vix.index)
    if idx.tz is not None:
        idx = idx.tz_convert("Asia/Kolkata").tz_localize(None)
    idx = idx.normalize()
    col = "vix" if "vix" in vix.columns else "close"
    values = vix.loc[idx == day_naive, col]
    if values.empty:
        return None
    return float(values.iloc[0])


def _lookup_option_bar(
    option_bars: pd.DataFrame | None,
    ts: pd.Timestamp,
    option_type: str,
    strike: float | None,
) -> pd.Series | None:
    if option_bars is None or option_bars.empty:
        return None
    subset = option_bars
    if "option_type" in subset.columns:
        subset = subset[subset["option_type"] == option_type]
    if strike is not None and "strike" in subset.columns and not subset.empty:
        exact = subset[(subset["strike"] - strike).abs() <= 1e-6]
        subset = exact if not exact.empty else subset.assign(_d=(subset["strike"] - strike).abs()).sort_values("_d")
    if subset.empty:
        return None
    if ts in subset.index:
        row = subset.loc[ts]
        return row.iloc[0] if isinstance(row, pd.DataFrame) else row
    earlier = subset.loc[:ts]
    if earlier.empty:
        return None
    return earlier.iloc[-1]


def _premium_ohlc(
    position: OpenPosition,
    bar: pd.Series,
    config: StrategyConfig,
    option_bars: pd.DataFrame | None,
    ts: pd.Timestamp,
) -> tuple[float, float, float, float]:
    opt = _lookup_option_bar(option_bars, ts, position.option_type, position.strike)
    if opt is not None:
        return float(opt["open"]), float(opt["high"]), float(opt["low"]), float(opt["close"])
    spots = [float(bar["open"]), float(bar["high"]), float(bar["low"]), float(bar["close"])]
    prems = [
        project_premium(
            position.entry_premium,
            position.entry_spot,
            spot,
            position.delta,
            position.option_type,
            config,
        )
        for spot in spots
    ]
    return prems[0], max(prems), min(prems), prems[3]


def _choose_strike(
    option_bars: pd.DataFrame | None,
    spot: float,
    option_type: str,
    ts: pd.Timestamp,
    config: StrategyConfig,
) -> StrikeChoice:
    if option_bars is not None and not option_bars.empty:
        chosen = choose_from_chain(option_bars, spot=spot, option_type=option_type, ts=ts, config=config)
        if chosen:
            return chosen
    return proxy_choice(spot, option_type, ts, config)


def _minutes_after_or(ts: pd.Timestamp, or_end: pd.Timestamp | None) -> int:
    if or_end is None:
        return 0
    return int((ts - or_end).total_seconds() // 60)


def run_backtest(
    index_bars: pd.DataFrame,
    *,
    option_bars: pd.DataFrame | None = None,
    vix: pd.DataFrame | None = None,
    config: StrategyConfig | None = None,
) -> BacktestResult:
    config = config or StrategyConfig()
    used_proxy = option_bars is None or option_bars.empty
    uncertainty = (
        "INDICATIVE: option premiums are Black–Scholes/delta proxies from index bars. "
        "Do not treat fills as live-tradable until real CE/PE LTP is supplied."
        if used_proxy
        else "Option bars supplied; still allow for bid-ask vs LTP and unmodelled queue position."
    )

    trades: list[ClosedTrade] = []
    skips: list[DaySkip] = []
    dates = trading_dates(index_bars)
    prev_close: float | None = None
    prev_range: float | None = None
    equity = config.capital
    equity_rows: list[dict[str, Any]] = []

    for day in dates:
        day_bars = add_vwap(day_slice(index_bars, day))
        if day_bars.empty:
            continue
        filters = evaluate_day_filters(
            day_bars,
            prev_close=prev_close,
            prev_range=prev_range,
            vix=_vix_on_day(vix, day),
            config=config,
        )
        day_key = day_bars.index[0].normalize()
        day_pnl = 0.0
        full_1r_losses = 0
        trades_today = 0
        orb_break_seen = False
        orb_filled = False
        orb_hit_target = False
        had_full_stop = False
        entries_enabled = True
        pending: dict[str, Any] | None = None
        position: OpenPosition | None = None
        filled_this_day = False

        if not filters.ok:
            skips.append(DaySkip(day=day_key, reason=filters.reason or "filter", expiry_day=filters.expiry_day))

        def record_close(closed: ClosedTrade) -> None:
            nonlocal day_pnl, equity, trades_today, had_full_stop, orb_hit_target
            nonlocal entries_enabled, filled_this_day, full_1r_losses
            trades.append(closed)
            filled_this_day = True
            day_pnl += closed.pnl
            equity += closed.pnl
            trades_today += 1
            if closed.outcome in {"stop", "stop_priority"}:
                had_full_stop = True
                full_1r_losses += 1
            if closed.outcome == "target" and closed.setup == "orb":
                orb_hit_target = True
            if daily_halt(day_pnl, full_1r_losses, config):
                entries_enabled = False

        for i, (ts, bar) in enumerate(day_bars.iterrows()):
            if position is not None:
                o, h, l, c = _premium_ohlc(position, bar, config, option_bars, ts)
                closed = manage_bar(
                    position,
                    bar_time=ts,
                    premium_open=o,
                    premium_high=h,
                    premium_low=l,
                    premium_close=c,
                    spot_close=float(bar["close"]),
                    config=config,
                    expiry_day=filters.expiry_day,
                )
                if closed:
                    record_close(closed)
                    position = None
                continue

            if pending is not None:
                if not entries_enabled or trades_today >= config.max_trades_per_day:
                    pending = None
                else:
                    choice: StrikeChoice = pending["choice"]
                    spot = float(bar["open"])
                    fill_px = choice.premium
                    opt = _lookup_option_bar(option_bars, ts, choice.option_type, choice.strike)
                    if opt is not None:
                        fill_px = float(opt["open"])
                    opened = position_from_fill(
                        day=day_key,
                        setup=pending["setup"],
                        option_type=choice.option_type,
                        strike=choice.strike,
                        entry_time=ts,
                        entry_spot=spot,
                        raw_premium=fill_px,
                        delta=choice.delta,
                        index_stop_points=pending["stop_points"],
                        config=config,
                        source=choice.source,
                    )
                    pending = None
                    if opened is None:
                        skips.append(DaySkip(day=day_key, reason="1r_too_large_or_invalid_stop", expiry_day=filters.expiry_day))
                    else:
                        if opened.setup == "orb":
                            orb_filled = True
                        position = opened
                        filled_this_day = True
                        o, h, l, c = _premium_ohlc(position, bar, config, option_bars, ts)
                        closed = manage_bar(
                            position,
                            bar_time=ts,
                            premium_open=o,
                            premium_high=h,
                            premium_low=l,
                            premium_close=c,
                            spot_close=float(bar["close"]),
                            config=config,
                            expiry_day=filters.expiry_day,
                        )
                        if closed:
                            record_close(closed)
                            position = None
                continue

            if not filters.ok or not entries_enabled or past_last_entry(ts, config):
                continue
            if not past_or_end(ts, filters.or_end):
                continue
            if trades_today >= config.max_trades_per_day:
                continue

            if not orb_break_seen:
                direction = orb_direction(bar, filters, config)
                beyond = filters.or_high is not None and (
                    float(bar["close"]) > filters.or_high or float(bar["close"]) < filters.or_low
                )
                if beyond:
                    orb_break_seen = True
                if direction:
                    pending = {
                        "choice": _choose_strike(option_bars, float(bar["close"]), direction, ts, config),
                        "setup": "orb",
                        "stop_points": filters.or_width or config.or_min_width,
                    }
                continue

            if not config.allow_vwap_pullback or had_full_stop or i == 0:
                continue
            allow = orb_hit_target or (not orb_filled and (orb_break_seen or _minutes_after_or(ts, filters.or_end) >= 45))
            if not allow:
                continue
            pull = vwap_pullback_direction(bar, day_bars.iloc[i - 1], config)
            if not pull:
                continue
            stop_points = max(abs(float(bar["close"]) - float(bar["vwap"])) + 12.0, 20.0)
            pending = {
                "choice": _choose_strike(option_bars, float(bar["close"]), pull, ts, config),
                "setup": "vwap_pullback",
                "stop_points": stop_points,
            }

        if position is not None:
            last_ts = day_bars.index[-1]
            last = day_bars.iloc[-1]
            o, h, l, c = _premium_ohlc(position, last, config, option_bars, last_ts)
            forced = manage_bar(
                position,
                bar_time=last_ts,
                premium_open=o,
                premium_high=h,
                premium_low=l,
                premium_close=c,
                spot_close=float(last["close"]),
                config=config,
                expiry_day=filters.expiry_day,
            )
            if forced is None:
                forced = _close(
                    position,
                    last_ts,
                    apply_slippage(c, "sell", config),
                    float(last["close"]),
                    config,
                    "time",
                    filters.expiry_day,
                )
            record_close(forced)

        if filters.ok and not filled_this_day and not any(s.day == day_key and s.reason != "1r_too_large_or_invalid_stop" for s in skips):
            skips.append(DaySkip(day=day_key, reason="no_setup", expiry_day=filters.expiry_day))

        equity_rows.append({"datetime": day_bars.index[-1], "equity": equity, "day_pnl": day_pnl})
        prev_close = float(day_bars.iloc[-1]["close"])
        prev_range = float(day_bars["high"].max() - day_bars["low"].min())

    trade_df = pd.DataFrame([asdict(t) for t in trades])
    skip_df = pd.DataFrame([asdict(s) for s in skips])
    equity_df = pd.DataFrame(equity_rows)
    summary = summarize(trade_df, skip_df, equity_df, config, n_days=len(dates))
    summary["uncertainty"] = uncertainty
    summary["used_option_proxy"] = used_proxy
    return BacktestResult(
        trades=trade_df,
        skips=skip_df,
        equity=equity_df,
        summary=summary,
        config=config,
        uncertainty=uncertainty,
    )


def summarize(
    trades: pd.DataFrame,
    skips: pd.DataFrame,
    equity: pd.DataFrame,
    config: StrategyConfig,
    n_days: int,
) -> dict[str, Any]:
    if trades.empty:
        return {
            "trades": 0,
            "sessions": n_days,
            "skip_days": int(len(skips)),
            "skip_rate": 1.0 if n_days else 0.0,
            "expectancy_r": 0.0,
            "profit_factor": 0.0,
            "win_rate": 0.0,
            "max_drawdown": 0.0,
            "avg_trades_per_day": 0.0,
            "max_trades_in_a_day": 0,
            "target_pct": 0.0,
            "scratch_pct": 0.0,
            "stop_pct": 0.0,
            "time_exit_pct": 0.0,
            "net_pnl": 0.0,
            "median_winner_r": 0.0,
            "expiry_day_trades": 0,
            "expiry_day_pnl": 0.0,
            "final_equity": config.capital,
        }
    pnl = trades["pnl"].astype(float)
    r_mult = trades["r_multiple"].astype(float)
    wins = pnl[pnl > 0].sum()
    losses = -pnl[pnl < 0].sum()
    pf = float(wins / losses) if losses > 0 else float("inf")
    outcomes = trades["outcome"].astype(str)
    n = len(trades)
    eq = equity["equity"].astype(float) if not equity.empty else pd.Series([config.capital])
    peak = eq.cummax()
    dd = (eq - peak) / peak.replace(0, pd.NA)
    max_dd = float(dd.min()) if len(dd) else 0.0
    by_day = trades.groupby("day").size()
    expiry_trades = trades[trades["expiry_day"] == True] if "expiry_day" in trades.columns else trades.iloc[0:0]
    return {
        "trades": int(n),
        "sessions": int(n_days),
        "skip_days": int(len(skips)),
        "skip_rate": float(len(skips) / n_days) if n_days else 0.0,
        "avg_trades_per_day": float(n / n_days) if n_days else 0.0,
        "max_trades_in_a_day": int(by_day.max()) if len(by_day) else 0,
        "net_pnl": float(pnl.sum()),
        "expectancy_r": float(r_mult.mean()),
        "median_winner_r": float(r_mult[pnl > 0].median()) if (pnl > 0).any() else 0.0,
        "profit_factor": pf,
        "win_rate": float((pnl > 0).mean()),
        "target_pct": float((outcomes == "target").mean()),
        "scratch_pct": float((outcomes == "scratch").mean()),
        "stop_pct": float(outcomes.isin(["stop", "stop_priority"]).mean()),
        "time_exit_pct": float((outcomes == "time").mean()),
        "max_drawdown": max_dd,
        "expiry_day_trades": int(len(expiry_trades)),
        "expiry_day_pnl": float(expiry_trades["pnl"].sum()) if len(expiry_trades) else 0.0,
        "final_equity": float(eq.iloc[-1]) if len(eq) else config.capital,
    }


def slice_index_days(index_bars: pd.DataFrame, days: list[pd.Timestamp]) -> pd.DataFrame:
    if not days:
        return index_bars.iloc[0:0]
    normalized = {pd.Timestamp(d).normalize() for d in days}
    return index_bars.loc[index_bars.index.normalize().isin(normalized)]
