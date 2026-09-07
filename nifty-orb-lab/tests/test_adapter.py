from __future__ import annotations

from pathlib import Path

import pandas as pd

from nifty_orb.config import StrategyConfig
from nifty_orb.data.adapter import canonicalize_bars, infer_kind
from nifty_orb.data.session import opening_range


def test_infers_index_and_maps_aliases(tmp_path: Path) -> None:
    frame = pd.DataFrame(
        {
            "Date": ["2024-01-02"] * 3,
            "TradeTime": ["09:16:00", "09:17:00", "09:18:00"],
            "Into": [24500, 24510, 24505],
            "High_Price": [24520, 24522, 24518],
            "Low_Price": [24490, 24500, 24495],
            "LTP": [24510, 24508, 24512],
            "Qty": [1000, 1100, 900],
        }
    )
    path = tmp_path / "alt.csv"
    frame.to_csv(path, index=False)
    raw = pd.read_csv(path)
    assert infer_kind(raw) == "index"
    loaded = canonicalize_bars(raw, kind="index", config=StrategyConfig())
    assert list(loaded.bars.columns)[:5] == ["open", "high", "low", "close", "volume"]
    assert len(loaded.bars) == 3
    assert loaded.bars.index.tz is not None


def test_infers_option_bars() -> None:
    idx = pd.date_range("2024-01-02 09:15", periods=2, freq="min")
    frame = pd.DataFrame(
        {
            "timestamp": list(idx) + list(idx),
            "open": [120, 121, 118, 119],
            "high": [122, 123, 120, 121],
            "low": [119, 120, 117, 118],
            "close": [121, 122, 119, 120],
            "strike": [24500, 24500, 24500, 24500],
            "option_type": ["CE", "CE", "PE", "PE"],
            "expiry_date": ["2024-01-02"] * 4,
        }
    )
    loaded = canonicalize_bars(frame, kind="auto")
    assert loaded.kind == "option_bars"
    assert set(loaded.bars["option_type"]) == {"CE", "PE"}


def test_opening_range_15m() -> None:
    idx = pd.date_range("2024-01-02 09:15", periods=20, freq="min", tz="Asia/Kolkata")
    close = 24500 + pd.Series(range(20), dtype=float).to_numpy()
    bars = pd.DataFrame(
        {
            "open": close,
            "high": close + 2,
            "low": close - 1,
            "close": close,
            "volume": 1,
        },
        index=idx,
    )
    result = opening_range(bars, 15, "09:15")
    assert result is not None
    high, low, end = result
    assert high == float((close + 2)[:15].max())
    assert low == float((close - 1)[:15].min())
    assert end.hour == 9 and end.minute == 30
