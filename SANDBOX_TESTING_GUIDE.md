# GoPay IntaSend Sandbox Testing Guide

## 🎯 Overview

This guide will help you test the GoPay payment system using IntaSend's **sandbox environment** with the provided publishable key:

```
ISPubKey_test_0afd6a95-8f93-415e-a72b-aab4affe4769
```

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Configure Environment

```bash
# Copy sandbox configuration
cp env.sandbox.example .env

# Edit .env file
nano .env
```

**Required Settings:**
```env
# Your Supabase credentials
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your-supabase-key

# IntaSend SANDBOX credentials
INTASEND_API_KEY=ISSecretKey_test_YOUR_SECRET_KEY
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_0afd6a95-8f93-415e-a72b-aab4affe4769

# Sandbox mode
INTASEND_TEST_MODE=true

# Platform fees
PLATFORM_FEE_PERCENTAGE=0.5
PLATFORM_FEE_FIXED=0
```

### Step 2: Run Database Migration

1. Open Supabase SQL Editor
2. Copy contents of `database/intasend_migration.sql`
3. Execute the migration

### Step 3: Start Application

```bash
# Start server
uvicorn app.main_intasend:app --reload --host 0.0.0.0 --port 8000

# Application available at:
# http://localhost:8000
```

---

## 💳 Payment Testing Modes

GoPay supports **two payment modes**:

### Mode 1: Backend STK Push (Default)
Server-side payment initiation with full control

**URL Format:**
```
http://localhost:8000/pay?driver_id=DRIVER_ID&phone=254722000000
```

### Mode 2: IntaSend Inline SDK (Enhanced)
Frontend SDK with popup payment interface

**URL Format:**
```
http://localhost:8000/pay?driver_id=DRIVER_ID&phone=254722000000&mode=inline
```

---

## 🧪 Testing Scenarios

### Test 1: Complete Payment Flow (Backend Mode)

**Objective:** Test full payment and payout cycle

1. **Register Test Driver**
```bash
curl -X POST http://localhost:8000/api/register_driver \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "phone": "254722000000",
    "email": "driver@test.com",
    "vehicle_type": "boda",
    "vehicle_number": "SAND 001"
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "driver_id": "uuid-here",
  "qr_code_url": "https://...",
  "message": "Driver registered successfully"
}
```

2. **Visit Payment Page**
```
http://localhost:8000/pay?driver_id=YOUR_DRIVER_ID&phone=254722000000
```

3. **Make Test Payment**
   - Enter amount: `100` KES
   - Phone pre-filled: `254722000000`
   - Click "Pay Now"

4. **Verify in Logs**
```bash
# Check application logs
tail -f app.log | grep -E "(Payment|Collection|Payout)"
```

**Expected Log Output:**
```
INFO: Payment initiated: 100.0 KES - Fee: 0.5 - Driver: 99.5
INFO: Collection initiated. ID: col_test_xxxxx
```

5. **Simulate Webhook (Since local webhooks won't reach IntaSend)**
```bash
# Get transaction ID from database
# Then simulate collection webhook
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{
    "state": "COMPLETE",
    "api_ref": "YOUR_TRANSACTION_ID",
    "value": 100,
    "charges": 0,
    "net_amount": 100,
    "currency": "KES",
    "account": "254722000000"
  }'
```

6. **Verify Database Updates**
```sql
-- Check transaction
SELECT * FROM transactions 
WHERE id = 'YOUR_TRANSACTION_ID';

-- Should show:
-- collection_status: completed
-- payout_status: processing
-- status: payout_pending

-- Check payout
SELECT * FROM payouts 
WHERE transaction_id = 'YOUR_TRANSACTION_ID';

-- Should show:
-- status: processing
-- amount: 99.50

-- Check platform fee
SELECT * FROM platform_fees 
WHERE transaction_id = 'YOUR_TRANSACTION_ID';

-- Should show:
-- amount: 0.50
```

7. **Simulate Payout Webhook**
```bash
# Get tracking_id from payouts table
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{
    "state": "COMPLETE",
    "tracking_id": "YOUR_TRACKING_ID",
    "value": 99.5,
    "currency": "KES",
    "account": "254722000000"
  }'
```

8. **Verify Final State**
```sql
-- Transaction should now show:
-- payout_status: completed
-- status: payout_completed

-- Payout should show:
-- status: completed

-- Driver earnings should be updated
SELECT balance, total_earnings 
FROM drivers 
WHERE id = 'YOUR_DRIVER_ID';
```

**✅ Success Criteria:**
- [x] Payment initiated successfully
- [x] Collection webhook processed
- [x] Platform fee recorded (0.50 KES)
- [x] Payout initiated automatically
- [x] Payout completed
- [x] Driver received 99.50 KES
- [x] Admin stats updated

---

### Test 2: Complete Payment Flow (Inline SDK Mode)

**Objective:** Test frontend IntaSend SDK integration

1. **Visit Inline Payment Page**
```
http://localhost:8000/pay?driver_id=YOUR_DRIVER_ID&phone=254722000000&mode=inline
```

2. **Fill Payment Form**
   - Amount: `500` KES
   - Phone: `254722000000` (pre-filled)
   - Email: `test@example.com`
   - First Name: `John`
   - Last Name: `Doe`

3. **Click "Pay with M-Pesa"**
   - IntaSend popup should appear
   - In sandbox mode, payment auto-completes

4. **Check Browser Console**
```javascript
// Should see:
Payment completed: {
  invoice_id: "INV_xxxxx",
  state: "COMPLETE",
  ...
}
```

5. **Verify Backend Recorded Transaction**
   - Check database for new transaction
   - Verify webhook received
   - Confirm payout initiated

**✅ Success Criteria:**
- [x] Inline SDK loaded correctly
- [x] Payment popup appeared
- [x] Payment completed in sandbox
- [x] Frontend received success event
- [x] Backend recorded transaction
- [x] Payout initiated

---

### Test 3: Fee Calculation Accuracy

**Test Different Amounts:**

| Amount | Platform Fee (0.5%) | Driver Receives |
|--------|---------------------|-----------------|
| 100    | 0.50                | 99.50           |
| 500    | 2.50                | 497.50          |
| 1000   | 5.00                | 995.00          |
| 5000   | 25.00               | 4975.00         |

**Verification Query:**
```sql
SELECT 
    amount_paid,
    platform_fee,
    driver_amount,
    (amount_paid - platform_fee) = driver_amount as correct_calculation
FROM transactions;
```

---

### Test 4: Failed Payment Scenario

1. **Use Test Phone for Failure**
```
254722000001  # This simulates failed payment in sandbox
```

2. **Initiate Payment**
   - Amount: 100 KES
   - Phone: `254722000001`

3. **Simulate Failed Webhook**
```bash
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{
    "state": "FAILED",
    "api_ref": "YOUR_TRANSACTION_ID",
    "value": 100,
    "currency": "KES"
  }'
```

4. **Verify Handling**
```sql
SELECT * FROM transactions 
WHERE id = 'YOUR_TRANSACTION_ID';

-- Should show:
-- collection_status: failed
-- payout_status: null
-- status: failed
```

**✅ Success Criteria:**
- [x] Failed payment handled gracefully
- [x] No payout initiated
- [x] Status updated to failed
- [x] No platform fee recorded

---

### Test 5: Multiple Concurrent Payments

**Objective:** Test system under load

1. **Create Multiple Test Drivers**
```bash
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/register_driver \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Test Driver $i\",
      \"phone\": \"25472200000$i\",
      \"email\": \"driver$i@test.com\",
      \"vehicle_type\": \"boda\",
      \"vehicle_number\": \"TEST $i\"
    }"
done
```

2. **Initiate Multiple Payments Simultaneously**
```bash
# Use tools like Apache Bench or write a script
# to simulate concurrent payments
```

3. **Verify All Processed**
```sql
SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE collection_status = 'completed') as completed,
    COUNT(*) FILTER (WHERE payout_status = 'completed') as paid_out
FROM transactions
WHERE created_at > NOW() - INTERVAL '5 minutes';
```

---

## 🔍 Debugging & Monitoring

### Check Application Logs

```bash
# Real-time logs
tail -f app.log

# Filter for payments
tail -f app.log | grep "Payment initiated"

# Filter for webhooks
tail -f app.log | grep "Webhook received"

# Filter for payouts
tail -f app.log | grep "Payout"

# Filter for errors
tail -f app.log | grep "ERROR"
```

### Check Database State

```sql
-- Recent transactions
SELECT 
    id,
    driver_id,
    amount_paid,
    platform_fee,
    driver_amount,
    status,
    collection_status,
    payout_status,
    created_at
FROM transactions
ORDER BY created_at DESC
LIMIT 10;

-- Pending payouts
SELECT * FROM payouts 
WHERE status IN ('pending', 'processing')
ORDER BY created_at;

-- Platform revenue
SELECT 
    SUM(amount) as total_fees,
    COUNT(*) as transaction_count,
    AVG(amount) as avg_fee
FROM platform_fees;

-- Driver earnings
SELECT 
    d.name,
    d.total_earnings,
    COUNT(t.id) as transaction_count,
    SUM(t.driver_amount) as total_payouts
FROM drivers d
LEFT JOIN transactions t ON d.id = t.driver_id
WHERE t.payout_status = 'completed'
GROUP BY d.id, d.name, d.total_earnings
ORDER BY total_earnings DESC;
```

### Check API Health

```bash
# Health check
curl http://localhost:8000/health

# Get driver info
curl http://localhost:8000/api/driver/YOUR_DRIVER_ID

# Transaction status
curl http://localhost:8000/api/transaction/YOUR_TRANSACTION_ID/status

# Admin stats
curl http://localhost:8000/api/admin/stats
```

---

## 📊 Sandbox Test Data

### Test Phone Numbers

| Number       | Behavior              |
|--------------|-----------------------|
| 254722000000 | Success               |
| 254722000001 | Failed                |
| 254722000002 | Timeout               |
| 254712345678 | Generic test          |

### Test Amounts

- **Minimum:** 10 KES
- **Maximum:** 70,000 KES
- **Recommended:** 100, 500, 1000, 5000

### Test Emails

- `test@example.com`
- `sandbox@intasend.com`
- Any valid email format

---

## 🐛 Common Issues & Solutions

### Issue 1: "INTASEND_PUBLISHABLE_KEY not set"

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check if key is set
grep INTASEND_PUBLISHABLE_KEY .env

# Should show:
# INTASEND_PUBLISHABLE_KEY=ISPubKey_test_0afd6a95-8f93-415e-a72b-aab4affe4769
```

### Issue 2: Webhooks Not Received Locally

**Solution:** Use ngrok for local webhook testing

```bash
# Install ngrok
# https://ngrok.com/download

# Start tunnel
ngrok http 8000

# Copy public URL
# https://abc123.ngrok.io

# Configure in IntaSend dashboard:
# https://abc123.ngrok.io/api/webhooks/intasend
```

### Issue 3: Payment Not Completing

**Check:**
1. Amount is at least 10 KES
2. Phone number format is correct (254XXXXXXXXX)
3. Sandbox mode is enabled
4. Logs show collection initiated
5. Database has transaction record

### Issue 4: Payout Not Initiated

**Check:**
1. Collection status is "completed"
2. Background task logs
3. Webhook was received
4. Driver phone number is valid

---

## ✅ Complete Testing Checklist

### Pre-Testing
- [ ] Database migration completed
- [ ] Environment variables configured
- [ ] Application starts without errors
- [ ] Homepage loads (http://localhost:8000)
- [ ] API docs accessible (/docs)

### Driver Registration
- [ ] Can register driver
- [ ] QR code generated
- [ ] QR code uploaded to storage
- [ ] Driver visible in database

### Payment Flow (Backend Mode)
- [ ] Payment page loads
- [ ] Fee breakdown displays correctly
- [ ] Can initiate payment
- [ ] Collection webhook processed
- [ ] Platform fee recorded
- [ ] Payout initiated automatically
- [ ] Payout webhook processed
- [ ] Driver earnings updated

### Payment Flow (Inline Mode)
- [ ] Inline page loads
- [ ] IntaSend SDK loaded
- [ ] Payment popup appears
- [ ] Payment completes
- [ ] Success event received
- [ ] Transaction recorded

### Error Handling
- [ ] Failed payment handled
- [ ] Invalid phone rejected
- [ ] Invalid amount rejected
- [ ] Webhook errors logged

### Dashboards
- [ ] Driver dashboard loads
- [ ] Shows transactions
- [ ] Shows payouts
- [ ] Admin dashboard loads
- [ ] Shows statistics

### Database
- [ ] Transactions recorded
- [ ] Payouts tracked
- [ ] Platform fees logged
- [ ] Triggers working
- [ ] Stats updating

---

## 🎓 Next Steps After Testing

Once sandbox testing is complete:

1. **Review Test Results**
   - Document any issues found
   - Fix any bugs discovered
   - Optimize slow queries

2. **Switch to Production**
   - Get production API keys
   - Update environment variables
   - Configure production webhooks
   - Fund production wallet

3. **Deploy to Production**
   - Deploy application to hosting platform
   - Configure HTTPS
   - Setup monitoring
   - Configure alerts

4. **Go Live**
   - Onboard first real drivers
   - Monitor closely
   - Gather feedback
   - Iterate and improve

---

## 📞 Support

### IntaSend Sandbox Support
- Dashboard: https://sandbox.intasend.com
- Docs: https://developers.intasend.com
- Email: support@intasend.com

### Check Status
```bash
# Application health
curl http://localhost:8000/health

# Recent errors
tail -100 app.log | grep ERROR

# Database connection
psql -h your-db-host -U postgres -c "SELECT NOW()"
```

---

**Happy Testing! 🚀**

Remember: Sandbox is for testing only. Always test thoroughly before switching to production!



