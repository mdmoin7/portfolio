# Nifty 1.5R ORB lab (research only)

Intraday Nifty directional option-buying research engine: 15-minute opening-range breakout, optional VWAP pullback, **1.5R** target, stop-to-breakeven, **1–3 trades/day**, costs included.

This is **not** live trading and **not** investment advice. Index-only runs approximate option premiums (Black–Scholes / delta) and are labelled **INDICATIVE**.

## Setup

```bash
cd nifty-orb-lab
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

## Run

Synthetic smoke test:

```bash
python -m nifty_orb --synthetic --sessions 40 --out output
```

Your files (CSV or Parquet). Column names are inferred (`datetime` / `date`+`time`, `open/high/low/close/ltp`, `strike`, `option_type`, `expiry`, `iv`):

```bash
python -m nifty_orb --index path/to/nifty_1min.csv --options path/to/option_bars.csv --vix path/to/vix.csv --out output
python -m nifty_orb --describe path/to/nifty_1min.csv
```

Walk-forward (OR 15 vs 30, VWAP on/off, skip Tuesday expiry on/off, flatten 1.5R vs BE-then-1.5R):

```bash
python -m nifty_orb --index path/to/nifty_1min.csv --wfo --out output
```

Write tiny sample CSVs:

```bash
python -m nifty_orb --write-samples data/samples
```

## Rules encoded

- Session 09:15–15:30 IST; OR from 09:15 for `or_minutes`; entries on **next bar**; hard exit 15:10.
- Long CE only on OR high break with optional VWAP confirmation; PE on OR low break.
- 1 lot; skip if 1R > 2% of capital; daily halt at ~2.5% or two full 1R losses.
- After +1R, stop moves to breakeven plus round-trip costs (STT on sell premium, brokerage, exchange, GST).
- VWAP pullback only if ORB was skipped/failed or already hit 1.5R — never after a full stop.

## Reports

`output/run_summary.json`, `run_trades.csv`, `run_skips.csv`, `run_equity.csv`.

Pass bar: skip a large share of days, ≤3 trades/session, **expectancy_r > 0** and **profit_factor > 1.2 after costs** on walk-forward — not on a single in-sample curve.
