# IntaSend Integration Guide for GoPay

## Table of Contents
1. [Overview](#overview)
2. [IntaSend Account Setup](#intasend-account-setup)
3. [Database Migration](#database-migration)
4. [Environment Configuration](#environment-configuration)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing the Integration](#testing-the-integration)
7. [Production Deployment](#production-deployment)
8. [Payment Flow](#payment-flow)
9. [Fee Configuration](#fee-configuration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

GoPay now uses IntaSend for both **payment collection** (M-Pesa STK Push) and **automatic driver payouts**. This provides:

- ✅ Seamless M-Pesa integration
- ✅ Automatic commission splitting
- ✅ Instant driver payouts
- ✅ Real-time webhook notifications
- ✅ Comprehensive transaction tracking

### Workflow Summary
1. **Passenger** scans driver's QR code
2. **System** initiates M-Pesa STK push via IntaSend
3. **Passenger** enters PIN to complete payment
4. **IntaSend** sends webhook confirming payment
5. **System** automatically deducts platform fee
6. **System** instantly sends payout to driver's M-Pesa
7. **IntaSend** sends webhook confirming payout
8. **Dashboard** updates with transaction details

---

## IntaSend Account Setup

### Step 1: Create IntaSend Account

1. Visit [IntaSend.com](https://intasend.com)
2. Click **"Sign Up"** and create your account
3. Verify your email address
4. Complete KYC (Know Your Customer) verification:
   - Upload ID/Passport
   - Business registration documents (if applicable)
   - Bank account details

### Step 2: Get API Credentials

1. Log in to [IntaSend Dashboard](https://dashboard.intasend.com)
2. Navigate to **Settings → API Keys**
3. You'll see two sets of keys:
   - **Sandbox Keys** (for testing)
   - **Production Keys** (for live transactions)

4. Copy the following credentials:
   ```
   API Key (Secret Key)
   Publishable Key
   ```

### Step 3: Enable Payment Collections

1. In IntaSend dashboard, go to **Collections**
2. Enable **M-Pesa STK Push**
3. Configure your M-Pesa business details:
   - Paybill/Till Number
   - Account name
   - Settlement account

### Step 4: Enable Payouts/Disbursements

1. Go to **Payouts** section
2. Enable **M-Pesa Disbursements**
3. Add your business bank account for funding payouts
4. Set payout approval settings:
   - For automatic payouts: Select **"No approval required"**
   - For manual review: Select **"Require approval"**

---

## Database Migration

Before using IntaSend features, update your Supabase database:

### Option 1: Run Migration Script

1. Open Supabase SQL Editor
2. Copy contents of `database/intasend_migration.sql`
3. Paste and execute the script
4. Verify tables created:
   ```sql
   SELECT * FROM payouts LIMIT 1;
   SELECT * FROM platform_fees LIMIT 1;
   ```

### Option 2: Manual Table Creation

The migration adds:
- `payouts` table - Track driver payouts
- `platform_fees` table - Record platform revenue
- New fields in `transactions` table
- Triggers for automatic stat updates

---

## Environment Configuration

### 1. Copy Environment Template

```bash
cp env.intasend.example .env
```

### 2. Configure IntaSend Credentials

Edit `.env` file:

```env
# IntaSend API Configuration
INTASEND_API_KEY=ISSecretKey_test_abc123...
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_xyz789...

# Use sandbox for testing
INTASEND_TEST_MODE=true

# Platform Fees
PLATFORM_FEE_PERCENTAGE=0.5  # 0.5% commission
PLATFORM_FEE_FIXED=0         # No fixed fee
```

### 3. Configure Supabase

```env
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Public URL

```env
BASE_PUBLIC_URL=http://localhost:8000  # For local testing
# Or for production:
# BASE_PUBLIC_URL=https://gopay.yourdomain.com
```

---

## Webhook Configuration

Webhooks enable real-time payment and payout notifications.

### Step 1: Deploy Your Application

Your webhook endpoint must be publicly accessible:
```
https://yourdomain.com/api/webhooks/intasend
```

### Step 2: Configure in IntaSend Dashboard

1. Go to **Settings → Webhooks**
2. Click **"Add Webhook"**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/intasend
   ```
4. Select events to monitor:
   - ✅ Payment Completed
   - ✅ Payment Failed
   - ✅ Payout Completed
   - ✅ Payout Failed

5. Copy the **Webhook Secret** generated
6. Add to your `.env`:
   ```env
   INTASEND_WEBHOOK_SECRET=whs_abc123xyz...
   ```

### Step 3: Test Webhook

IntaSend provides a webhook testing tool:
1. Go to **Settings → Webhooks**
2. Click **"Test Webhook"**
3. Send test events
4. Check your application logs

---

## Testing the Integration

### 1. Start Application

```bash
# Install dependencies
pip install -r requirements.txt

# Run with new IntaSend main file
uvicorn app.main_intasend:app --reload --host 0.0.0.0 --port 8000
```

### 2. Register Test Driver

```bash
curl -X POST http://localhost:8000/api/register_driver \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "phone": "254722000000",
    "email": "driver@test.com",
    "vehicle_type": "boda",
    "vehicle_number": "KBW 123A"
  }'
```

Response:
```json
{
  "status": "success",
  "driver_id": "uuid-here",
  "qr_code_url": "https://...",
  "message": "Driver registered successfully"
}
```

### 3. Test Payment Flow

Visit payment page:
```
http://localhost:8000/pay?driver_id=YOUR_DRIVER_ID&phone=254722000001
```

**Sandbox Test Numbers:**
- `254722000000` - Successful payment
- `254722000001` - Failed payment
- `254722000002` - Timeout

### 4. Monitor Logs

Check application logs for:
```
INFO: Payment initiated: 100.0 KES - Fee: 0.5 - Driver: 99.5
INFO: Collection initiated. ID: col_abc123
INFO: Webhook received: COMPLETE - transaction_id
INFO: Payout scheduled for 99.5 KES
INFO: Payout initiated successfully. Tracking ID: pay_xyz789
```

### 5. Check Dashboard

Visit driver dashboard:
```
http://localhost:8000/driver/YOUR_DRIVER_ID/dashboard
```

---

## Production Deployment

### 1. Switch to Production Keys

Update `.env`:
```env
# Use production keys
INTASEND_API_KEY=ISSecretKey_live_...
INTASEND_PUBLISHABLE_KEY=ISPubKey_live_...

# Disable test mode
INTASEND_TEST_MODE=false

# Production URL
BASE_PUBLIC_URL=https://gopay.yourdomain.com
```

### 2. Update Webhook URL

In IntaSend dashboard:
```
https://gopay.yourdomain.com/api/webhooks/intasend
```

### 3. Security Checklist

- [ ] HTTPS enabled on your domain
- [ ] Webhook signature validation enabled
- [ ] API keys stored securely (not in code)
- [ ] Rate limiting configured
- [ ] Database backups enabled
- [ ] Logging and monitoring active
- [ ] Error alerting configured

### 4. Load Wallet Balance

Before going live:
1. Fund your IntaSend wallet
2. Ensure sufficient balance for payouts
3. Set up auto-reload if needed

---

## Payment Flow

### Detailed Transaction Lifecycle

#### 1. Payment Initiation
```
Passenger → QR Scan → Payment Form → Enter Amount → Click Pay
```

#### 2. Collection Phase
```python
POST /api/pay
↓
Create Transaction (status: pending)
↓
IntaSend Collection API
↓
M-Pesa STK Push to Passenger
↓
Response: collection_id
↓
Update Transaction (collection_status: pending)
```

#### 3. Payment Confirmation (via Webhook)
```
IntaSend Webhook → /api/webhooks/intasend
↓
Verify Signature
↓
Parse Webhook Data
↓
Update Transaction (collection_status: completed)
↓
Record Platform Fee
↓
Schedule Payout (Background Task)
```

#### 4. Payout Phase (Automatic)
```python
Background Task → process_payout()
↓
Create Payout Record
↓
IntaSend Payout API
↓
M-Pesa Transfer to Driver
↓
Response: tracking_id
↓
Update Payout (status: processing)
```

#### 5. Payout Confirmation (via Webhook)
```
IntaSend Webhook → /api/webhooks/intasend
↓
Parse Payout Data
↓
Update Payout (status: completed)
↓
Update Transaction (payout_status: completed)
↓
Update Driver Earnings
```

---

## Fee Configuration

### Understanding Platform Fees

The platform deducts a commission from each transaction:

**Formula:**
```
Total Fee = (Amount × Percentage / 100) + Fixed Fee
Driver Amount = Amount - Total Fee
```

### Configuration Options

#### Option 1: Percentage Only
```env
PLATFORM_FEE_PERCENTAGE=0.5  # 0.5%
PLATFORM_FEE_FIXED=0
```
Example: 100 KES payment
- Fee: 0.50 KES
- Driver receives: 99.50 KES

#### Option 2: Fixed Fee Only
```env
PLATFORM_FEE_PERCENTAGE=0
PLATFORM_FEE_FIXED=5  # 5 KES per transaction
```
Example: 100 KES payment
- Fee: 5.00 KES
- Driver receives: 95.00 KES

#### Option 3: Combined
```env
PLATFORM_FEE_PERCENTAGE=0.5
PLATFORM_FEE_FIXED=2
```
Example: 100 KES payment
- Fee: 2.50 KES (0.50 + 2.00)
- Driver receives: 97.50 KES

### Dynamic Fees (Future Enhancement)

Store fees in database for per-driver or per-transaction customization:

```sql
ALTER TABLE drivers ADD COLUMN custom_fee_percentage DECIMAL(5,2);
```

---

## Troubleshooting

### Issue: Payments Not Completing

**Symptoms:** Payment stuck in "pending"

**Solutions:**
1. Check IntaSend dashboard for transaction status
2. Verify webhook URL is accessible:
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/intasend \
     -H "Content-Type: application/json" \
     -d '{"state":"COMPLETE","api_ref":"test"}'
   ```
3. Check application logs for webhook errors
4. Verify webhook secret matches IntaSend dashboard

### Issue: Payouts Not Initiating

**Symptoms:** Payment collected but no payout

**Solutions:**
1. Check IntaSend wallet balance
2. Verify payout permissions in IntaSend account
3. Check application logs:
   ```bash
   tail -f app.log | grep "payout"
   ```
4. Manually trigger payout:
   ```python
   # Debug script
   python -c "
   from app.intasend import IntaSendAPI
   api = IntaSendAPI()
   response = api.initiate_payout(
       phone_number='254722000000',
       amount=50,
       reference='test_payout'
   )
   print(response)
   "
   ```

### Issue: Webhook Signature Validation Failing

**Solutions:**
1. Verify webhook secret in `.env` matches dashboard
2. Check for trailing spaces in secret
3. Temporarily disable validation for testing:
   ```python
   # In main_intasend.py, comment out:
   # if not is_valid:
   #     raise HTTPException(...)
   ```

### Issue: IntaSend API Rate Limits

**Symptoms:** "Too Many Requests" error

**Solutions:**
1. Implement request throttling
2. Add retry logic with exponential backoff
3. Upgrade IntaSend account tier
4. Cache API responses where appropriate

### Debugging Tips

1. **Enable Debug Logging:**
   ```python
   logging.basicConfig(level=logging.DEBUG)
   ```

2. **Test IntaSend Connection:**
   ```python
   from app.intasend import IntaSendAPI
   api = IntaSendAPI()
   balance = api.get_wallet_balance()
   print(f"Wallet balance: {balance}")
   ```

3. **Check Transaction Status:**
   ```bash
   curl http://localhost:8000/api/transaction/YOUR_TRANSACTION_ID/status
   ```

4. **Monitor Database:**
   ```sql
   -- Check recent transactions
   SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
   
   -- Check pending payouts
   SELECT * FROM payouts WHERE status = 'pending';
   
   -- Check platform fees
   SELECT SUM(amount) as total_fees FROM platform_fees;
   ```

---

## Support and Resources

### IntaSend Resources
- Documentation: https://developers.intasend.com
- API Reference: https://developers.intasend.com/api
- Support: support@intasend.com
- Dashboard: https://dashboard.intasend.com

### GoPay Resources
- API Documentation: http://localhost:8000/docs
- GitHub Issues: [Your repo issues page]
- Email: [Your support email]

### Community
- IntaSend Slack: [Link if available]
- Developer Forum: [Link if available]

---

## Next Steps

After successful setup:

1. ✅ Test thoroughly in sandbox
2. ✅ Switch to production keys
3. ✅ Configure monitoring and alerts
4. ✅ Train drivers on the system
5. ✅ Create user documentation
6. ✅ Set up customer support process
7. ✅ Monitor first transactions closely
8. ✅ Optimize based on real usage data

---

**Need Help?** Contact IntaSend support or open an issue in the repository.


