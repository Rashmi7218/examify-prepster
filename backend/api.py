import os
from itertools import count, product
from typing import Dict, Optional

import polar_sdk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from polar_sdk import Polar
from pydantic import BaseModel

from backend.polar_client import PolarClient, resolve_product_id

# Environment toggles
USE_SANDBOX = os.getenv("POLAR_USE_SANDBOX", "true").lower() == "true"

app = FastAPI(title="Polar bridge API")

# Allow local dev origins by default
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CheckoutRequest(BaseModel):
    cert_id: str
    tier_id: str
    customer_email: Optional[str] = None
    customer_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class CheckoutResponse(BaseModel):
    url: str
    checkout_id: Optional[str] = None


class billingAddress(BaseModel):
    country: dict = {"country": polar_sdk.CountryAlpha2Input.US}


class CheckoutSessionRequest(BaseModel):
    customer_name: str
    customer_billing_address: dict = billingAddress
    cert_id: str
    tier_id: str


polar = Polar(
    access_token=os.getenv("POLAR_SANDBOX_ACCESS_TOKEN"),
    server="sandbox",
)


@app.get("/api/get-customers-list")
def get_customers_list():
    res = polar.customers.list(
        organization_id=os.getenv("ORGANIZATION_ID"), page=1, limit=10
    )

    while res is not None:
        # Handle items

        res = res.next()
    return res


@app.post("/api/checkout-session")
def create_checkout_session(payload: CheckoutSessionRequest):
    product_id = resolve_product_id(payload.cert_id, payload.tier_id)
    print(f"{product_id = }")
    if not product_id:
        raise HTTPException(status_code=400, detail="Unknown product for cert/tier")

    try:
        input = {
            "customer_name": payload.customer_name,
            "customer_billing_address": {
                "country": polar_sdk.CountryAlpha2Input.US,
            },
            "products": [product_id],
        }
        print(f"{input = }")
        data = polar.checkouts.create(request=input)
        print(f"{data = }")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    # return CheckoutResponse(url=data.get("url"), checkout_id=data.get("id"))
    return data


@app.post("/api/checkout-link", response_model=CheckoutResponse)
def create_checkout_link(payload: CheckoutRequest):
    product_price_id = resolve_product_id(payload.cert_id, payload.tier_id)
    print(f"{product_price_id = }")
    if not product_price_id:
        raise HTTPException(status_code=400, detail="Unknown product for cert/tier")

    client = PolarClient(use_sandbox=USE_SANDBOX)
    try:
        data = client.create_checkout_link(
            product_price_id=product_price_id,
            metadata=payload.metadata,
            success_url=os.getenv("POLAR_SUCCESS_URL"),
            cancel_url=os.getenv("POLAR_CANCEL_URL"),
        )
        print(f"{data = }")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))

    url = data.get("url") or data.get("checkout_url")
    print(f"{url = }")
    return CheckoutResponse(url=url, checkout_id=data.get("id"))


class CustomerRequest(BaseModel):
    email: str
    name: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


@app.post("/api/customers")
def create_customer(payload: CustomerRequest):
    client = PolarClient(use_sandbox=USE_SANDBOX)
    try:
        return client.create_customer(
            email=payload.email, name=payload.name, metadata=payload.metadata
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))


class SubscriptionRequest(BaseModel):
    cert_id: str
    tier_id: str
    customer_id: str
    trial_days: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None


@app.post("/api/subscriptions")
def create_subscription(payload: SubscriptionRequest):
    product_price_id = resolve_product_id(payload.cert_id, payload.tier_id)
    if not product_price_id:
        raise HTTPException(status_code=400, detail="Unknown product for cert/tier")

    client = PolarClient(use_sandbox=USE_SANDBOX)
    try:
        return client.create_subscription(
            product_price_id=product_price_id,
            customer_id=payload.customer_id,
            trial_days=payload.trial_days,
            metadata=payload.metadata,
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))


# uvicorn backend.api:app --reload --port 8000
