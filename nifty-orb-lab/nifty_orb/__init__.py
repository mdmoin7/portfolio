"""Nifty 1.5R ORB options research lab (backtest only)."""

from nifty_orb.config import StrategyConfig
from nifty_orb.backtest import BacktestResult, run_backtest
from nifty_orb.wfo import walk_forward

__all__ = ["StrategyConfig", "BacktestResult", "run_backtest", "walk_forward"]
__version__ = "0.1.0"
