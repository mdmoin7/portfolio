from __future__ import annotations

import argparse
from pathlib import Path

from nifty_orb.backtest import run_backtest
from nifty_orb.config import ExitMode, StrategyConfig
from nifty_orb.data.adapter import canonicalize_bars, describe_schema, load_bars
from nifty_orb.data.synthetic import generate_index_days, generate_option_bars, generate_vix, write_samples
from nifty_orb.report import print_summary, write_report
from nifty_orb.wfo import grid_search, walk_forward


def _config_from_args(args: argparse.Namespace) -> StrategyConfig:
    return StrategyConfig(
        capital=args.capital,
        or_minutes=args.or_minutes,
        vwap_filter=not args.no_vwap,
        skip_expiry_tuesday=args.skip_expiry,
        exit_mode=ExitMode(args.exit_mode),
        allow_vwap_pullback=not args.no_pullback,
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Nifty 1.5R ORB options research backtester (not live trading, not advice)."
    )
    parser.add_argument("--index", help="CSV/Parquet of Nifty OHLC bars")
    parser.add_argument("--options", help="Optional CE/PE bar or chain file")
    parser.add_argument("--vix", help="Optional India VIX daily file")
    parser.add_argument("--synthetic", action="store_true", help="Run on generated 1-minute sessions")
    parser.add_argument("--sessions", type=int, default=40, help="Synthetic session count")
    parser.add_argument("--write-samples", metavar="DIR", help="Write small sample CSVs and exit")
    parser.add_argument("--describe", metavar="FILE", help="Print inferred schema for a file and exit")
    parser.add_argument("--capital", type=float, default=100_000)
    parser.add_argument("--or-minutes", type=int, default=15, dest="or_minutes")
    parser.add_argument("--no-vwap", action="store_true")
    parser.add_argument("--skip-expiry", action="store_true")
    parser.add_argument("--no-pullback", action="store_true")
    parser.add_argument(
        "--exit-mode",
        default="be_then_1_5",
        choices=["flatten_1_5", "be_then_1_5", "be_then_trail"],
    )
    parser.add_argument("--wfo", action="store_true", help="Rolling walk-forward on the small parameter grid")
    parser.add_argument("--grid", action="store_true", help="Full-sample grid (overfit risk; for research only)")
    parser.add_argument("--out", default="output", help="Report directory")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.describe:
        info = describe_schema(args.describe)
        print(f"path: {info['path']}")
        print(f"rows: {info['rows']}")
        print(f"inferred_kind: {info['inferred_kind']}")
        print(f"columns: {info['columns']}")
        return 0
    if args.write_samples:
        paths = write_samples(args.write_samples)
        for key, path in paths.items():
            print(f"{key}: {path}")
        return 0

    config = _config_from_args(args)
    option_bars = None
    vix = None
    if args.synthetic:
        index_bars = generate_index_days(sessions=args.sessions)
        option_bars = canonicalize_bars(generate_option_bars(index_bars, config), kind="option_bars", config=config).bars
        vix = generate_vix(index_bars)
    else:
        if not args.index:
            print("Provide --index PATH or --synthetic")
            return 2
        loaded = load_bars(args.index, config=config, kind="index")
        index_bars = loaded.bars
        print("index:", "; ".join(loaded.notes))
        if args.options:
            opt = load_bars(args.options, config=config)
            option_bars = opt.bars
            print("options:", "; ".join(opt.notes))
        if args.vix:
            vix_loaded = load_bars(args.vix, config=config, kind="vix")
            vix = vix_loaded.bars

    if args.grid:
        table = grid_search(index_bars, option_bars=option_bars, vix=vix, base=config)
        out = Path(args.out)
        out.mkdir(parents=True, exist_ok=True)
        path = out / "grid.csv"
        table.to_csv(path, index=False)
        print(table.head(12).to_string(index=False))
        print(f"wrote {path}")
        return 0

    if args.wfo:
        folds = walk_forward(index_bars, option_bars=option_bars, vix=vix, base=config)
        out = Path(args.out)
        out.mkdir(parents=True, exist_ok=True)
        path = out / "wfo.csv"
        folds.to_csv(path, index=False)
        if folds.empty:
            print("Not enough sessions for walk-forward (need train_days + test_days).")
        else:
            print(folds.to_string(index=False))
        print(f"wrote {path}")
        return 0

    result = run_backtest(index_bars, option_bars=option_bars, vix=vix, config=config)
    print_summary(result)
    paths = write_report(result, args.out)
    print("reports:", paths)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
