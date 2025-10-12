# 🏥 M&M Healthcare App

A complete healthcare application with secure authentication, email verification, and AI-powered symptom analysis.

## ✨ Features

✅ **Email Verification** - Gmail app password integration with OTP  
✅ **Strong Password Validation** - 8+ characters with complexity requirements  
✅ **MongoDB Integration** - Secure user data storage  
✅ **JWT Authentication** - Token-based secure authentication  
✅ **Beautiful UI** - Modern, responsive design with animations  
✅ **Real-time Validation** - Instant feedback on password strength  

---

## 🚀 Quick Start

### **👉 [START HERE - Read This First!](START_HERE.md)**

### Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 10 minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[AUTHENTICATION_FLOW.md](AUTHENTICATION_FLOW.md)** - Visual flow diagrams
- **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** - Deploy to Vercel

---

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account with App Password

---

## ⚡ Installation

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

---

## ☁️ Deployment

### Vercel Deployment

This application can be deployed to Vercel for both frontend and backend services.

1. **Frontend Deployment**:
   - Create a new project in Vercel
   - Connect your GitHub repository
   - Set the root directory to `/`
   - Set the build command to `npm run build`
   - Set the output directory to `dist`
   - Add environment variable: `VITE_API_URL` (set to your backend URL)

2. **Backend Deployment**:
   - Create a new project in Vercel
   - Connect your GitHub repository
   - Set the root directory to `/server`
   - The build will be handled automatically by Vercel
   - Add required environment variables:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `EMAIL_USER`
     - `EMAIL_PASS`
     - `FRONTEND_URL`

For detailed deployment instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md).

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/healthcare_app
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 What's New

This app now includes:

1. **Email Verification System**
   - 6-digit OTP sent via Gmail
   - 10-minute expiry
   - Resend functionality
   - Beautiful email templates

2. **Strong Password Requirements**
   - Minimum 8 characters
   - Uppercase + lowercase + number
   - Real-time validation feedback
   - Visual strength indicator

3. **MongoDB Integration**
   - User authentication data
   - Health profile storage
   - Secure password hashing
   - JWT token management

4. **Enhanced UI**
   - OTP verification screen
   - Password strength indicator
   - Error/success notifications
   - Smooth animations

---

## 📱 Usage

1. **Register**: Create account with email and strong password
2. **Verify**: Enter 6-digit code sent to your email
3. **Login**: Access your healthcare dashboard
4. **Explore**: Use AI-powered symptom analysis

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Gmail)
- bcrypt

---

## 📚 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend verification code
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification required
- OTP expiration (10 minutes)
- Input validation
- CORS protection

---

## 📖 Documentation

For detailed setup instructions, troubleshooting, and more:

- **Quick Setup**: See [QUICK_START.md](QUICK_START.md)
- **Full Guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Technical Details**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Flow Diagrams**: See [AUTHENTICATION_FLOW.md](AUTHENTICATION_FLOW.md)
- **Deployment Guide**: See [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🎨 Original Design

This is based on the Healthcare App Design. The original Figma project is available at:
https://www.figma.com/design/W02zPDT3Cxg3nnzjIKl8nd/Healthcare-App-Design

---

## 📞 Support

Having issues? Check:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Troubleshooting section
2. Verify environment variables are correct
3. Ensure MongoDB is running
4. Check server logs for errors

---

## ✅ Quick Test

```bash
# Terminal 1 - Backend
cd server && npm install && npm run dev

# Terminal 2 - Frontend  
npm install && npm run dev

# Open http://localhost:5173
# Register → Check email → Enter OTP → Login!
```

---

**Built with ❤️ for secure, modern healthcare applications**