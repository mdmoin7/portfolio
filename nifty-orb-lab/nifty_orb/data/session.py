from __future__ import annotations

from pathlib import Path

import pandas as pd

from nifty_orb.config import StrategyConfig

IST = "Asia/Kolkata"


def parse_hhmm(value: str) -> tuple[int, int]:
    hour, minute = value.split(":")
    return int(hour), int(minute)


def ensure_datetime_index(frame: pd.DataFrame, timezone: str = IST) -> pd.DataFrame:
    out = frame.copy()
    if not isinstance(out.index, pd.DatetimeIndex):
        raise ValueError("Expected a DatetimeIndex after loading bars.")
    idx = out.index
    if idx.tz is None:
        idx = idx.tz_localize(timezone, ambiguous="infer", nonexistent="shift_forward")
    else:
        idx = idx.tz_convert(timezone)
    out.index = idx
    return out.sort_index()


def session_mask(index: pd.DatetimeIndex, config: StrategyConfig) -> pd.Series:
    start_h, start_m = parse_hhmm(config.session_start)
    end_h, end_m = parse_hhmm(config.session_end)
    minutes = index.hour * 60 + index.minute
    start = start_h * 60 + start_m
    end = end_h * 60 + end_m
    return (minutes >= start) & (minutes <= end)


def filter_session(bars: pd.DataFrame, config: StrategyConfig) -> pd.DataFrame:
    mask = session_mask(bars.index, config)
    return bars.loc[mask].copy()


def trading_dates(bars: pd.DataFrame) -> list[pd.Timestamp]:
    return list(pd.DatetimeIndex(bars.index.normalize().unique()).sort_values())


def day_slice(bars: pd.DataFrame, day: pd.Timestamp) -> pd.DataFrame:
    key = pd.Timestamp(day)
    idx_tz = bars.index.tz
    if key.tzinfo is None and idx_tz is not None:
        key = key.tz_localize(idx_tz)
    elif key.tzinfo is not None and idx_tz is not None:
        key = key.tz_convert(idx_tz)
    key = key.normalize()
    return bars[bars.index.normalize() == key]


def is_expiry_tuesday(day: pd.Timestamp) -> bool:
    ts = pd.Timestamp(day)
    return int(ts.dayofweek) == 1


def opening_range(day_bars: pd.DataFrame, or_minutes: int, session_start: str) -> tuple[float, float, pd.Timestamp] | None:
    if day_bars.empty:
        return None
    start_h, start_m = parse_hhmm(session_start)
    first = day_bars.index[0]
    session_open = first.floor("min").replace(hour=start_h, minute=start_m, second=0, microsecond=0)
    or_end = session_open + pd.Timedelta(minutes=or_minutes)
    window = day_bars[(day_bars.index >= session_open) & (day_bars.index < or_end)]
    if window.empty:
        return None
    return float(window["high"].max()), float(window["low"].min()), or_end


def minutes_since_open(ts: pd.Timestamp, session_start: str) -> int:
    h, m = parse_hhmm(session_start)
    open_ts = ts.replace(hour=h, minute=m, second=0, microsecond=0)
    return int((ts - open_ts).total_seconds() // 60)


def load_tabular(path: str | Path) -> pd.DataFrame:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(path)
    suffix = path.suffix.lower()
    if suffix in {".parquet", ".pq"}:
        return pd.read_parquet(path)
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path)
    return pd.read_csv(path)
