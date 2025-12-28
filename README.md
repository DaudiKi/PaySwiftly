# PaySwiftly - Modern Payment Platform for Drivers

A production-ready payment aggregator system for boda riders and ride-hailing drivers with automatic M-Pesa integration and instant payouts.

## 🚀 Live Deployment

- **Frontend**: [https://pay-swiftly.vercel.app](https://pay-swiftly.vercel.app)
- **Backend API**: `https://payswiftly-backend.onrender.com`
- **Status**: ✅ Production Ready

## ✨ Features

- 🚗 **Driver Registration** - Easy onboarding with automatic QR code generation
- 💳 **M-Pesa STK Push** - Seamless mobile money payments via IntaSend
- 💰 **Instant Payouts** - Automatic driver payouts within minutes
- 📊 **Real-time Dashboards** - Driver earnings and transaction tracking
- 📱 **Mobile-First Design** - Premium glassmorphism UI
- 🔒 **Secure** - Row Level Security (RLS) with Supabase
- 📈 **Transaction History** - Complete payment tracking and analytics

## 🏗️ Architecture

### Tech Stack

**Frontend (Next.js 16 + Vercel)**
- Framework: Next.js 16 with App Router
- Styling: TailwindCSS with custom design system
- Deployment: Vercel (auto-deploy from `main` branch)

**Backend (FastAPI + Render)**
- Framework: FastAPI (Python async)
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage (QR codes)
- Payment: IntaSend (M-Pesa integration)
- Deployment: Render (auto-deploy from `main` branch)

### Project Structure

```
PaySwiftly/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── register/        # Driver registration
│   │   ├── login/           # Driver login
│   │   ├── dashboard/       # Driver dashboard
│   │   └── pay/             # Payment page (QR scan)
│   ├── utils/api.ts         # API client
│   └── types/index.ts       # TypeScript definitions
├── app/                     # FastAPI backend
│   ├── main.py             # API routes
│   ├── models.py           # Pydantic models
│   ├── supabase_util.py    # Database operations
│   ├── intasend.py         # Payment integration
│   └── qr_utils.py         # QR code generation
├── scripts/
│   └── backup_db.py        # Daily database backup
└── render.yaml             # Render deployment config
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Supabase account
- IntaSend account (with KYC verification for live mode)

### Local Development

#### Backend Setup

1. **Clone and install dependencies:**
   ```bash
   cd PaySwiftly
   python -m venv venv
   source venv/bin/activate  # Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Create `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   INTASEND_API_KEY=your_api_key
   INTASEND_PUBLISHABLE_KEY=your_publishable_key
   INTASEND_TEST_MODE=true
   BASE_PUBLIC_URL=http://localhost:3000
   ```

3. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

#### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the app.

## 🌐 Deployment

### Backend (Render)

The backend auto-deploys when you push to `main` branch.

**Required Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INTASEND_API_KEY`
- `INTASEND_PUBLISHABLE_KEY`
- `INTASEND_TEST_MODE` (set to `false` for production)
- `BASE_PUBLIC_URL` (your Vercel frontend URL)

### Frontend (Vercel)

The frontend auto-deploys when you push to `main` branch.

**Required Environment Variable:**
- `NEXT_PUBLIC_API_URL` (your Render backend URL)

## 📊 Database Schema

### Tables

**drivers**
- `id` (UUID, primary key)
- `name`, `phone`, `email`
- `vehicle_type`, `vehicle_number`
- `qr_code_url`
- `balance`, `total_earnings`

**transactions**
- `id` (UUID, primary key)
- `driver_id` (references drivers)
- `passenger_phone`
- `amount_paid`, `platform_fee`, `driver_amount`
- `status`, `collection_status`, `payout_status`
- `collection_id`, `tracking_id`

**payouts**
- `id` (UUID, primary key)
- `transaction_id`, `driver_id`
- `amount`, `status`
- `tracking_id`

## 🔧 Configuration

### IntaSend Setup

1. **Create Account**: Sign up at [intasend.com](https://intasend.com)
2. **KYC Verification**: Complete verification for live mode
3. **Get API Keys**: Settings → API Keys
4. **Configure Webhook**: `https://your-backend.onrender.com/api/webhooks/intasend`

### Supabase Setup

1. **Create Project**: [supabase.com](https://supabase.com)
2. **Run Schema**: Execute `database/schema.sql` in SQL Editor
3. **Create Storage Bucket**: Name it `qr-codes` and make it public
4. **Enable RLS**: Apply policies from `SUPABASE_IMPROVEMENTS.md`

## 🔐 Security

- ✅ HTTPS enforced on all endpoints
- ✅ Row Level Security (RLS) on Supabase
- ✅ Environment variables for secrets
- ✅ CORS configured for frontend domain
- ✅ Webhook signature verification
- ✅ Input validation with Pydantic

## 🐛 Troubleshooting

### Payment Failures

**"No response from user"**
- **Cause**: User didn't enter PIN within timeout (~60s) or poor network
- **Solution**: Ensure strong cellular signal, retry payment

**Webhook not firing**
- **Cause**: Incorrect webhook URL in IntaSend
- **Solution**: Verify webhook URL in IntaSend dashboard

### Deployment Issues

**Vercel build fails**
- Check TypeScript errors in build logs
- Verify all environment variables are set

**Render deployment fails**
- Check Python version (must be 3.11.9)
- Verify all dependencies in `requirements.txt`

## 📝 API Endpoints

### Public Endpoints

- `POST /api/register_driver` - Register new driver
- `GET /api/driver/{driver_id}` - Get driver details
- `POST /api/pay` - Initiate payment
- `GET /api/transaction/{id}/status` - Check payment status

### Webhook Endpoints

- `POST /api/webhooks/intasend` - IntaSend payment notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Check the [Payment Diagnostic Guide](C:\Users\daudi\.gemini\antigravity\brain\e340ab04-a229-4a3c-a868-290e5e1d833c/payment_diagnostic.md)
- Review the [Deployment Guide](C:\Users\daudi\.gemini\antigravity\brain\e340ab04-a229-4a3c-a868-290e5e1d833c/DEPLOYMENT_GUIDE.md)

---

**Built with ❤️ for the driver community**
