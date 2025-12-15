# GoPay Sandbox Quick Reference Card

## 🔑 Your Sandbox Credentials

```
Publishable Key: ISPubKey_test_0afd6a95-8f93-415e-a72b-aab4affe4769
Test Mode: Enabled
Base URL: https://sandbox.intasend.com/api/
```

---

## ⚡ Quick Start

```bash
# 1. Setup
cp env.sandbox.example .env
# Edit .env with your Supabase credentials

# 2. Start
uvicorn app.main_intasend:app --reload --host 0.0.0.0 --port 8000

# 3. Register Driver
curl -X POST http://localhost:8000/api/register_driver \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Driver","phone":"254722000000","email":"test@driver.com","vehicle_type":"boda","vehicle_number":"TEST 001"}'

# 4. Test Payment
# Visit: http://localhost:8000/pay?driver_id=YOUR_ID&phone=254722000000
```

---

## 📱 Test Phone Numbers

```
✅ 254722000000  →  Successful payment
❌ 254722000001  →  Failed payment
⏱️  254722000002  →  Timeout
🧪 254712345678  →  Generic test
```

---

## 💰 Payment Modes

### Backend Mode (Default)
```
URL: /pay?driver_id=ID&phone=PHONE
Method: Server-side STK Push
Use: Production-ready, full control
```

### Inline Mode (Enhanced)
```
URL: /pay?driver_id=ID&phone=PHONE&mode=inline
Method: IntaSend SDK popup
Use: Better UX, frontend integration
```

---

## 🧪 Test Transaction

```bash
# Amount: 100 KES
# Fee: 0.50 KES (0.5%)
# Driver gets: 99.50 KES

Payment → Collection → Platform Fee → Payout → Complete
  2s        3s          instant        5s        ✅
```

---

## 📊 Fee Examples

| Payment | Fee (0.5%) | Driver Gets |
|---------|------------|-------------|
| 100     | 0.50       | 99.50       |
| 500     | 2.50       | 497.50      |
| 1000    | 5.00       | 995.00      |
| 5000    | 25.00      | 4975.00     |

---

## 🔗 Key Endpoints

```
POST   /api/register_driver              # Register
GET    /pay?driver_id=ID                 # Payment page
POST   /api/pay                           # Initiate payment
POST   /api/webhooks/intasend             # Webhook handler
GET    /api/transaction/ID/status        # Check status
GET    /driver/ID/dashboard               # Driver dashboard
GET    /admin/dashboard                   # Admin dashboard
GET    /health                            # Health check
GET    /docs                              # API docs
```

---

## 🐛 Debug Commands

```bash
# Logs
tail -f app.log | grep -E "(Payment|Payout|Webhook)"

# Database
psql # then:
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
SELECT * FROM payouts WHERE status = 'pending';
SELECT SUM(amount) FROM platform_fees;

# API Health
curl http://localhost:8000/health
curl http://localhost:8000/api/admin/stats
```

---

## 🎯 Testing Checklist

```
☐ Register driver
☐ Generate QR code
☐ Visit payment page
☐ Enter amount (100 KES)
☐ Click "Pay Now"
☐ Check logs (collection initiated)
☐ Simulate webhook (if local)
☐ Verify payout initiated
☐ Check database updated
☐ View driver dashboard
☐ Check admin stats
```

---

## 🔄 Webhook Simulation

```bash
# Collection Success
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{"state":"COMPLETE","api_ref":"TRANSACTION_ID","value":100,"currency":"KES"}'

# Payout Success
curl -X POST http://localhost:8000/api/webhooks/intasend \
  -H "Content-Type: application/json" \
  -d '{"state":"COMPLETE","tracking_id":"TRACKING_ID","value":99.5,"currency":"KES"}'
```

---

## 🌐 Local Webhook Testing

```bash
# Install ngrok
# https://ngrok.com/download

# Start tunnel
ngrok http 8000

# Copy URL: https://abc123.ngrok.io
# Configure in IntaSend: https://abc123.ngrok.io/api/webhooks/intasend
```

---

## ⚠️ Common Errors & Fixes

**"INTASEND_PUBLISHABLE_KEY not set"**
```bash
grep INTASEND_PUBLISHABLE_KEY .env
# Should show: ISPubKey_test_0afd6a95-8f93-415e-a72b-aab4affe4769
```

**"Invalid phone number"**
```
Format: 254XXXXXXXXX (not +254 or 07...)
Example: 254722000000
```

**"Amount too low"**
```
Minimum: 10 KES
Maximum: 70,000 KES
```

**"Payment not completing"**
```bash
# Check logs
tail -20 app.log

# Check database
SELECT * FROM transactions WHERE id = 'ID';

# Verify sandbox mode
grep INTASEND_TEST_MODE .env  # Should be true
```

---

## 📈 Success Metrics

After successful test:
```sql
-- Should see all these
SELECT 
    (SELECT COUNT(*) FROM transactions WHERE collection_status = 'completed') as collections,
    (SELECT COUNT(*) FROM payouts WHERE status = 'completed') as payouts,
    (SELECT SUM(amount) FROM platform_fees) as total_fees,
    (SELECT SUM(total_earnings) FROM drivers) as driver_earnings;
```

---

## 🚀 Production Switch

When ready:
```env
# Update .env
INTASEND_API_KEY=ISSecretKey_live_YOUR_LIVE_KEY
INTASEND_PUBLISHABLE_KEY=ISPubKey_live_YOUR_LIVE_KEY
INTASEND_TEST_MODE=false
BASE_PUBLIC_URL=https://gopay.yourdomain.com
```

---

## 📚 Full Documentation

- **Setup**: `INTASEND_SETUP.md`
- **Testing**: `SANDBOX_TESTING_GUIDE.md`
- **Implementation**: `INTASEND_IMPLEMENTATION.md`
- **Overview**: `INTASEND_README.md`

---

## 💡 Pro Tips

1. **Always test in sandbox first**
2. **Use real phone format (254...)**
3. **Check logs after each action**
4. **Verify database after webhooks**
5. **Test both payment modes**
6. **Simulate failures too**
7. **Monitor admin stats**
8. **Test with different amounts**

---

## 🎉 Quick Win

```bash
# Complete test in 5 minutes:

# 1. Start app
uvicorn app.main_intasend:app --reload &

# 2. Register driver
curl -X POST http://localhost:8000/api/register_driver \
  -H "Content-Type: application/json" \
  -d '{"name":"Quick Test","phone":"254722000000","email":"test@test.com","vehicle_type":"boda","vehicle_number":"QUICK 1"}' \
  | jq -r '.driver_id' > driver_id.txt

# 3. Visit payment page
open "http://localhost:8000/pay?driver_id=$(cat driver_id.txt)&phone=254722000000"

# 4. Check it works! ✅
```

---

**Print this card and keep it handy while testing! 📋**






