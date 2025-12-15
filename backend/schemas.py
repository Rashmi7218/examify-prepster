from typing import Dict, Optional

import polar_sdk
from pydantic import BaseModel


class CustomerRequest(BaseModel):
    external_id: str
    email: str
    name: Optional[str] = None


class SubscriptionRequest(BaseModel):
    cert_id: str
    tier_id: str
    customer_id: str


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
