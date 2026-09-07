from __future__ import annotations

from dataclasses import dataclass

from nifty_orb.config import CostConfig, StrategyConfig


@dataclass(frozen=True)
class RoundTripCost:
    buy_cash: float
    sell_cash: float
    total: float
    breakeven_premium_buffer: float


def premium_notional(premium: float, config: StrategyConfig) -> float:
    return abs(premium) * config.lot_size * config.lots


def round_trip_cost(entry_premium: float, exit_premium: float, config: StrategyConfig) -> RoundTripCost:
    """Cash costs for buying then selling one options lot (intraday debit)."""
    fees = config.costs
    buy_notional = premium_notional(entry_premium, config)
    sell_notional = premium_notional(exit_premium, config)
    buy_brokerage = fees.brokerage_per_order
    sell_brokerage = fees.brokerage_per_order
    buy_exchange = buy_notional * fees.exchange_rate_on_premium
    sell_exchange = sell_notional * fees.exchange_rate_on_premium
    buy_sebi = buy_notional * fees.sebi_rate_on_premium
    sell_sebi = sell_notional * fees.sebi_rate_on_premium
    stamp = buy_notional * fees.stamp_rate_on_buy_premium
    stt = sell_notional * fees.stt_sell_premium_rate
    gst = fees.gst_on_brokerage_exchange * (
        buy_brokerage + sell_brokerage + buy_exchange + sell_exchange
    )
    buy_cash = buy_brokerage + buy_exchange + buy_sebi + stamp + gst / 2
    sell_cash = sell_brokerage + sell_exchange + sell_sebi + stt + gst / 2
    total = buy_cash + sell_cash
    qty = config.lot_size * config.lots
    buffer = total / qty if qty else 0.0
    return RoundTripCost(buy_cash=buy_cash, sell_cash=sell_cash, total=total, breakeven_premium_buffer=buffer)


def apply_slippage(premium: float, side: str, config: StrategyConfig) -> float:
    """side: 'buy' worsens fill up; 'sell' worsens fill down."""
    slip = max(premium, 0.01) * config.costs.slippage_premium_pct
    if side == "buy":
        return premium + slip
    return max(0.05, premium - slip)


def net_pnl(entry_premium: float, exit_premium: float, config: StrategyConfig) -> float:
    gross = (exit_premium - entry_premium) * config.lot_size * config.lots
    costs = round_trip_cost(entry_premium, exit_premium, config).total
    return gross - costs
