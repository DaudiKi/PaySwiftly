import os
from datetime import datetime
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from .models import (
    Driver, Transaction, AdminStats, TransactionStatus,
    Payout, PayoutStatus, PlatformFee
)

class SupabaseManager:
    def __init__(self):
        """Initialize Supabase client."""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    async def create_driver(self, driver: Driver) -> str:
        """Create a new driver in Supabase."""
        driver_data = driver.model_dump(exclude={'id', 'created_at', 'updated_at'})
        driver_data['created_at'] = datetime.utcnow().isoformat()
        driver_data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.supabase.table('drivers').insert(driver_data).execute()
        
        if result.data:
            return result.data[0]['id']
        else:
            raise Exception("Failed to create driver")

    async def get_driver(self, driver_id: str) -> Optional[Driver]:
        """Get driver details by ID."""
        result = self.supabase.table('drivers').select('*').eq('id', driver_id).execute()
        
        if result.data:
            driver_data = result.data[0]
            return Driver(**driver_data)
        return None

    async def get_driver_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        """Get driver by phone number (for login). Returns raw dict including password_hash."""
        result = self.supabase.table('drivers').select('*').eq('phone', phone).execute()
        
        if result.data:
            return result.data[0]
        return None

    async def update_driver(self, driver_id: str, data: Dict[str, Any]) -> bool:
        """Update driver details."""
        data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.supabase.table('drivers').update(data).eq('id', driver_id).execute()
        
        return len(result.data) > 0

    async def create_transaction(self, transaction: Transaction) -> str:
        """Create a new transaction with atomic updates."""
        transaction_data = transaction.model_dump(exclude={'id', 'created_at', 'updated_at'})
        transaction_data['created_at'] = datetime.utcnow().isoformat()
        transaction_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Start a transaction
        try:
            # Create the transaction
            transaction_result = self.supabase.table('transactions').insert(transaction_data).execute()
            
            if not transaction_result.data:
                raise Exception("Failed to create transaction")
            
            transaction_id = transaction_result.data[0]['id']
            
            # Update driver balance and earnings using RPC function
            balance_result = self.supabase.rpc(
                'update_driver_balance',
                {
                    'driver_id': transaction.driver_id,
                    'amount': transaction.driver_amount
                }
            ).execute()
            
            # Update admin stats using RPC function
            stats_result = self.supabase.rpc(
                'update_admin_stats',
                {
                    'transaction_count': 1,
                    'revenue': transaction.amount_paid,
                    'platform_fee': transaction.platform_fee
                }
            ).execute()
            
            return transaction_id
            
        except Exception as e:
            # In a real implementation, you'd want to rollback here
            raise Exception(f"Transaction creation failed: {str(e)}")

    async def get_driver_transactions(self, driver_id: str, limit: int = 50) -> List[Transaction]:
        """Get transactions for a specific driver."""
        result = (self.supabase.table('transactions')
                 .select('*')
                 .eq('driver_id', driver_id)
                 .order('created_at', desc=True)
                 .limit(limit)
                 .execute())
        
        return [Transaction(**tx) for tx in result.data]

    async def get_admin_stats(self) -> AdminStats:
        """Get admin statistics."""
        result = self.supabase.table('admin_stats').select('*').eq('id', 'revenue').execute()
        
        if result.data:
            stats_data = result.data[0]
            return AdminStats(**stats_data)
        
        # Return default stats if none exist
        return AdminStats()

    async def upload_qr_code(self, driver_id: str, qr_image_bytes: bytes) -> str:
        """Upload QR code image to Supabase Storage."""
        file_path = f'qr_codes/{driver_id}.png'
        
        # Upload to Supabase Storage
        try:
            storage_result = self.supabase.storage.from_('qr-codes').upload(
                file_path, 
                qr_image_bytes,
                file_options={"content-type": "image/png"}
            )
        except Exception as e:
            raise Exception(f"Failed to upload QR code: {str(e)}")
        
        # Get public URL
        public_url = self.supabase.storage.from_('qr-codes').get_public_url(file_path)
        return public_url

    async def get_all_transactions(self, limit: int = 100) -> List[Transaction]:
        """Get all transactions for admin view."""
        result = (self.supabase.table('transactions')
                 .select('*')
                 .order('created_at', desc=True)
                 .limit(limit)
                 .execute())
        
        return [Transaction(**tx) for tx in result.data]

    async def update_transaction_status(self, checkout_request_id: str, status: TransactionStatus, mpesa_receipt: Optional[str] = None) -> bool:
        """Update transaction status based on M-Pesa callback."""
        update_data = {
            'status': status.value,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if mpesa_receipt:
            update_data['mpesa_receipt'] = mpesa_receipt
        
        result = (self.supabase.table('transactions')
                 .update(update_data)
                 .eq('checkout_request_id', checkout_request_id)
                 .execute())
        
        return len(result.data) > 0

    async def get_transaction_by_checkout_id(self, checkout_request_id: str) -> Optional[Transaction]:
        """Get transaction by checkout request ID."""
        result = (self.supabase.table('transactions')
                 .select('*')
                 .eq('checkout_request_id', checkout_request_id)
                 .execute())
        
        if result.data:
            return Transaction(**result.data[0])
        return None

    async def update_transaction_checkout_id(self, transaction_id: str, checkout_request_id: str) -> bool:
        """Update transaction with checkout request ID."""
        update_data = {
            'checkout_request_id': checkout_request_id,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = (self.supabase.table('transactions')
                 .update(update_data)
                 .eq('id', transaction_id)
                 .execute())
        
        return len(result.data) > 0
    
    # === IntaSend-specific methods ===
    
    async def create_transaction_with_intasend(self, transaction: Transaction) -> str:
        """Create a new transaction for IntaSend workflow."""
        transaction_data = transaction.model_dump(
            exclude={'id', 'created_at', 'updated_at'},
            exclude_none=True
        )
        transaction_data['created_at'] = datetime.utcnow().isoformat()
        transaction_data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.supabase.table('transactions').insert(transaction_data).execute()
        
        if result.data:
            return result.data[0]['id']
        else:
            raise Exception("Failed to create transaction")
    
    async def update_transaction_collection(
        self,
        transaction_id: str,
        collection_id: str,
        collection_status: str,
        collection_response: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update transaction with IntaSend collection details."""
        update_data = {
            'intasend_collection_id': collection_id,
            'collection_status': collection_status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if collection_response:
            update_data['collection_response'] = collection_response
        
        if collection_status == 'completed':
            update_data['status'] = TransactionStatus.PAYOUT_PENDING.value
            update_data['collection_completed_at'] = datetime.utcnow().isoformat()
        elif collection_status == 'failed':
            update_data['status'] = TransactionStatus.FAILED.value
        
        result = (self.supabase.table('transactions')
                 .update(update_data)
                 .eq('id', transaction_id)
                 .execute())
        
        return len(result.data) > 0
    
    async def get_transaction(self, transaction_id: str) -> Optional[Transaction]:
        """Get transaction by ID."""
        result = (self.supabase.table('transactions')
                 .select('*')
                 .eq('id', transaction_id)
                 .execute())
        
        if result.data:
            return Transaction(**result.data[0])
        return None
    
    async def get_transaction_by_collection_id(self, collection_id: str) -> Optional[Transaction]:
        """Get transaction by IntaSend collection ID."""
        result = (self.supabase.table('transactions')
                 .select('*')
                 .eq('intasend_collection_id', collection_id)
                 .execute())
        
        if result.data:
            return Transaction(**result.data[0])
        return None
    
    async def create_payout(self, payout: Payout) -> str:
        """Create a new payout record."""
        payout_data = payout.model_dump(
            exclude={'id', 'created_at', 'updated_at'},
            exclude_none=True
        )
        payout_data['initiated_at'] = datetime.utcnow().isoformat()
        payout_data['created_at'] = datetime.utcnow().isoformat()
        payout_data['updated_at'] = datetime.utcnow().isoformat()
        
        result = self.supabase.table('payouts').insert(payout_data).execute()
        
        if result.data:
            return result.data[0]['id']
        else:
            raise Exception("Failed to create payout")
    
    async def update_payout_status(
        self,
        payout_id: str,
        status: PayoutStatus,
        tracking_id: Optional[str] = None,
        intasend_response: Optional[Dict[str, Any]] = None,
        failure_reason: Optional[str] = None
    ) -> bool:
        """Update payout status."""
        update_data = {
            'status': status.value,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if tracking_id:
            update_data['tracking_id'] = tracking_id
        if intasend_response:
            update_data['intasend_response'] = intasend_response
        if failure_reason:
            update_data['failure_reason'] = failure_reason
        if status == PayoutStatus.COMPLETED:
            update_data['completed_at'] = datetime.utcnow().isoformat()
        
        result = (self.supabase.table('payouts')
                 .update(update_data)
                 .eq('id', payout_id)
                 .execute())
        
        return len(result.data) > 0
    
    async def update_transaction_payout(
        self,
        transaction_id: str,
        tracking_id: str,
        payout_status: str,
        payout_response: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update transaction with payout details."""
        update_data = {
            'intasend_tracking_id': tracking_id,
            'payout_status': payout_status,
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if payout_response:
            update_data['payout_response'] = payout_response
        
        if payout_status == 'completed':
            update_data['status'] = TransactionStatus.PAYOUT_COMPLETED.value
            update_data['payout_completed_at'] = datetime.utcnow().isoformat()
        elif payout_status == 'failed':
            update_data['status'] = TransactionStatus.PAYOUT_FAILED.value
        
        result = (self.supabase.table('transactions')
                 .update(update_data)
                 .eq('id', transaction_id)
                 .execute())
        
        return len(result.data) > 0
    
    async def get_payout_by_tracking_id(self, tracking_id: str) -> Optional[Payout]:
        """Get payout by tracking ID."""
        result = (self.supabase.table('payouts')
                 .select('*')
                 .eq('tracking_id', tracking_id)
                 .execute())
        
        if result.data:
            return Payout(**result.data[0])
        return None
    
    async def create_platform_fee(self, platform_fee: PlatformFee) -> str:
        """Record platform fee collection."""
        fee_data = platform_fee.model_dump(
            exclude={'id', 'created_at'},
            exclude_none=True
        )
        fee_data['collected_at'] = datetime.utcnow().isoformat()
        fee_data['created_at'] = datetime.utcnow().isoformat()
        
        result = self.supabase.table('platform_fees').insert(fee_data).execute()
        
        if result.data:
            return result.data[0]['id']
        else:
            raise Exception("Failed to record platform fee")
    
    async def get_driver_payouts(self, driver_id: str, limit: int = 50) -> List[Payout]:
        """Get payouts for a specific driver."""
        result = (self.supabase.table('payouts')
                 .select('*')
                 .eq('driver_id', driver_id)
                 .order('created_at', desc=True)
                 .limit(limit)
                 .execute())
        
        return [Payout(**payout) for payout in result.data]
    
    async def get_pending_payouts(self, limit: int = 100):
        """Get all pending payouts."""
        result = self.supabase.table('payouts')\
            .select('*')\
            .eq('status', 'pending')\
            .order('created_at', desc=True)\
            .limit(limit)\
            .execute()
        
        return result.data
    
    async def add_to_pending_balance(self, driver_id: str, amount: float):
        """
        Add amount to driver's pending balance (accumulate earnings).
        Uses database function for atomic update.
        """
        try:
            result = self.supabase.rpc('add_to_pending_balance', {
                'driver_id_param': driver_id,
                'amount_param': amount
            }).execute()
            return result
        except Exception as e:
            raise Exception(f"Failed to add to pending balance: {str(e)}")
    
    async def get_drivers_for_payout(self, minimum_threshold: float = 100.0):
        """
        Get all drivers eligible for batch payout (pending_balance >= threshold).
        """
        result = self.supabase.table('drivers')\
            .select('id, name, phone, email, pending_balance, paid_balance, last_payout_date')\
            .gte('pending_balance', minimum_threshold)\
            .order('pending_balance', desc=True)\
            .execute()
        
        return result.data
    
    async def process_batch_payout_completion(
        self,
        driver_id: str,
        amount: float,
        tracking_id: str
    ):
        """
        Process successful batch payout - move pending to paid balance.
        Uses database function for atomic update.
        """
        try:
            result = self.supabase.rpc('process_batch_payout', {
                'driver_id_param': driver_id,
                'amount_param': amount,
                'tracking_id_param': tracking_id
            }).execute()
            return result
        except Exception as e:
            raise Exception(f"Failed to process batch payout: {str(e)}")