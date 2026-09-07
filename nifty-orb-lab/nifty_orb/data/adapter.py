"""Map messy broker/export CSVs onto a canonical bar schema."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Literal

import pandas as pd

from nifty_orb.config import StrategyConfig
from nifty_orb.data.session import ensure_datetime_index, filter_session, load_tabular

Kind = Literal["index", "option_bars", "chain", "vix"]

COLUMN_ALIASES: dict[str, tuple[str, ...]] = {
    "datetime": (
        "datetime",
        "date_time",
        "timestamp",
        "ts",
        "time",
        "dt",
        "datetime_ist",
    ),
    "date": ("date", "trade_date", "trd_date"),
    "clock": ("clock", "trade_time", "tradetime", "time_ist", "bar_time"),
    "open": ("open", "o", "open_price", "into"),
    "high": ("high", "h", "high_price"),
    "low": ("low", "l", "low_price"),
    "close": ("close", "c", "close_price", "ltp", "last", "settle", "settlement"),
    "volume": ("volume", "vol", "qty", "quantity", "traded_qty"),
    "strike": ("strike", "strike_price", "stk"),
    "option_type": ("option_type", "opttype", "type", "ce_pe", "instrument_type", "opt_type"),
    "expiry": ("expiry", "expiry_date", "exp", "expiration"),
    "iv": ("iv", "implied_vol", "implied_volatility", "iv_pct"),
    "oi": ("oi", "open_interest", "openinterest"),
    "delta": ("delta", "opt_delta"),
    "symbol": ("symbol", "ticker", "tradingsymbol", "contract"),
    "vix": ("vix", "india_vix", "indvix", "close"),
}


@dataclass
class LoadResult:
    kind: Kind
    bars: pd.DataFrame
    notes: list[str]


def _norm(name: str) -> str:
    return "".join(ch for ch in name.lower().strip() if ch.isalnum() or ch == "_").replace("__", "_")


def _find_column(columns: list[str], logical: str) -> str | None:
    aliases = COLUMN_ALIASES[logical]
    normalized = {_norm(col): col for col in columns}
    for alias in aliases:
        key = _norm(alias)
        if key in normalized:
            return normalized[key]
    for col in columns:
        n = _norm(col)
        if n.endswith(logical) or logical in n.split("_"):
            return col
    return None


def infer_kind(frame: pd.DataFrame, hint: Kind | Literal["auto"] = "auto") -> Kind:
    if hint != "auto":
        return hint
    cols = [_norm(c) for c in frame.columns]
    joined = " ".join(cols)
    if "strike" in cols and (
        "option_type" in cols
        or "optiontype" in joined.replace("_", "")
        or "opttype" in joined
        or "ce_pe" in cols
    ):
        if "open" in cols and "high" in cols:
            return "option_bars"
        return "chain"
    if "vix" in joined or "indvix" in joined:
        return "vix"
    return "index"


def _combine_datetime(frame: pd.DataFrame, tz: str) -> pd.Series:
    cols = list(frame.columns)
    date_col = _find_column(cols, "date")
    clock_col = _find_column(cols, "clock")
    if date_col and clock_col and date_col != clock_col:
        return pd.to_datetime(
            frame[date_col].astype(str).str.strip() + " " + frame[clock_col].astype(str).str.strip(),
            errors="coerce",
        )
    dt_col = _find_column(cols, "datetime")
    if dt_col:
        return pd.to_datetime(frame[dt_col], errors="coerce", utc=False)
    if date_col:
        return pd.to_datetime(frame[date_col], errors="coerce")
    raise ValueError(
        "Could not find a datetime column. Expected one of: "
        f"{COLUMN_ALIASES['datetime']} or separate date + time columns."
    )


def _optional_numeric(frame: pd.DataFrame, logical: str) -> pd.Series | None:
    col = _find_column(list(frame.columns), logical)
    if col is None:
        return None
    return pd.to_numeric(frame[col], errors="coerce")


def _map_option_type(series: pd.Series) -> pd.Series:
    mapped = series.astype(str).str.upper().str.strip()
    mapped = mapped.replace(
        {
            "CALL": "CE",
            "C": "CE",
            "CE": "CE",
            "PUT": "PE",
            "P": "PE",
            "PE": "PE",
        }
    )
    return mapped


def canonicalize_bars(
    frame: pd.DataFrame,
    *,
    kind: Kind | Literal["auto"] = "auto",
    config: StrategyConfig | None = None,
) -> LoadResult:
    config = config or StrategyConfig()
    notes: list[str] = []
    raw = frame.copy()
    raw.columns = [str(c).strip() for c in raw.columns]
    resolved_kind = infer_kind(raw, kind if kind != "auto" else config.data_kind)

    dt = _combine_datetime(raw, config.timezone)
    if dt.isna().all():
        raise ValueError("Datetime column parsed to all NaT.")

    out = pd.DataFrame(index=pd.DatetimeIndex(dt, name="datetime"))
    for field in ("open", "high", "low", "close"):
        series = _optional_numeric(raw, field)
        if series is None:
            if field == "close":
                raise ValueError("Missing close/LTP column.")
            notes.append(f"Missing {field}; filled from close.")
            continue
        out[field] = series.values

    if "close" not in out.columns:
        raise ValueError("Canonical bars require a close column.")
    for field in ("open", "high", "low"):
        if field not in out.columns:
            out[field] = out["close"]

    volume = _optional_numeric(raw, "volume")
    out["volume"] = volume.values if volume is not None else 0.0

    strike = _optional_numeric(raw, "strike")
    if strike is not None:
        out["strike"] = strike.values
    opt_col = _find_column(list(raw.columns), "option_type")
    if opt_col:
        out["option_type"] = _map_option_type(raw[opt_col]).values
    expiry_col = _find_column(list(raw.columns), "expiry")
    if expiry_col:
        out["expiry"] = pd.to_datetime(raw[expiry_col], errors="coerce").values
    iv = _optional_numeric(raw, "iv")
    if iv is not None:
        values = iv.values.astype(float)
        if pd.Series(values).dropna().median() > 1.5:
            values = values / 100.0
            notes.append("Interpreted IV as percent and divided by 100.")
        out["iv"] = values
    delta = _optional_numeric(raw, "delta")
    if delta is not None:
        out["delta"] = delta.values
    oi = _optional_numeric(raw, "oi")
    if oi is not None:
        out["oi"] = oi.values
    symbol_col = _find_column(list(raw.columns), "symbol")
    if symbol_col:
        out["symbol"] = raw[symbol_col].astype(str).values

    if resolved_kind == "vix" and "close" in out.columns:
        out["vix"] = out["close"]

    out = out[~out.index.isna()]
    out = ensure_datetime_index(out, config.timezone)
    if resolved_kind != "vix":
        out = filter_session(out, config)
    if resolved_kind in {"option_bars", "chain"}:
        keys = [c for c in ("option_type", "strike", "expiry") if c in out.columns]
        if keys:
            flag = pd.DataFrame({"datetime": out.index, **{k: out[k].values for k in keys}}).duplicated(keep="last")
            out = out.loc[~flag.values]
    else:
        out = out[~out.index.duplicated(keep="last")]
    notes.append(f"Inferred kind={resolved_kind}; rows={len(out)}.")
    return LoadResult(kind=resolved_kind, bars=out, notes=notes)


def load_bars(path: str | Path, config: StrategyConfig | None = None, kind: Kind | Literal["auto"] = "auto") -> LoadResult:
    frame = load_tabular(path)
    return canonicalize_bars(frame, kind=kind, config=config)


def describe_schema(path: str | Path) -> dict[str, object]:
    frame = load_tabular(path)
    return {
        "path": str(path),
        "rows": int(len(frame)),
        "columns": list(frame.columns),
        "inferred_kind": infer_kind(frame),
        "head": frame.head(5).to_dict(orient="list"),
    }
