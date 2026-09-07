from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Literal


class ExitMode(str, Enum):
    FLATTEN_1_5 = "flatten_1_5"
    BE_THEN_1_5 = "be_then_1_5"
    BE_THEN_TRAIL = "be_then_trail"


@dataclass(frozen=True)
class CostConfig:
    stt_sell_premium_rate: float = 0.0015
    brokerage_per_order: float = 20.0
    exchange_rate_on_premium: float = 0.00053
    sebi_rate_on_premium: float = 0.000001
    stamp_rate_on_buy_premium: float = 0.00003
    gst_on_brokerage_exchange: float = 0.18
    slippage_premium_pct: float = 0.005


@dataclass(frozen=True)
class StrategyConfig:
    capital: float = 100_000.0
    lot_size: int = 65
    lots: int = 1
    risk_pct_per_trade: float = 0.01
    daily_loss_pct: float = 0.025
    max_1r_losses_per_day: int = 2
    skip_if_1r_exceeds_capital_pct: float = 0.02
    max_trades_per_day: int = 3

    or_minutes: int = 15
    session_start: str = "09:15"
    session_end: str = "15:30"
    time_stop: str = "15:10"
    last_entry: str = "14:30"

    or_min_width: float = 40.0
    or_max_width: float = 180.0
    gap_skip_pct: float = 0.006
    vwap_filter: bool = True
    skip_expiry_tuesday: bool = False
    vix_skip_above: float | None = 22.0
    realized_range_skip: float = 350.0

    target_r: float = 1.5
    be_trigger_r: float = 1.0
    exit_mode: ExitMode = ExitMode.BE_THEN_1_5
    trail_index_points: float = 15.0
    allow_vwap_pullback: bool = True
    vwap_touch_buffer: float = 8.0

    option_delta: float = 0.50
    default_iv: float = 0.14
    proxy_min_premium: float = 5.0
    premium_band: tuple[float, float] = (80.0, 280.0)

    timezone: str = "Asia/Kolkata"
    next_bar_entry: bool = True

    costs: CostConfig = field(default_factory=CostConfig)

    data_kind: Literal["auto", "index", "option_bars", "chain"] = "auto"


WFO_GRID: dict[str, list] = {
    "or_minutes": [15, 30],
    "vwap_filter": [True, False],
    "skip_expiry_tuesday": [True, False],
    "exit_mode": [ExitMode.FLATTEN_1_5, ExitMode.BE_THEN_1_5],
}
