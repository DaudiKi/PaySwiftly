from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class VehicleType(str, Enum):
    BODA = "boda"
    TAXI = "taxi"
    UBER = "uber"
    BOLT = "bolt"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAYOUT_PENDING = "payout_pending"
    PAYOUT_COMPLETED = "payout_completed"
    PAYOUT_FAILED = "payout_failed"

class PayoutStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REVERSED = "reversed"

class Driver(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    email: str
    vehicle_type: VehicleType
    vehicle_number: str
    qr_code_url: Optional[str] = None
    balance: float = 0.0
    total_earnings: float = 0.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Transaction(BaseModel):
    id: Optional[str] = None
    driver_id: str
    passenger_phone: str
    amount_paid: float
    platform_fee: float
    driver_amount: float
    status: TransactionStatus = TransactionStatus.PENDING
    mpesa_receipt: Optional[str] = None
    checkout_request_id: Optional[str] = None
    
    # IntaSend specific fields
    intasend_collection_id: Optional[str] = None
    intasend_tracking_id: Optional[str] = None
    collection_status: Optional[str] = None
    payout_status: Optional[str] = None
    collection_response: Optional[Dict[str, Any]] = None
    payout_response: Optional[Dict[str, Any]] = None
    fee_percentage: float = 0.5
    fee_fixed: float = 0.0
    collection_completed_at: Optional[datetime] = None
    payout_completed_at: Optional[datetime] = None
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Payout(BaseModel):
    id: Optional[str] = None
    transaction_id: str
    driver_id: str
    amount: float
    tracking_id: Optional[str] = None
    status: PayoutStatus = PayoutStatus.PENDING
    intasend_response: Optional[Dict[str, Any]] = None
    failure_reason: Optional[str] = None
    initiated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class PlatformFee(BaseModel):
    id: Optional[str] = None
    transaction_id: str
    amount: float
    fee_type: str = "percentage"  # 'percentage' or 'fixed'
    percentage_applied: Optional[float] = None
    fixed_amount_applied: Optional[float] = None
    collected_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

class AdminStats(BaseModel):
    total_transactions: int = 0
    total_revenue: float = 0.0
    total_platform_fees: float = 0.0
    active_drivers: int = 0
    total_payouts: float = 0.0
    pending_payouts: float = 0.0
    failed_payouts: int = 0
    updated_at: Optional[datetime] = None

# Request/Response models
class DriverRegistration(BaseModel):
    name: str
    phone: str
    email: EmailStr
    vehicle_type: VehicleType
    vehicle_number: str
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")

class DriverLogin(BaseModel):
    phone: str
    password: str

class LoginResponse(BaseModel):
    status: str
    driver_id: str
    token: str
    message: str

class PaymentRequest(BaseModel):
    driver_id: str
    passenger_phone: str
    amount: float
    passenger_email: Optional[str] = None
    passenger_name: Optional[str] = None

class PaymentInitiateResponse(BaseModel):
    status: str
    transaction_id: str
    collection_id: Optional[str] = None
    message: str
    amount: float
    platform_fee: float
    driver_amount: float

class PayoutRequest(BaseModel):
    transaction_id: str
    driver_id: str
    amount: float

class IntaSendWebhook(BaseModel):
    """IntaSend webhook payload model."""
    id: Optional[str] = None
    invoice_id: Optional[str] = None
    state: Optional[str] = None  # Used in payment webhooks
    status: Optional[str] = None  # Used in payout webhooks
    status_code: Optional[str] = None  # Payout status code
    provider: Optional[str] = None
    charges: Optional[float] = None
    net_amount: Optional[float] = None
    currency: str = "KES"
    value: Optional[float] = None
    account: Optional[str] = None
    api_ref: Optional[str] = None
    mpesa_reference: Optional[str] = None
    tracking_id: Optional[str] = None
    file_id: Optional[str] = None  # Payout file ID
    batch_reference: Optional[str] = None  # Payout batch reference
    transactions: Optional[list] = None  # Payout transactions array
    meta: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class TransactionStatusResponse(BaseModel):
    transaction_id: str
    status: TransactionStatus
    collection_status: Optional[str] = None
    payout_status: Optional[str] = None
    amount_paid: float
    platform_fee: float
    driver_amount: float
    created_at: datetime
    collection_completed_at: Optional[datetime] = None
    payout_completed_at: Optional[datetime] = None
