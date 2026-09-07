"""Strike / premium selection from a chain or a Black–Scholes ATM proxy."""

from __future__ import annotations

import math
from dataclasses import dataclass

import pandas as pd

from nifty_orb.config import StrategyConfig


def _norm_cdf(x: float) -> float:
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def years_to_tuesday(now: pd.Timestamp) -> float:
    ts = pd.Timestamp(now)
    naive = ts.tz_localize(None) if ts.tzinfo else ts
    dte_days = (1 - naive.dayofweek) % 7
    # Same-day Tuesday still has a fraction of a session left.
    minutes_left = max((15 * 60 + 30) - (naive.hour * 60 + naive.minute), 5)
    return dte_days / 365.0 + minutes_left / (365.0 * 24 * 60)


def bs_price(spot: float, strike: float, years: float, iv: float, option_type: str, rate: float = 0.06) -> float:
    years = max(years, 1e-6)
    iv = max(iv, 1e-4)
    vol_sqrt = iv * math.sqrt(years)
    d1 = (math.log(spot / strike) + (rate + 0.5 * iv * iv) * years) / vol_sqrt
    d2 = d1 - vol_sqrt
    df = math.exp(-rate * years)
    if option_type == "CE":
        return max(0.05, spot * _norm_cdf(d1) - strike * df * _norm_cdf(d2))
    return max(0.05, strike * df * _norm_cdf(-d2) - spot * _norm_cdf(-d1))


def bs_delta(spot: float, strike: float, years: float, iv: float, option_type: str, rate: float = 0.06) -> float:
    years = max(years, 1e-6)
    iv = max(iv, 1e-4)
    d1 = (math.log(spot / strike) + (rate + 0.5 * iv * iv) * years) / (iv * math.sqrt(years))
    if option_type == "CE":
        return _norm_cdf(d1)
    return _norm_cdf(d1) - 1.0


@dataclass(frozen=True)
class StrikeChoice:
    option_type: str
    strike: float
    premium: float
    delta: float
    expiry: pd.Timestamp | None
    source: str


def nearest_strike(spot: float, step: float = 50.0) -> float:
    return round(spot / step) * step


def choose_from_chain(
    chain: pd.DataFrame,
    *,
    spot: float,
    option_type: str,
    ts: pd.Timestamp,
    config: StrategyConfig,
) -> StrikeChoice | None:
    slice_ = chain
    if "option_type" in slice_.columns:
        slice_ = slice_[slice_["option_type"] == option_type]
    if slice_.empty:
        return None
    at = slice_[slice_.index == ts] if ts in slice_.index else slice_.iloc[0:0]
    if at.empty:
        window = slice_.loc[:ts]
        at = window.tail(1) if not window.empty else slice_.head(1)
    if at.empty:
        return None
    lo, hi = config.premium_band
    ranked = at.copy()
    if "strike" in ranked.columns:
        itm = ranked["strike"] <= spot if option_type == "CE" else ranked["strike"] >= spot
        preferred = ranked[itm]
        ranked = preferred if not preferred.empty else ranked
    ranked = ranked.assign(_prem_dist=(ranked["close"] - 0.5 * (lo + hi)).abs())
    if "delta" in ranked.columns:
        ranked = ranked.assign(_delta_dist=(ranked["delta"].abs() - 0.5).abs())
        row = ranked.sort_values(["_delta_dist", "_prem_dist"]).iloc[0]
        delta = float(row["delta"])
    else:
        row = ranked.sort_values("_prem_dist").iloc[0]
        years = years_to_tuesday(ts)
        delta = bs_delta(spot, float(row.get("strike", nearest_strike(spot))), years, config.default_iv, option_type)
    expiry = row["expiry"] if "expiry" in ranked.columns else None
    return StrikeChoice(
        option_type=option_type,
        strike=float(row.get("strike", nearest_strike(spot))),
        premium=float(row["close"]),
        delta=abs(delta),
        expiry=pd.Timestamp(expiry) if expiry is not None and not pd.isna(expiry) else None,
        source="chain",
    )


def proxy_choice(spot: float, option_type: str, ts: pd.Timestamp, config: StrategyConfig, iv: float | None = None) -> StrikeChoice:
    """Indicative ATM/ITM premium when only index bars exist."""
    iv = iv if iv is not None else config.default_iv
    strike = nearest_strike(spot)
    if option_type == "CE":
        strike = nearest_strike(spot - 25)
    else:
        strike = nearest_strike(spot + 25)
    years = years_to_tuesday(ts)
    premium = bs_price(spot, strike, years, iv, option_type)
    delta = abs(bs_delta(spot, strike, years, iv, option_type))
    lo, hi = config.premium_band
    premium = min(max(premium, lo * 0.5), hi * 1.5)
    return StrikeChoice(
        option_type=option_type,
        strike=strike,
        premium=max(config.proxy_min_premium, premium),
        delta=max(delta, 0.35),
        expiry=None,
        source="index_proxy",
    )


def project_premium(entry_premium: float, entry_spot: float, spot: float, delta: float, option_type: str, config: StrategyConfig) -> float:
    direction = 1.0 if option_type == "CE" else -1.0
    move = (spot - entry_spot) * direction
    return max(config.proxy_min_premium, entry_premium + delta * move)
