import os
from datetime import datetime
from typing import Optional, Dict, Any, List

import firebase_admin
from firebase_admin import credentials, firestore, storage
from google.cloud.firestore_v1.base_query import FieldFilter

from .models import Driver, Transaction, AdminStats

# Initialize Firebase Admin SDK
cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred, {
    'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
})

db = firestore.client()
bucket = storage.bucket()

class FirebaseManager:
    @staticmethod
    async def create_driver(driver: Driver) -> str:
        """Create a new driver document in Firestore."""
        driver_ref = db.collection('drivers').document()
        driver_data = driver.model_dump()
        driver_data['id'] = driver_ref.id
        driver_data['created_at'] = firestore.SERVER_TIMESTAMP
        driver_data['updated_at'] = firestore.SERVER_TIMESTAMP
        
        await driver_ref.set(driver_data)
        return driver_ref.id

    @staticmethod
    async def get_driver(driver_id: str) -> Optional[Driver]:
        """Get driver details by ID."""
        doc = db.collection('drivers').document(driver_id).get()
        if doc.exists:
            return Driver(**doc.to_dict())
        return None

    @staticmethod
    async def update_driver(driver_id: str, data: Dict[str, Any]) -> bool:
        """Update driver details."""
        data['updated_at'] = firestore.SERVER_TIMESTAMP
        db.collection('drivers').document(driver_id).update(data)
        return True

    @staticmethod
    async def create_transaction(transaction: Transaction) -> str:
        """Create a new transaction document."""
        transaction_ref = db.collection('transactions').document()
        transaction_data = transaction.model_dump()
        transaction_data['id'] = transaction_ref.id
        transaction_data['created_at'] = firestore.SERVER_TIMESTAMP
        transaction_data['updated_at'] = firestore.SERVER_TIMESTAMP
        
        # Start a batch write
        batch = db.batch()
        
        # Create transaction
        batch.set(transaction_ref, transaction_data)
        
        # Update driver balance and earnings
        driver_ref = db.collection('drivers').document(transaction.driver_id)
        batch.update(driver_ref, {
            'balance': firestore.Increment(transaction.driver_amount),
            'total_earnings': firestore.Increment(transaction.driver_amount),
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        # Update admin stats
        stats_ref = db.collection('adminStats').document('revenue')
        batch.update(stats_ref, {
            'total_transactions': firestore.Increment(1),
            'total_revenue': firestore.Increment(transaction.amount_paid),
            'total_platform_fees': firestore.Increment(transaction.platform_fee),
            'updated_at': firestore.SERVER_TIMESTAMP
        })
        
        # Commit the batch
        batch.commit()
        return transaction_ref.id

    @staticmethod
    async def get_driver_transactions(driver_id: str, limit: int = 50) -> List[Transaction]:
        """Get transactions for a specific driver."""
        docs = (db.collection('transactions')
                .where(filter=FieldFilter('driver_id', '==', driver_id))
                .order_by('created_at', direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream())
        
        return [Transaction(**doc.to_dict()) for doc in docs]

    @staticmethod
    async def get_admin_stats() -> AdminStats:
        """Get admin statistics."""
        doc = db.collection('adminStats').document('revenue').get()
        if doc.exists:
            return AdminStats(**doc.to_dict())
        return AdminStats()

    @staticmethod
    async def upload_qr_code(driver_id: str, qr_image_bytes: bytes) -> str:
        """Upload QR code image to Firebase Storage."""
        blob = bucket.blob(f'qr_codes/{driver_id}.png')
        blob.upload_from_string(qr_image_bytes, content_type='image/png')
        blob.make_public()
        return blob.public_url

    @staticmethod
    async def get_all_transactions(limit: int = 100) -> List[Transaction]:
        """Get all transactions for admin view."""
        docs = (db.collection('transactions')
                .order_by('created_at', direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream())
        
        return [Transaction(**doc.to_dict()) for doc in docs]


