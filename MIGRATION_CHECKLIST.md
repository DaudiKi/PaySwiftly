# GoPay → IntaSend Migration Checklist

Quick reference checklist for migrating to IntaSend integration.

---

## ☑️ Pre-Migration (Preparation)

- [ ] Backup current database
- [ ] Export all existing driver data
- [ ] Document current payment flow
- [ ] Create IntaSend sandbox account
- [ ] Review all new documentation files

---

## ☑️ IntaSend Account Setup

- [ ] Create IntaSend account at https://intasend.com
- [ ] Complete email verification
- [ ] Complete KYC verification (upload ID, business docs)
- [ ] Get Sandbox API credentials
  - [ ] API Key (Secret)
  - [ ] Publishable Key
- [ ] Enable M-Pesa STK Push (Collections)
- [ ] Enable M-Pesa Disbursements (Payouts)
- [ ] Set payout approval to "No approval required"
- [ ] Fund sandbox wallet (for testing)

---

## ☑️ Database Migration

- [ ] Open Supabase project
- [ ] Go to SQL Editor
- [ ] Copy `database/intasend_migration.sql`
- [ ] Execute migration script
- [ ] Verify tables created:
  ```sql
  SELECT * FROM payouts LIMIT 1;
  SELECT * FROM platform_fees LIMIT 1;
  ```
- [ ] Verify transactions table updated:
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'transactions' 
  AND column_name LIKE '%intasend%';
  ```

---

## ☑️ Environment Configuration

- [ ] Copy environment template:
  ```bash
  cp env.intasend.example .env
  ```
- [ ] Add Supabase credentials
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
- [ ] Add IntaSend sandbox credentials
  - [ ] `INTASEND_API_KEY`
  - [ ] `INTASEND_PUBLISHABLE_KEY`
- [ ] Set test mode: `INTASEND_TEST_MODE=true`
- [ ] Configure platform fees
  - [ ] `PLATFORM_FEE_PERCENTAGE=0.5`
  - [ ] `PLATFORM_FEE_FIXED=0`
- [ ] Set base URL: `BASE_PUBLIC_URL=http://localhost:8000`

---

## ☑️ Local Testing

- [ ] Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- [ ] Start application:
  ```bash
  uvicorn app.main_intasend:app --reload --host 0.0.0.0 --port 8000
  ```
- [ ] Application starts without errors
- [ ] Visit http://localhost:8000 - homepage loads
- [ ] Visit http://localhost:8000/docs - API docs load

### Test Driver Registration
- [ ] Register test driver via API:
  ```bash
  curl -X POST http://localhost:8000/api/register_driver \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Driver",
      "phone": "254722000000",
      "email": "test@driver.com",
      "vehicle_type": "boda",
      "vehicle_number": "TEST 001"
    }'
  ```
- [ ] Receive success response with `driver_id`
- [ ] QR code generated and uploaded
- [ ] Driver visible in Supabase database

### Test Payment Flow
- [ ] Visit payment page:
  ```
  http://localhost:8000/pay?driver_id=YOUR_ID&phone=254722000001
  ```
- [ ] Payment form loads correctly
- [ ] Fee breakdown displays when amount entered
- [ ] Phone number pre-filled
- [ ] Form validation works

### Test API Integration
- [ ] Make test payment (amount: 100 KES)
- [ ] Check logs for "Collection initiated"
- [ ] Verify transaction created in database
- [ ] Transaction status: `pending`
- [ ] Collection status: `pending`

### Test Webhook (Manual)
- [ ] Simulate payment webhook:
  ```bash
  curl -X POST http://localhost:8000/api/webhooks/intasend \
    -H "Content-Type: application/json" \
    -d '{
      "state": "COMPLETE",
      "api_ref": "YOUR_TRANSACTION_ID",
      "value": 100,
      "currency": "KES"
    }'
  ```
- [ ] Check logs for "Webhook received"
- [ ] Transaction updated: `collection_status: completed`
- [ ] Platform fee recorded in database
- [ ] Payout scheduled (check logs)

### Test Payout
- [ ] Verify payout record created
- [ ] Check logs for "Payout initiated"
- [ ] Payout status: `processing`
- [ ] Transaction payout status updated

### Test Dashboards
- [ ] Visit driver dashboard:
  ```
  http://localhost:8000/driver/YOUR_DRIVER_ID/dashboard
  ```
- [ ] Dashboard loads with driver info
- [ ] Transactions displayed
- [ ] Payouts displayed
- [ ] Visit admin dashboard:
  ```
  http://localhost:8000/admin/dashboard
  ```
- [ ] Statistics displayed
- [ ] All transactions visible

---

## ☑️ Production Deployment

### Prepare Production Environment
- [ ] Choose hosting platform (Heroku, Railway, etc.)
- [ ] Setup production server
- [ ] Configure domain with HTTPS
- [ ] Note public URL: `https://gopay.yourdomain.com`

### Deploy Application
- [ ] Push code to production server
- [ ] Install dependencies on server
- [ ] Configure environment variables
- [ ] Start application
- [ ] Verify application accessible via HTTPS
- [ ] Check health endpoint: `/health`

### Configure IntaSend Production
- [ ] Get production API credentials from IntaSend
- [ ] Update `.env` on server:
  - [ ] `INTASEND_API_KEY=ISSecretKey_live_...`
  - [ ] `INTASEND_PUBLISHABLE_KEY=ISPubKey_live_...`
  - [ ] `INTASEND_TEST_MODE=false`
  - [ ] `BASE_PUBLIC_URL=https://gopay.yourdomain.com`

### Setup Webhooks
- [ ] Go to IntaSend Dashboard → Webhooks
- [ ] Add webhook URL: `https://gopay.yourdomain.com/api/webhooks/intasend`
- [ ] Select events:
  - [ ] Payment Completed
  - [ ] Payment Failed
  - [ ] Payout Completed
  - [ ] Payout Failed
- [ ] Copy webhook secret
- [ ] Add to production `.env`:
  - [ ] `INTASEND_WEBHOOK_SECRET=whs_...`
- [ ] Test webhook from IntaSend dashboard
- [ ] Verify webhook received in logs

### Fund Production Wallet
- [ ] Login to IntaSend production dashboard
- [ ] Go to Wallet
- [ ] Add funds for payouts
- [ ] Verify balance sufficient

---

## ☑️ Production Testing

### End-to-End Test
- [ ] Register real driver with real phone number
- [ ] Generate QR code
- [ ] Download and print/display QR code
- [ ] Scan QR with real phone
- [ ] Payment page opens correctly
- [ ] Make small test payment (e.g., 50 KES)
- [ ] Receive M-Pesa prompt on phone
- [ ] Enter PIN and confirm
- [ ] Payment successful
- [ ] Webhook received (check logs)
- [ ] Payout initiated automatically
- [ ] Driver receives payout (verify M-Pesa SMS)
- [ ] Dashboard updates correctly
- [ ] Platform fee recorded

### Verify All Components
- [ ] Payment collection working
- [ ] Webhooks received
- [ ] Payouts processing
- [ ] Database updating
- [ ] Dashboards showing data
- [ ] QR codes working from mobile
- [ ] Email notifications (if implemented)

---

## ☑️ Monitoring Setup

### Application Monitoring
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Configure log aggregation
- [ ] Setup uptime monitoring
- [ ] Configure alerting for:
  - [ ] Failed payments
  - [ ] Failed payouts
  - [ ] Webhook errors
  - [ ] API errors
  - [ ] Low wallet balance

### Analytics
- [ ] Setup database backup schedule
- [ ] Configure analytics queries
- [ ] Create admin reports
- [ ] Setup revenue tracking
- [ ] Monitor success rates

---

## ☑️ Documentation & Training

### Update Documentation
- [ ] Update README with new instructions
- [ ] Document API changes
- [ ] Create user guides
- [ ] Create driver onboarding guide
- [ ] Document support procedures

### Train Team
- [ ] Train customer support team
- [ ] Train drivers on new flow
- [ ] Create FAQ document
- [ ] Setup support channels

---

## ☑️ Go-Live Checklist

### Final Verification
- [ ] All tests passed
- [ ] Production environment stable
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Support ready
- [ ] Documentation complete

### Launch
- [ ] Announce new system to drivers
- [ ] Monitor first transactions closely
- [ ] Be ready for support questions
- [ ] Have rollback plan ready

### Post-Launch (First 24 Hours)
- [ ] Monitor all transactions
- [ ] Check webhook logs
- [ ] Verify payouts completing
- [ ] Track success rates
- [ ] Gather user feedback
- [ ] Fix any issues immediately

### Post-Launch (First Week)
- [ ] Review all metrics
- [ ] Optimize based on data
- [ ] Address user feedback
- [ ] Document lessons learned
- [ ] Plan improvements

---

## ☑️ Rollback Plan (If Needed)

If issues arise:
- [ ] Stop new registrations
- [ ] Switch back to old system:
  ```bash
  uvicorn app.main:app  # Old system
  ```
- [ ] Notify affected users
- [ ] Fix issues in staging
- [ ] Re-test thoroughly
- [ ] Deploy fixed version

---

## 📊 Success Metrics

Track these after migration:
- Payment success rate > 95%
- Average payout time < 2 minutes
- Webhook delivery rate > 99%
- Zero failed payouts
- User satisfaction high

---

## ✅ Migration Complete!

Once all items checked:
- [ ] Migration successful
- [ ] Old system can be retired
- [ ] Celebrate! 🎉

---

## 📞 Emergency Contacts

**IntaSend Support:**
- Email: support@intasend.com
- Phone: [IntaSend support number]
- Dashboard: https://dashboard.intasend.com

**Technical Issues:**
- Check logs: `tail -f app.log`
- Check database: Supabase dashboard
- API status: http://localhost:8000/health

---

**Last Updated:** [Date]
**Migration By:** [Your Name]
**Status:** [In Progress / Complete]





