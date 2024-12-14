import time
import logging

logger = logging.getLogger(__name__)


def log_time(func):
    """This logs the time it took for the solve function to execute"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        print(f"{args[0].__class__.__name__} '{func.__name__}' executed in {time.time() - start_time:.4f} seconds.")
        return result
    return wrapper
