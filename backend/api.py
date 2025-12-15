import os

import polar_sdk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from polar_sdk import Polar

from backend.polar_client import resolve_product_id
from backend.schemas import (
    CheckoutResponse,
    CheckoutSessionRequest,
    CustomerRequest,
    SubscriptionRequest,
)

# Environment toggles
USE_SANDBOX = os.getenv("POLAR_USE_SANDBOX", "true").lower() == "true"
POLAR_TOKEN = (
    os.getenv("POLAR_SANDBOX_ACCESS_TOKEN")
    if USE_SANDBOX
    else os.getenv("POLAR_ACCESS_TOKEN")
)
POLAR_SERVER = "sandbox" if USE_SANDBOX else "production"

app = FastAPI(title="Polar bridge API")

# Allow local dev origins by default
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not POLAR_TOKEN:
    raise RuntimeError("Missing POLAR access token for the selected environment.")

polar = Polar(access_token=POLAR_TOKEN, server=POLAR_SERVER)


@app.get("/api/get-customers-list")
def get_customers_list():
    res = polar.customers.list(
        organization_id=os.getenv("ORGANIZATION_ID"), page=1, limit=10
    )

    while res is not None:
        # Handle items

        res = res.next()
    return res


@app.get("/api/product-list")
def get_product_list():
    res = polar.products.list(organization_id=None, page=1, limit=10)

    products = res.result.items

    return products


@app.post("/api/checkout-session")
def create_checkout_session(payload: CheckoutSessionRequest):
    product_price_id = resolve_product_id(payload.cert_id, payload.tier_id)
    print(f"{product_price_id = }")
    if not product_price_id:
        raise HTTPException(status_code=400, detail="Unknown product for cert/tier")

    try:
        input = {
            "customer_name": payload.customer_name,
            "customer_billing_address": {
                "country": polar_sdk.CountryAlpha2Input.US,
            },
            "products": [product_price_id],
        }
        print(f"{input = }")
        data = polar.checkouts.create(request=input)
        print(f"{data = }")
        print(f"{type(data) = }")

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return CheckoutResponse(url=data.url, checkout_id=data.id)


@app.post("/api/customers")
def create_customer(payload: CustomerRequest):
    try:
        res = polar.customers.create(
            request={
                "external_id": payload.external_id,
                "email": payload.email,
                "name": payload.name,
                "billing_address": {
                    "country": polar_sdk.CountryAlpha2Input.US,
                },
                "tax_id": [
                    "911144442",
                    "us_ein",
                ],
                # "organization_id": "1dbfc517-0bbf-4301-9ba8-555ca42b9737",
            }
        )
        print(f"{res = }")
        return res

    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/subscriptions")
def create_subscription(payload: SubscriptionRequest):
    product_price_id = resolve_product_id(payload.cert_id, payload.tier_id)
    if not product_price_id:
        raise HTTPException(status_code=400, detail="Unknown product for cert/tier")

    try:
        res = polar.subscriptions.create(
            request={
                "product_id": product_price_id,
                "customer_id": payload.customer_id,
            }
        )
        print(f"{res = }")
        return res
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc))


# uvicorn backend.api:app --reload --port 8000
