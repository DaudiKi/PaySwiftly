import os
import logging
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    Driver, Transaction, AdminStats, 
    DriverRegistration, PaymentRequest, PaymentInitiateResponse,
    IntaSendWebhook, TransactionStatusResponse, TransactionStatus,
    Payout, PayoutStatus, PlatformFee, DriverLogin, LoginResponse
)
from .supabase_util import SupabaseManager
from .intasend import IntaSendAPI
from .qr_utils import generate_payment_qr
from .auth import hash_password, verify_password, create_access_token

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="GoPay Payment Aggregator with IntaSend",
    description="QR-based payment collection with automatic driver payouts",
    version="2.0.0"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )

# Initialize IntaSend API and Supabase
intasend_api = IntaSendAPI()
supabase_manager = SupabaseManager()


# === Background Tasks ===

async def process_payout(transaction_id: str, driver_id: str, driver_phone: str, amount: float, driver_name: str):
    """
    Background task to process driver payout after successful collection.
    This runs asynchronously after payment collection is confirmed.
    """
    try:
        logger.info(f"Processing payout for transaction {transaction_id}")
        
        # Create payout record
        payout = Payout(
            transaction_id=transaction_id,
            driver_id=driver_id,
            amount=amount,
            status=PayoutStatus.PENDING
        )
        payout_id = await supabase_manager.create_payout(payout)
        logger.info(f"Payout record created: {payout_id}")
        
        # Initiate payout via IntaSend
        payout_response = await intasend_api.initiate_payout(
            phone_number=driver_phone,
            amount=amount,
            reference=transaction_id,
            name=driver_name
        )
        
        tracking_id = payout_response.get('tracking_id')
        
        if tracking_id:
            # Update payout record with tracking ID
            await supabase_manager.update_payout_status(
                payout_id=payout_id,
                status=PayoutStatus.PROCESSING,
                tracking_id=tracking_id,
                intasend_response=payout_response
            )
            
            # Update transaction with payout details
            await supabase_manager.update_transaction_payout(
                transaction_id=transaction_id,
                tracking_id=tracking_id,
                payout_status='processing',
                payout_response=payout_response
            )
            
            logger.info(f"Payout initiated successfully. Tracking ID: {tracking_id}")
        else:
            raise Exception("No tracking ID in payout response")
            
    except ValueError as e:
        # Minimum amount validation error
        logger.warning(f"Payout below minimum threshold: {str(e)}")
        try:
            await supabase_manager.update_payout_status(
                payout_id=payout_id,
                status=PayoutStatus.FAILED,
                failure_reason=f"Below minimum: {str(e)}"
            )
            await supabase_manager.update_transaction_payout(
                transaction_id=transaction_id,
                tracking_id='',
                payout_status='pending_minimum'  # Special status for amounts below minimum
            )
        except:
            pass
    except Exception as e:
        logger.error(f"Payout processing failed: {str(e)}")
        # Update payout status to failed
        try:
            await supabase_manager.update_payout_status(
                payout_id=payout_id,
                status=PayoutStatus.FAILED,
                failure_reason=str(e)
            )
            await supabase_manager.update_transaction_payout(
                transaction_id=transaction_id,
                tracking_id='',
                payout_status='failed'
            )
        except:
            pass


# === API Routes ===

# === API Routes ===

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "service": "GoPay IntaSend API",
        "version": "2.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.post("/api/register_driver", response_model=dict)
async def register_driver(driver_data: DriverRegistration) -> dict:
    """
    Register a new driver and generate their payment QR code.
    
    The QR code contains a link to the payment page with the driver's ID.
    Passengers scan this QR code to pay the driver.
    """
    try:
        # Create driver object
        driver = Driver(
            id="",  # Will be set by Supabase
            name=driver_data.name,
            phone=driver_data.phone,
            email=driver_data.email,
            vehicle_type=driver_data.vehicle_type,
            vehicle_number=driver_data.vehicle_number
        )
        
        # Hash the password
        password_hash = hash_password(driver_data.password)
        
        # Save driver to Supabase
        driver_id = await supabase_manager.create_driver(driver)
        logger.info(f"Driver registered: {driver_id}")
        
        # Update driver with password hash
        await supabase_manager.update_driver(driver_id, {"password_hash": password_hash})
        
        # Generate QR code with driver's phone pre-filled
        qr_bytes = generate_payment_qr(driver_id, driver_data.phone)
        
        # Upload QR code to Supabase Storage
        qr_url = await supabase_manager.upload_qr_code(driver_id, qr_bytes)
        
        # Update driver with QR code URL
        await supabase_manager.update_driver(driver_id, {"qr_code_url": qr_url})
        
        return {
            "status": "success",
            "driver_id": driver_id,
            "qr_code_url": qr_url,
            "message": "Driver registered successfully"
        }
    except Exception as e:
        logger.error(f"Driver registration failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/login", response_model=LoginResponse)
async def login_driver(login_data: DriverLogin) -> LoginResponse:
    """
    Authenticate driver with phone and password.
    Returns JWT token on successful authentication.
    """
    try:
        # Get driver by phone
        driver_data = await supabase_manager.get_driver_by_phone(login_data.phone)
        
        if not driver_data:
            raise HTTPException(status_code=401, detail="Invalid phone number or password")
        
        # Verify password
        if not driver_data.get('password_hash'):
            raise HTTPException(status_code=401, detail="Please register with a password")
        
        if not verify_password(login_data.password, driver_data['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid phone number or password")
        
        # Create JWT token
        token = create_access_token(data={"sub": driver_data['id']})
        
        logger.info(f"Driver logged in: {driver_data['id']}")
        
        return LoginResponse(
            status="success",
            driver_id=driver_data['id'],
            token=token,
            message="Login successful"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/driver/{driver_id}", response_model=Driver)
async def get_driver(driver_id: str) -> Driver:
    """Get driver details by ID."""
    driver = await supabase_manager.get_driver(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver




@app.post("/api/pay", response_model=PaymentInitiateResponse)
async def initiate_payment(payment: PaymentRequest, background_tasks: BackgroundTasks) -> PaymentInitiateResponse:
    """
    Initiate payment collection via IntaSend STK Push.
    
    Workflow:
    1. Verify driver exists
    2. Calculate platform fee and driver amount
    3. Create transaction record
    4. Initiate IntaSend collection
    5. Return response to frontend
    6. Wait for webhook to confirm payment
    7. Automatically initiate payout to driver (background task)
    """
    try:
        # Verify driver exists
        driver = await supabase_manager.get_driver(payment.driver_id)
        if not driver:
            raise HTTPException(status_code=404, detail="Driver not found")
        
        # Calculate fees
        fee_breakdown = intasend_api.calculate_fees(payment.amount)
        platform_fee = fee_breakdown['platform_fee']
        driver_amount = fee_breakdown['driver_amount']
        
        logger.info(f"Payment initiated: {payment.amount} KES - Fee: {platform_fee} - Driver: {driver_amount}")
        
        # Create pending transaction
        transaction = Transaction(
            id="",  # Will be set by Supabase
            driver_id=payment.driver_id,
            passenger_phone=payment.passenger_phone,
            amount_paid=payment.amount,
            platform_fee=platform_fee,
            driver_amount=driver_amount,
            status=TransactionStatus.PENDING,
            fee_percentage=fee_breakdown['fee_percentage'],
            fee_fixed=fee_breakdown['fee_fixed']
        )
        
        # Save transaction
        transaction_id = await supabase_manager.create_transaction_with_intasend(transaction)
        logger.info(f"Transaction created: {transaction_id}")
        
        # Initiate IntaSend collection (STK Push)
        collection_response = await intasend_api.initiate_collection(
            phone_number=payment.passenger_phone,
            amount=payment.amount,
            reference=transaction_id,
            email=payment.passenger_email,
            name=payment.passenger_name
        )
        
        collection_id = collection_response.get('id')
        
        if collection_id:
            # Update transaction with collection ID
            await supabase_manager.update_transaction_collection(
                transaction_id=transaction_id,
                collection_id=collection_id,
                collection_status='pending',
                collection_response=collection_response
            )
            
            logger.info(f"Collection initiated. ID: {collection_id}")
            
            return PaymentInitiateResponse(
                status="success",
                transaction_id=transaction_id,
                collection_id=collection_id,
                message="Payment request sent. Please check your phone for M-Pesa prompt.",
                amount=payment.amount,
                platform_fee=platform_fee,
                driver_amount=driver_amount
            )
        else:
            raise Exception("Failed to initiate collection")
            
    except Exception as e:
        logger.error(f"Payment initiation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/webhooks/intasend")
async def intasend_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_intasend_signature: str = Header(None)
):
    """
    Handle IntaSend webhooks for payment and payout status updates.
    
    This endpoint receives real-time updates from IntaSend when:
    - Payment collection is completed/failed
    - Payout is completed/failed
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        body_str = body.decode('utf-8')
        
        # Verify webhook signature (if configured)
        if x_intasend_signature and os.getenv('INTASEND_WEBHOOK_SECRET'):
            is_valid = intasend_api.validate_webhook_signature(body_str, x_intasend_signature)
            if not is_valid:
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Parse webhook data
        webhook_data = await request.json()
        logger.info(f"Webhook received: {webhook_data.get('state')} - {webhook_data.get('api_ref')}")
        
        # Try to parse webhook with better error handling
        try:
            webhook = IntaSendWebhook(**webhook_data)
        except Exception as validation_error:
            logger.error(f"Webhook validation failed: {str(validation_error)}")
            logger.error(f"Raw webhook data: {webhook_data}")
            raise
        
        # Determine if this is a collection or payout webhook
        if webhook.api_ref:
            # This is a collection webhook (has api_ref)
            await handle_collection_webhook(webhook, background_tasks)
        elif webhook.tracking_id:
            # This is a payout webhook (has tracking_id but no api_ref)
            await handle_payout_webhook(webhook)
        else:
            logger.warning(f"Unknown webhook type - no api_ref or tracking_id: {webhook_data}")
        
        return {"status": "success", "message": "Webhook processed"}
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        # Return 200 to prevent IntaSend from retrying
        return {"status": "error", "message": str(e)}


async def handle_collection_webhook(webhook: IntaSendWebhook, background_tasks: BackgroundTasks):
    """Handle payment collection webhook."""
    transaction_id = webhook.api_ref
    state = (webhook.state or webhook.status or "").upper()
    
    if not state:
        logger.error("Webhook has no state or status field")
        return
    
    # Get transaction
    transaction = await supabase_manager.get_transaction(transaction_id)
    if not transaction:
        logger.error(f"Transaction not found: {transaction_id}")
        return
    
    # Update transaction based on state
    if state == "COMPLETE":
        # Payment collected successfully
        await supabase_manager.update_transaction_collection(
            transaction_id=transaction_id,
            collection_id=webhook.id or webhook.invoice_id,
            collection_status='completed',
            collection_response=webhook.model_dump()
        )
        
        # Record platform fee
        platform_fee = PlatformFee(
            transaction_id=transaction_id,
            amount=transaction.platform_fee,
            fee_type="percentage",
            percentage_applied=transaction.fee_percentage,
            fixed_amount_applied=transaction.fee_fixed
        )
        await supabase_manager.create_platform_fee(platform_fee)
        
        # Get driver details for payout
        driver = await supabase_manager.get_driver(transaction.driver_id)
        
        # Schedule automatic payout in background
        background_tasks.add_task(
            process_payout,
            transaction_id=transaction_id,
            driver_id=transaction.driver_id,
            driver_phone=driver.phone,
            amount=transaction.driver_amount,
            driver_name=driver.name
        )
        
        logger.info(f"Payment collected. Payout scheduled for {transaction.driver_amount} KES")
        
    elif state == "FAILED":
        # Payment failed
        await supabase_manager.update_transaction_collection(
            transaction_id=transaction_id,
            collection_id=webhook.id or webhook.invoice_id,
            collection_status='failed',
            collection_response=webhook.model_dump()
        )
        logger.info(f"Payment failed for transaction {transaction_id}")


async def handle_payout_webhook(webhook: IntaSendWebhook):
    """Handle payout webhook."""
    tracking_id = webhook.tracking_id
    state = webhook.state.upper()
    
    # Get payout record
    payout = await supabase_manager.get_payout_by_tracking_id(tracking_id)
    if not payout:
        logger.error(f"Payout not found: {tracking_id}")
        return
    
    # Update payout based on state
    if state == "COMPLETE":
        await supabase_manager.update_payout_status(
            payout_id=payout.id,
            status=PayoutStatus.COMPLETED,
            intasend_response=webhook.model_dump()
        )
        
        await supabase_manager.update_transaction_payout(
            transaction_id=payout.transaction_id,
            tracking_id=tracking_id,
            payout_status='completed',
            payout_response=webhook.model_dump()
        )
        
        logger.info(f"Payout completed: {payout.amount} KES to driver {payout.driver_id}")
        
    elif state == "FAILED":
        await supabase_manager.update_payout_status(
            payout_id=payout.id,
            status=PayoutStatus.FAILED,
            intasend_response=webhook.model_dump(),
            failure_reason=f"IntaSend payout failed: {state}"
        )
        
        await supabase_manager.update_transaction_payout(
            transaction_id=payout.transaction_id,
            tracking_id=tracking_id,
            payout_status='failed',
            payout_response=webhook.model_dump()
        )
        
        logger.error(f"Payout failed for driver {payout.driver_id}")



@app.get("/api/transaction/{transaction_id}/status", response_model=TransactionStatusResponse)
async def get_transaction_status(transaction_id: str) -> TransactionStatusResponse:
    """
    Get current status of a transaction.
    
    Returns detailed information about payment collection and payout status.
    """
    transaction = await supabase_manager.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return TransactionStatusResponse(
        transaction_id=transaction.id,
        status=transaction.status,
        collection_status=transaction.collection_status,
        payout_status=transaction.payout_status,
        amount_paid=transaction.amount_paid,
        platform_fee=transaction.platform_fee,
        driver_amount=transaction.driver_amount,
        created_at=transaction.created_at,
        collection_completed_at=transaction.collection_completed_at,
        payout_completed_at=transaction.payout_completed_at
    )


@app.get("/api/admin/stats", response_model=AdminStats)
async def get_admin_stats() -> AdminStats:
    """Get platform statistics for admin."""
    return await supabase_manager.get_admin_stats()


@app.get("/api/driver/{driver_id}/transactions", response_model=List[Transaction])
async def get_driver_transactions(driver_id: str) -> List[Transaction]:
    """Get transactions for a specific driver."""
    return await supabase_manager.get_driver_transactions(driver_id)


@app.get("/api/driver/{driver_id}/payouts", response_model=List[Payout])
async def get_driver_payouts(driver_id: str) -> List[Payout]:
    """Get payouts for a specific driver."""
    return await supabase_manager.get_driver_payouts(driver_id)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "GoPay IntaSend",
        "version": "2.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
