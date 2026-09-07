from __future__ import annotations

import math

import numpy as np
import pandas as pd

from nifty_orb.config import StrategyConfig


def _rng(seed: int) -> np.random.Generator:
    return np.random.default_rng(seed)


def session_index(day: pd.Timestamp, freq: str = "1min") -> pd.DatetimeIndex:
    start = day.replace(hour=9, minute=15, second=0, microsecond=0)
    end = day.replace(hour=15, minute=30, second=0, microsecond=0)
    return pd.date_range(start, end, freq=freq, tz="Asia/Kolkata")


def generate_index_days(
    *,
    start: str = "2024-01-02",
    sessions: int = 40,
    seed: int = 7,
    spot0: float = 24500.0,
) -> pd.DataFrame:
    """Generate 1-minute Nifty-like sessions with mixed trend and range days."""
    rng = _rng(seed)
    days = pd.bdate_range(start, periods=sessions, freq="C")
    frames: list[pd.DataFrame] = []
    spot = spot0
    for i, day in enumerate(days):
        idx = session_index(pd.Timestamp(day).tz_localize("Asia/Kolkata"))
        n = len(idx)
        regime = i % 5
        if regime == 0:
            drift = 0.12
        elif regime == 1:
            drift = -0.12
        else:
            drift = rng.choice([-0.02, 0.02, 0.0])
        noise = rng.normal(0, 7.5, size=n)
        ret = drift + noise
        close = spot + np.cumsum(ret)
        open_ = np.concatenate([[spot], close[:-1]])
        high = np.maximum(open_, close) + rng.uniform(2.0, 12.0, size=n)
        low = np.minimum(open_, close) - rng.uniform(2.0, 12.0, size=n)
        volume = rng.integers(800, 4000, size=n)
        gap = rng.normal(0, 25)
        open_[0] = spot + gap
        high[0] = max(open_[0], close[0]) + 1
        low[0] = min(open_[0], close[0]) - 1
        frame = pd.DataFrame(
            {"open": open_, "high": high, "low": low, "close": close, "volume": volume},
            index=idx,
        )
        frames.append(frame)
        spot = float(close[-1])
    out = pd.concat(frames)
    out.index.name = "datetime"
    return out


def generate_vix(index_bars: pd.DataFrame, seed: int = 3) -> pd.DataFrame:
    rng = _rng(seed)
    days = index_bars.index.normalize().unique()
    close = 12 + rng.uniform(0, 8, size=len(days))
    return pd.DataFrame({"vix": close, "close": close}, index=pd.DatetimeIndex(days, name="datetime"))


def generate_option_bars(index_bars: pd.DataFrame, config: StrategyConfig | None = None) -> pd.DataFrame:
    """ATM weekly CE/PE proxy series aligned to index bars (for adapter + tests)."""
    config = config or StrategyConfig()
    rows: list[dict] = []
    for day, group in index_bars.groupby(index_bars.index.normalize()):
        spot = float(group["close"].iloc[0])
        strike = int(round(spot / 50.0) * 50)
        day_ts = pd.Timestamp(day)
        if day_ts.tzinfo is not None:
            day_ts = day_ts.tz_convert("Asia/Kolkata").tz_localize(None)
        expiry = _next_tuesday(day_ts)
        t_years = max((expiry.normalize() - day_ts.normalize()).days, 0) / 365.0 + 1 / (365 * 8)
        atm = max(config.proxy_min_premium, 0.4 * spot * config.default_iv * math.sqrt(t_years))
        for ts, bar in group.iterrows():
            move = float(bar["close"]) - spot
            ce = max(config.proxy_min_premium, atm + config.option_delta * move)
            pe = max(config.proxy_min_premium, atm - config.option_delta * move)
            for opt, px in (("CE", ce), ("PE", pe)):
                rows.append(
                    {
                        "datetime": ts,
                        "open": px,
                        "high": px * 1.004,
                        "low": px * 0.996,
                        "close": px,
                        "volume": 100,
                        "strike": strike,
                        "option_type": opt,
                        "expiry": expiry,
                        "iv": config.default_iv,
                    }
                )
    return pd.DataFrame(rows)


def _next_tuesday(day: pd.Timestamp) -> pd.Timestamp:
    ts = pd.Timestamp(day).tz_localize(None) if pd.Timestamp(day).tzinfo else pd.Timestamp(day)
    ts = ts.normalize()
    ahead = (1 - ts.dayofweek) % 7
    if ahead == 0:
        return ts
    return ts + pd.Timedelta(days=int(ahead))


def write_samples(directory: str, config: StrategyConfig | None = None) -> dict[str, str]:
    from pathlib import Path

    config = config or StrategyConfig()
    directory_path = Path(directory)
    directory_path.mkdir(parents=True, exist_ok=True)
    index = generate_index_days(sessions=8, seed=11)
    options = generate_option_bars(index, config)
    vix = generate_vix(index)
    paths = {
        "index": str(directory_path / "nifty_index_1min.csv"),
        "options": str(directory_path / "nifty_options_1min.csv"),
        "vix": str(directory_path / "india_vix_daily.csv"),
    }
    index.to_csv(paths["index"])
    options.to_csv(paths["options"], index=False)
    vix.to_csv(paths["vix"])
    return paths
