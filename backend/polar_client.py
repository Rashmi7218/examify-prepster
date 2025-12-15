import json
import os
from typing import Dict, Optional

from dotenv import load_dotenv

# Load environment variables from .env and .env.local if present
load_dotenv()
load_dotenv(".env.local", override=True)

# Base URLs (override via env if needed)
PRODUCTION_BASE_URL = os.getenv("POLAR_BASE_URL", "https://api.polar.sh/v1")
SANDBOX_BASE_URL = os.getenv(
    "POLAR_SANDBOX_BASE_URL", "https://sandbox-api.polar.sh/v1"
)

# Tokens
PRODUCTION_TOKEN = os.getenv("POLAR_ACCESS_TOKEN")
SANDBOX_TOKEN = os.getenv("POLAR_SANDBOX_ACCESS_TOKEN")

# Default redirect URLs
DEFAULT_SUCCESS_URL = os.getenv("POLAR_SUCCESS_URL", "https://example.com/success")
DEFAULT_CANCEL_URL = os.getenv("POLAR_CANCEL_URL", "https://example.com/cancel")
PAYMENT_PROCESSOR = os.getenv("POLAR_PAYMENT_PROCESSOR", "stripe")


def _load_product_map() -> Dict[str, Dict[str, str]]:
    """
    Reads POLAR_PRODUCT_MAP from env as JSON.
    Expected shape:
    {
      "ai-practitioner": { "practice": "prod_x", "mock": "prod_y", "pro": "prod_z" },
      "cloud-practitioner": { "practice": "...", ... }
    }
    """
    raw = os.getenv("POLAR_PRODUCT_MAP", "{}")
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        pass
    return {}


def resolve_product_id(cert_id: str, tier_id: str) -> Optional[str]:
    """Lookup product id for a certificate/tier combo based on env map."""
    product_map = _load_product_map()
    cert_entry = product_map.get(cert_id, {})
    product_id = cert_entry.get(tier_id)
    return product_id
