import os
import requests
from typing import Dict, Any, Optional
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class IntaSendAPI:
    """IntaSend API integration for payment collection and disbursements."""
    
    def __init__(self):
        """Initialize IntaSend API with configuration from environment variables."""
        self.api_key = os.getenv('INTASEND_API_KEY')
        self.publishable_key = os.getenv('INTASEND_PUBLISHABLE_KEY')
        self.is_test = os.getenv('INTASEND_TEST_MODE', 'true').lower() == 'true'
        
        # Set base URL based on environment
        if self.is_test:
            self.base_url = "https://sandbox.intasend.com/api/v1"
        else:
            self.base_url = "https://payment.intasend.com/api/v1"
        
        # Platform configuration
        self.platform_fee_percentage = float(os.getenv('PLATFORM_FEE_PERCENTAGE', '0.5'))
        self.platform_fee_fixed = float(os.getenv('PLATFORM_FEE_FIXED', '0'))
        
        self._headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to IntaSend API."""
        url = f"{self.base_url}/{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=self._headers, params=data)
            elif method.upper() == "POST":
                response = requests.post(url, headers=self._headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"IntaSend API request failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    logger.error(f"Error details: {error_detail}")
                except:
                    logger.error(f"Response text: {e.response.text}")
            raise Exception(f"IntaSend API error: {str(e)}")
    
    def calculate_fees(self, amount: float) -> Dict[str, float]:
        """
        Calculate platform fee and driver payout amount.
        
        Args:
            amount: Total amount paid by passenger
            
        Returns:
            Dict with platform_fee, driver_amount, and percentage_used
        """
        # Calculate percentage-based fee
        percentage_fee = amount * (self.platform_fee_percentage / 100)
        
        # Add fixed fee if configured
        total_platform_fee = percentage_fee + self.platform_fee_fixed
        
        # Calculate driver's share
        driver_amount = amount - total_platform_fee
        
        return {
            "total_amount": round(amount, 2),
            "platform_fee": round(total_platform_fee, 2),
            "driver_amount": round(driver_amount, 2),
            "fee_percentage": self.platform_fee_percentage,
            "fee_fixed": self.platform_fee_fixed
        }
    
    async def initiate_collection(
        self,
        phone_number: str,
        amount: float,
        reference: str,
        email: Optional[str] = None,
        name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Initiate M-Pesa STK Push payment collection.
        
        Args:
            phone_number: Customer's M-Pesa number (format: 254XXXXXXXXX)
            amount: Amount to collect
            reference: Unique reference for the transaction
            email: Customer's email (optional)
            name: Customer's name (optional)
            
        Returns:
            Dict containing the collection response
        """
        # Ensure phone number is in correct format
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]
        elif phone_number.startswith('0'):
            phone_number = f"254{phone_number[1:]}"
        
        payload = {
            "method": "M-PESA",
            "amount": int(amount),  # IntaSend expects integer amount
            "currency": "KES",
            "phone_number": phone_number,
            "api_ref": reference,
            "narrative": f"Payment for ride - Ref: {reference[:20]}"
        }
        
        if email:
            payload["email"] = email
        if name:
            payload["name"] = name
        
        logger.info(f"Initiating collection: {reference} for KES {amount} from {phone_number}")
        
        try:
            response = self._make_request("POST", "payment/mpesa-stk-push/", payload)
            logger.info(f"Collection initiated successfully: {response.get('id')}")
            return response
        except Exception as e:
            logger.error(f"Collection initiation failed: {str(e)}")
            raise
    
    async def check_collection_status(self, collection_id: str) -> Dict[str, Any]:
        """
        Check the status of a payment collection.
        
        Args:
            collection_id: The ID returned from initiate_collection
            
        Returns:
            Dict containing the collection status
        """
        try:
            response = self._make_request("GET", f"payment/status/", {"id": collection_id})
            return response
        except Exception as e:
            logger.error(f"Status check failed: {str(e)}")
            raise
    
    async def initiate_payout(
        self,
        phone_number: str,
        amount: float,
        reference: str,
        name: Optional[str] = None,
        account: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Initiate payout/disbursement to driver's M-Pesa.
        
        Args:
            phone_number: Driver's M-Pesa number (format: 254XXXXXXXXX)
            amount: Amount to send to driver
            reference: Unique reference for the payout
            name: Driver's name (optional)
            account: Driver's account identifier (optional)
            
        Returns:
            Dict containing the payout response
        """
        # Ensure phone number is in correct format
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]
        elif phone_number.startswith('0'):
            phone_number = f"254{phone_number[1:]}"
        
        payload = {
            "device": phone_number,
            "amount": int(amount),  # IntaSend expects integer amount
            "currency": "KES",
            "narrative": f"Ride payment - Ref: {reference[:20]}",
            "requires_approval": "NO"  # Instant approval for automatic payouts
        }
        
        if name:
            payload["name"] = name
        if account:
            payload["account"] = account
        
        logger.info(f"Initiating payout: {reference} for KES {amount} to {phone_number}")
        
        try:
            response = self._make_request("POST", "payouts/approve/", payload)
            logger.info(f"Payout initiated successfully: {response.get('tracking_id')}")
            return response
        except Exception as e:
            logger.error(f"Payout initiation failed: {str(e)}")
            raise
    
    async def check_payout_status(self, tracking_id: str) -> Dict[str, Any]:
        """
        Check the status of a payout.
        
        Args:
            tracking_id: The tracking ID returned from initiate_payout
            
        Returns:
            Dict containing the payout status
        """
        try:
            response = self._make_request("GET", f"payouts/status/", {"tracking_id": tracking_id})
            return response
        except Exception as e:
            logger.error(f"Payout status check failed: {str(e)}")
            raise
    
    async def get_wallet_balance(self) -> Dict[str, Any]:
        """
        Get current wallet balance.
        
        Returns:
            Dict containing wallet balance information
        """
        try:
            response = self._make_request("GET", "wallets/")
            return response
        except Exception as e:
            logger.error(f"Wallet balance check failed: {str(e)}")
            raise
    
    def validate_webhook_signature(self, payload: str, signature: str) -> bool:
        """
        Validate webhook signature from IntaSend.
        
        Args:
            payload: Raw webhook payload
            signature: Signature from X-IntaSend-Signature header
            
        Returns:
            Boolean indicating if signature is valid
        """
        import hmac
        import hashlib
        
        webhook_secret = os.getenv('INTASEND_WEBHOOK_SECRET', '')
        
        if not webhook_secret:
            logger.warning("INTASEND_WEBHOOK_SECRET not configured")
            return False
        
        expected_signature = hmac.new(
            webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_signature, signature)


