# GoPay Payment Aggregator

A modern payment aggregator system for boda riders and Uber/Bolt drivers using Python (FastAPI), Firebase, and M-Pesa Daraja API. The system provides a seamless payment experience for passengers and comprehensive dashboards for drivers and administrators.

## Features

- 🚗 **Driver Registration**: Easy onboarding with QR code generation
- 💳 **M-Pesa Integration**: Seamless mobile money payments
- 📊 **Real-time Dashboards**: For both drivers and administrators
- 📱 **Responsive UI**: Works on all devices
- 🔒 **Secure Transactions**: Built with security best practices
- 📈 **Transaction Tracking**: Complete payment history and analytics

## Tech Stack

- Backend: FastAPI
- Database: Firebase Firestore
- Storage: Firebase Storage
- Authentication: Firebase Auth
- Payment: M-Pesa Daraja API
- Frontend: HTML + TailwindCSS + Vanilla JS
- QR Code: qrcode[pil]

## Project Structure

```
mpesa-aggregator/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application and routes
│   ├── models.py            # Pydantic models
│   ├── firebase_util.py     # Firebase integration
│   ├── mpesa.py            # M-Pesa API integration
│   ├── qr_utils.py         # QR code generation
│   ├── templates/          # HTML templates
│   │   ├── pay.html
│   │   ├── driver_dashboard.html
│   │   └── admin_dashboard.html
│   └── static/
│       └── styles.css      # Custom styles
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── run.sh                # Startup script
```

## Firestore Schema

### Collections

1. **drivers/{driverId}**
   ```json
   {
     "id": "string",
     "name": "string",
     "phone": "string",
     "email": "string",
     "vehicle_type": "string",
     "vehicle_number": "string",
     "qr_code_url": "string",
     "balance": "float",
     "total_earnings": "float",
     "created_at": "timestamp",
     "updated_at": "timestamp"
   }
   ```

2. **transactions/{transactionId}**
   ```json
   {
     "id": "string",
     "driver_id": "string",
     "passenger_phone": "string",
     "amount_paid": "float",
     "platform_fee": "float",
     "driver_amount": "float",
     "status": "string",
     "mpesa_receipt": "string",
     "created_at": "timestamp",
     "updated_at": "timestamp"
   }
   ```

3. **adminStats/revenue**
   ```json
   {
     "total_transactions": "integer",
     "total_revenue": "float",
     "total_platform_fees": "float",
     "active_drivers": "integer",
     "updated_at": "timestamp"
   }
   ```

## Setup Instructions

### Prerequisites

1. Python 3.8+
2. Firebase account
3. M-Pesa Daraja API account
4. Node.js and npm (for development)

### Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Storage
4. Create a service account and download the JSON key
5. Place the service account JSON in your project root as `serviceAccount.json`

### M-Pesa Sandbox Setup

1. Create a Safaricom Developer Account
2. Create a new app to get your credentials
3. Configure your app settings
4. Note down your:
   - Consumer Key
   - Consumer Secret
   - Shortcode
   - Passkey

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mpesa-aggregator
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   .\venv\Scripts\activate  # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

5. Configure your environment variables in `.env`:
   ```
   BASE_PUBLIC_URL=http://localhost:8000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json
   DARAJA_BASE_URL=https://sandbox.safaricom.co.ke
   DARAJA_CONSUMER_KEY=your-consumer-key
   DARAJA_CONSUMER_SECRET=your-consumer-secret
   DARAJA_SHORT_CODE=174379
   DARAJA_PASSKEY=your-passkey
   DARAJA_CALLBACK_URL=http://localhost:8000/api/mpesa/callback
   DARAJA_ACCOUNT_REF=GoPay
   DARAJA_TRANSACTION_DESC=Payment for ride
   ```

6. Run the application:
   ```bash
   ./run.sh
   ```

   The application will be available at `http://localhost:8000`

## Deployment

### Production Deployment Checklist

1. **Environment Configuration**
   - Set up production environment variables
   - Configure production Firebase project
   - Set up production M-Pesa credentials

2. **Security Measures**
   - Enable HTTPS
   - Set up CORS properly
   - Configure rate limiting
   - Implement request validation
   - Set up proper logging

3. **Performance Optimization**
   - Enable caching where appropriate
   - Optimize database queries
   - Configure proper connection pooling

### Deployment Options

1. **Docker Deployment**
   ```bash
   # Build the image
   docker build -t gopay-aggregator .
   
   # Run the container
   docker run -p 8000:8000 gopay-aggregator
   ```

2. **Cloud Platform Deployment**
   - Deploy to Google Cloud Run
   - Deploy to Heroku
   - Deploy to AWS ECS

## Security Checklist

- [x] Secure environment variables
- [x] Firebase security rules
- [x] Input validation
- [x] CORS configuration
- [x] Rate limiting
- [x] Error handling
- [x] Audit logging
- [x] Data encryption
- [x] Authentication
- [x] Authorization

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify service account JSON is correct
   - Check Firebase project settings
   - Verify environment variables

2. **M-Pesa API Issues**
   - Verify API credentials
   - Check callback URL configuration
   - Verify transaction parameters

3. **QR Code Generation Issues**
   - Check storage permissions
   - Verify Firebase Storage configuration
   - Check file upload settings

### Debug Mode

Enable debug mode by setting:
```python
app = FastAPI(debug=True)
```

### Logging

The application uses Python's built-in logging module. To enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.




