# GoPay IntaSend Implementation Guide

## 🚀 Overview

This guide walks you through implementing the full IntaSend integration for automatic payment collection and driver payouts.

## 📋 What's New

### Key Features Added
1. **Automatic Payment Collection** - IntaSend STK Push via M-Pesa
2. **Instant Driver Payouts** - Automatic disbursements after payment
3. **Platform Fee Management** - Configurable commission splitting
4. **Real-time Webhooks** - Instant payment & payout notifications
5. **Comprehensive Tracking** - Detailed transaction and payout logs

### Architecture Changes
- **Old Flow**: Payment → Manual Tracking → Manual Payout
- **New Flow**: Payment → Auto Fee Split → Auto Payout → Dashboard Update

---

## 📁 Files Structure

### New Files Created

```
app/
├── intasend.py                    # IntaSend API integration
├── main_intasend.py               # New FastAPI routes with IntaSend
└── templates/
    └── pay_intasend.html          # Enhanced payment form

database/
└── intasend_migration.sql         # Database schema updates

docs/
├── INTASEND_SETUP.md              # Detailed setup guide
├── INTASEND_IMPLEMENTATION.md     # This file
└── env.intasend.example           # Environment template
```

### Modified Files
- `app/models.py` - Added payout and fee tracking models
- `app/supabase_util.py` - Added IntaSend-specific methods

---

## 🔧 Implementation Steps

### Step 1: Database Migration (5 minutes)

1. Open Supabase SQL Editor
2. Copy contents of `database/intasend_migration.sql`
3. Execute the migration
4. Verify new tables:

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payouts', 'platform_fees');

-- Verify transactions table updated
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'transactions' 
AND column_name LIKE '%intasend%';
```

**Expected Result**: 2 new tables + 10 new columns in transactions

### Step 2: IntaSend Account Setup (15 minutes)

1. **Create Account**
   - Visit https://intasend.com
   - Sign up and verify email
   - Complete KYC verification

2. **Get API Credentials**
   - Login to https://dashboard.intasend.com
   - Go to Settings → API Keys
   - Copy **Sandbox API Key** and **Publishable Key**

3. **Enable Services**
   - Collections: Enable M-Pesa STK Push
   - Payouts: Enable M-Pesa Disbursements
   - Set payout approval to "No approval required"

4. **Fund Test Wallet** (for testing)
   - Go to Wallet
   - Add test funds (sandbox mode)

📚 **Detailed guide**: See `INTASEND_SETUP.md`

### Step 3: Environment Configuration (5 minutes)

1. Copy environment template:
```bash
cp env.intasend.example .env
```

2. Update `.env` with your credentials:
```env
# Supabase (existing)
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your-key-here

# IntaSend (new)
INTASEND_API_KEY=ISSecretKey_test_xxx
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_xxx
INTASEND_TEST_MODE=true

# Platform Fees
PLATFORM_FEE_PERCENTAGE=0.5
PLATFORM_FEE_FIXED=0
```

### Step 4: Install Dependencies (2 minutes)

```bash
# All dependencies already in requirements.txt
pip install -r requirements.txt
```

### Step 5: Test Locally (10 minutes)

1. **Start the new application**:
```bash
uvicorn app.main_intasend:app --reload --host 0.0.0.0 --port 8000
```

2. **Register a test driver**:
```bash
curl -X POST http://localhost:8000/api/register_driver \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Driver",
    "phone": "254722000000",
    "email": "driver@test.com",
    "vehicle_type": "boda",
    "vehicle_number": "TEST 123"
  }'
```

Save the `driver_id` from response.

3. **Visit payment page**:
```
http://localhost:8000/pay?driver_id=YOUR_DRIVER_ID&phone=254722000001
```

4. **Test payment**:
   - Enter amount: 100
   - Phone will be pre-filled
   - Click "Pay Now"
   - Check logs for collection initiation

5. **Simulate webhook** (since local webhooks won't work yet):
```bash
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{
    "state": "COMPLETE",
    "api_ref": "YOUR_TRANSACTION_ID",
    "value": 100,
    "charges": 0,
    "net_amount": 100,
    "currency": "KES"
  }'
```

6. **Check database**:
```sql
-- View transaction
SELECT * FROM transactions WHERE id = 'YOUR_TRANSACTION_ID';

-- View payout
SELECT * FROM payouts WHERE transaction_id = 'YOUR_TRANSACTION_ID';

-- View platform fee
SELECT * FROM platform_fees WHERE transaction_id = 'YOUR_TRANSACTION_ID';
```

### Step 6: Deploy to Production (30 minutes)

1. **Deploy Application**
   - Deploy to your hosting platform (Heroku, Railway, etc.)
   - Ensure HTTPS is enabled
   - Note your public URL: `https://gopay.yourdomain.com`

2. **Configure Webhook**
   - Go to IntaSend Dashboard → Settings → Webhooks
   - Add webhook URL: `https://gopay.yourdomain.com/api/webhooks/intasend`
   - Select events: Payment Completed, Payment Failed, Payout Completed, Payout Failed
   - Copy the webhook secret
   - Add to `.env`: `INTASEND_WEBHOOK_SECRET=whs_xxx`

3. **Switch to Production Keys**
   - Get production API keys from IntaSend
   - Update `.env`:
   ```env
   INTASEND_API_KEY=ISSecretKey_live_xxx
   INTASEND_PUBLISHABLE_KEY=ISPubKey_live_xxx
   INTASEND_TEST_MODE=false
   BASE_PUBLIC_URL=https://gopay.yourdomain.com
   ```

4. **Fund Production Wallet**
   - Add funds to IntaSend production wallet
   - Ensure sufficient balance for payouts

5. **Test End-to-End**
   - Register real driver
   - Make test payment with real M-Pesa
   - Verify payment collected
   - Verify payout received
   - Check all logs and dashboards

---

## 🔄 Migration from Old System

### If You Have Existing Drivers

```python
# Script to update existing QR codes
import asyncio
from app.supabase_util import SupabaseManager
from app.qr_utils import generate_payment_qr

async def update_qr_codes():
    manager = SupabaseManager()
    
    # Get all drivers
    result = manager.supabase.table('drivers').select('*').execute()
    drivers = result.data
    
    for driver in drivers:
        # Generate new QR with phone pre-fill
        qr_bytes = generate_payment_qr(driver['id'], driver['phone'])
        
        # Upload new QR
        qr_url = await manager.upload_qr_code(driver['id'], qr_bytes)
        
        # Update driver
        await manager.update_driver(driver['id'], {'qr_code_url': qr_url})
        
        print(f"Updated QR for driver: {driver['name']}")

# Run migration
asyncio.run(update_qr_codes())
```

### Switching Between Old and New Systems

You can run both systems in parallel during testing:

**Old System** (M-Pesa Daraja):
```bash
uvicorn app.main:app --port 8000
```

**New System** (IntaSend):
```bash
uvicorn app.main_intasend:app --port 8001
```

### Final Cutover

When ready to fully switch:

1. Backup database
2. Stop old system
3. Rename files:
```bash
mv app/main.py app/main_old.py
mv app/main_intasend.py app/main.py
mv app/templates/pay.html app/templates/pay_old.html
mv app/templates/pay_intasend.html app/templates/pay.html
```
4. Restart application
5. Monitor logs closely

---

## 📊 Key Differences: Old vs New

### Payment Collection

| Feature | Old (Daraja) | New (IntaSend) |
|---------|--------------|----------------|
| API | M-Pesa Daraja | IntaSend |
| STK Push | ✅ Yes | ✅ Yes |
| Callback | Custom endpoint | Webhook |
| Fee Calculation | Manual | Automatic |
| Payout | Manual | Automatic |

### Transaction Tracking

**Old Schema**:
```
transactions
├── id
├── driver_id
├── amount_paid
├── platform_fee
├── status
└── mpesa_receipt
```

**New Schema**:
```
transactions
├── id
├── driver_id
├── amount_paid
├── platform_fee
├── driver_amount
├── status
├── intasend_collection_id    # New
├── intasend_tracking_id       # New
├── collection_status          # New
├── payout_status              # New
├── collection_response        # New
├── payout_response            # New
└── timestamps...

payouts (new table)
├── id
├── transaction_id
├── driver_id
├── amount
├── tracking_id
├── status
└── intasend_response

platform_fees (new table)
├── id
├── transaction_id
├── amount
├── fee_type
└── timestamps...
```

---

## 🧪 Testing Checklist

### Unit Testing

- [ ] IntaSend API connection
- [ ] Fee calculation logic
- [ ] Payment collection initiation
- [ ] Payout initiation
- [ ] Webhook signature validation
- [ ] Database operations

### Integration Testing

- [ ] Complete payment flow
- [ ] Webhook processing
- [ ] Background payout task
- [ ] Error handling
- [ ] Rate limiting
- [ ] Concurrent transactions

### User Acceptance Testing

- [ ] Driver registration
- [ ] QR code generation
- [ ] Payment page loading
- [ ] M-Pesa prompt received
- [ ] Payment confirmation
- [ ] Payout received
- [ ] Dashboard updates
- [ ] Email notifications (if implemented)

---

## 📈 Monitoring & Analytics

### Key Metrics to Track

1. **Payment Success Rate**
```sql
SELECT 
    COUNT(*) FILTER (WHERE collection_status = 'completed') * 100.0 / COUNT(*) as success_rate
FROM transactions 
WHERE created_at > NOW() - INTERVAL '24 hours';
```

2. **Average Payout Time**
```sql
SELECT 
    AVG(payout_completed_at - collection_completed_at) as avg_payout_time
FROM transactions
WHERE payout_status = 'completed';
```

3. **Platform Revenue**
```sql
SELECT 
    SUM(amount) as total_fees,
    COUNT(*) as fee_count
FROM platform_fees
WHERE collected_at > NOW() - INTERVAL '30 days';
```

4. **Failed Payouts**
```sql
SELECT * FROM payouts 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

### Logging

Monitor these log messages:
- `Payment initiated:` - Payment request
- `Collection initiated:` - STK push sent
- `Webhook received:` - IntaSend callback
- `Payout scheduled:` - Background task started
- `Payout initiated successfully:` - Payout sent
- `Payout completed:` - Driver received money

---

## 🐛 Common Issues & Solutions

### Issue: "IntaSend API error: 401 Unauthorized"
**Solution**: Check API key in `.env` - ensure no spaces, correct key type (sandbox vs production)

### Issue: Webhook not received
**Solution**: 
1. Verify webhook URL is public and accessible
2. Check webhook secret matches
3. Test with curl locally
4. Check IntaSend dashboard for webhook logs

### Issue: Payout not initiating
**Solution**:
1. Check wallet balance
2. Verify payout permissions enabled
3. Check background task logs
4. Verify driver phone number format

### Issue: Fee calculation incorrect
**Solution**: 
1. Verify `PLATFORM_FEE_PERCENTAGE` in `.env`
2. Check calculation logic in `intasend.py`
3. Test with known amounts

---

## 🔐 Security Best Practices

1. **API Keys**: Never commit to git
2. **Webhook Signature**: Always validate
3. **HTTPS**: Required for production
4. **Rate Limiting**: Implement on all endpoints
5. **Input Validation**: Sanitize all user inputs
6. **Error Messages**: Don't expose sensitive info
7. **Logging**: Log actions, not secrets
8. **Database**: Use prepared statements
9. **CORS**: Restrict allowed origins
10. **Monitoring**: Alert on suspicious activity

---

## 📞 Support

### IntaSend Support
- Email: support@intasend.com
- Docs: https://developers.intasend.com
- Dashboard: https://dashboard.intasend.com

### GoPay Issues
- Create issue in repository
- Check logs: `tail -f app.log`
- Test API: http://localhost:8000/docs

---

## 🎉 Congratulations!

You've successfully implemented IntaSend integration with automatic payouts!

**Next Steps**:
1. Monitor first transactions closely
2. Gather user feedback
3. Optimize based on usage
4. Scale as needed

**Happy coding! 🚀**


