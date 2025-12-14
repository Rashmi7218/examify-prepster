import json
import os
from dataclasses import dataclass
from typing import Any, Dict, Optional

import requests
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


@dataclass
class PolarClient:
    use_sandbox: bool = False

    def __post_init__(self) -> None:
        self.base_url = SANDBOX_BASE_URL if self.use_sandbox else PRODUCTION_BASE_URL
        token = SANDBOX_TOKEN if self.use_sandbox else PRODUCTION_TOKEN
        if not token:
            env_name = (
                "POLAR_SANDBOX_ACCESS_TOKEN"
                if self.use_sandbox
                else "POLAR_ACCESS_TOKEN"
            )
            raise ValueError(f"{env_name} is not set")
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        )

    def _request(
        self, method: str, path: str, payload: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url.rstrip('/')}/{path.lstrip('/')}"
        if method.upper() == "GET":
            resp = self.session.request(method=method, url=url, params=payload)
        else:
            resp = self.session.request(method=method, url=url, json=payload)
        try:
            resp.raise_for_status()
        except requests.HTTPError as exc:  # noqa: BLE001
            detail = None
            try:
                detail = resp.json()
            except Exception:  # noqa: BLE001
                detail = resp.text
            raise requests.HTTPError(f"{exc} | detail={detail}") from exc
        return resp.json()

    # Checkout APIs
    def create_checkout(
        self,
        product_price_id: str,
        customer_id: Optional[str] = None,
        customer_email: Optional[str] = None,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "product_price_id": product_price_id,
            "payment_processor": PAYMENT_PROCESSOR,
            "success_url": success_url or DEFAULT_SUCCESS_URL,
            "cancel_url": cancel_url or DEFAULT_CANCEL_URL,
            "metadata": metadata or {},
        }
        if customer_id:
            payload["customer_id"] = customer_id
        if customer_email:
            payload["customer_email"] = customer_email
        return self._request("POST", "/checkouts", payload)

    # Checkout Links
    def create_checkout_link(
        self,
        product_price_id: str,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = {
            "product_price_id": product_price_id,
            "payment_processor": PAYMENT_PROCESSOR,
            "success_url": success_url or DEFAULT_SUCCESS_URL,
            "cancel_url": cancel_url or DEFAULT_CANCEL_URL,
            "metadata": metadata or {},
        }
        return self._request("POST", "/checkout-links", payload)

    # Customers
    def create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"email": email}
        if name:
            payload["name"] = name
        if metadata:
            payload["metadata"] = metadata
        return self._request("POST", "/customers", payload)

    def get_customer(self, customer_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/customers/{customer_id}")

    # Subscriptions
    def create_subscription(
        self,
        product_price_id: str,
        customer_id: str,
        trial_days: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "product_price_id": product_price_id,
            "customer_id": customer_id,
            "payment_processor": PAYMENT_PROCESSOR,
        }
        if trial_days is not None:
            payload["trial_days"] = trial_days
        if metadata:
            payload["metadata"] = metadata
        return self._request("POST", "/subscriptions", payload)

    def list_subscriptions(
        self, customer_id: Optional[str] = None, status: Optional[str] = None
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {}
        if customer_id:
            params["customer_id"] = customer_id
        if status:
            params["status"] = status
        return self._request("GET", "/subscriptions", params)
