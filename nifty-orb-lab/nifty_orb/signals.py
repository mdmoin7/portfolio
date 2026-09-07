from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from nifty_orb.config import StrategyConfig
from nifty_orb.data.session import is_expiry_tuesday, opening_range, parse_hhmm


def add_vwap(day_bars: pd.DataFrame) -> pd.DataFrame:
    out = day_bars.copy()
    typical = (out["high"] + out["low"] + out["close"]) / 3.0
    vol = out["volume"].replace(0, np.nan).fillna(1.0)
    cum_pv = (typical * vol).cumsum()
    cum_v = vol.cumsum()
    out["vwap"] = cum_pv / cum_v
    return out


@dataclass
class DayFilters:
    ok: bool
    reason: str | None
    or_high: float | None
    or_low: float | None
    or_end: pd.Timestamp | None
    or_width: float | None
    gap_pct: float | None
    expiry_day: bool


def evaluate_day_filters(
    day_bars: pd.DataFrame,
    *,
    prev_close: float | None,
    prev_range: float | None,
    vix: float | None,
    config: StrategyConfig,
) -> DayFilters:
    day = day_bars.index[0]
    expiry = is_expiry_tuesday(day)
    if config.skip_expiry_tuesday and expiry:
        return DayFilters(False, "expiry_tuesday", None, None, None, None, None, expiry)

    orb = opening_range(day_bars, config.or_minutes, config.session_start)
    if orb is None:
        return DayFilters(False, "no_opening_range", None, None, None, None, None, expiry)
    or_high, or_low, or_end = orb
    width = or_high - or_low
    if width < config.or_min_width:
        return DayFilters(False, "or_too_tight", or_high, or_low, or_end, width, None, expiry)
    if width > config.or_max_width:
        return DayFilters(False, "or_too_wide", or_high, or_low, or_end, width, None, expiry)

    gap_pct = None
    if prev_close:
        open_px = float(day_bars.iloc[0]["open"])
        gap_pct = abs(open_px - prev_close) / prev_close
        if gap_pct > config.gap_skip_pct:
            return DayFilters(False, "gap", or_high, or_low, or_end, width, gap_pct, expiry)

    if prev_range is not None and prev_range > config.realized_range_skip:
        return DayFilters(False, "prev_range", or_high, or_low, or_end, width, gap_pct, expiry)

    if config.vix_skip_above is not None and vix is not None and vix > config.vix_skip_above:
        return DayFilters(False, "vix", or_high, or_low, or_end, width, gap_pct, expiry)

    return DayFilters(True, None, or_high, or_low, or_end, width, gap_pct, expiry)


def orb_direction(bar: pd.Series, filters: DayFilters, config: StrategyConfig) -> str | None:
    if filters.or_high is None or filters.or_low is None:
        return None
    close = float(bar["close"])
    vwap = float(bar.get("vwap", close))
    if close > filters.or_high:
        if config.vwap_filter and close < vwap:
            return None
        return "CE"
    if close < filters.or_low:
        if config.vwap_filter and close > vwap:
            return None
        return "PE"
    return None


def vwap_pullback_direction(bar: pd.Series, prev: pd.Series, config: StrategyConfig) -> str | None:
    vwap = float(bar["vwap"])
    close = float(bar["close"])
    high = float(bar["high"])
    low = float(bar["low"])
    buf = config.vwap_touch_buffer
    if close > vwap and low <= vwap + buf and close >= float(prev["close"]):
        return "CE"
    if close < vwap and high >= vwap - buf and close <= float(prev["close"]):
        return "PE"
    return None


def past_last_entry(ts: pd.Timestamp, config: StrategyConfig) -> bool:
    h, m = parse_hhmm(config.last_entry)
    return ts.hour > h or (ts.hour == h and ts.minute >= m)


def past_or_end(ts: pd.Timestamp, or_end: pd.Timestamp | None) -> bool:
    if or_end is None:
        return False
    return ts >= or_end
