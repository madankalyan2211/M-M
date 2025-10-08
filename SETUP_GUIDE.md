# Healthcare App - Complete Setup Guide

This guide will help you set up the complete healthcare application with email verification, OTP authentication, and MongoDB integration.

## 🎯 Features Implemented

✅ **Email Verification** - Gmail app password integration  
✅ **OTP Authentication** - 6-digit code sent to email (10-minute expiry)  
✅ **Strong Password Validation** - Minimum 8 characters, uppercase, lowercase, and number required  
✅ **MongoDB Integration** - User data stored securely in MongoDB  
✅ **JWT Authentication** - Secure token-based authentication  
✅ **Real-time Password Strength Indicator** - Visual feedback during registration  
✅ **Responsive UI** - Beautiful, modern interface with animations  

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Gmail Account** with App Password enabled

---

## 🚀 Quick Start

### Step 1: Install MongoDB

**Option A: Local MongoDB (macOS)**
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/healthcare_app`)

### Step 2: Set Up Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Search for "App passwords" in settings
5. Select **Mail** and **Other (Custom name)**
6. Name it "Healthcare App"
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this for the .env file)

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit the `.env` file with your configuration:**

```env
# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/healthcare_app

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_app

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Start the backend server:**

```bash
# Development mode with auto-reload
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
# 📧 Email service configured
```

### Step 4: Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to project root
cd "Healthcare App Design 4"

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit the `.env` file:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev

# Application will open at http://localhost:5173
```

---

## 🧪 Testing the Application

### Test Registration Flow

1. **Open** http://localhost:5173
2. Click **"Sign Up"** tab
3. Fill in the form:
   - **Name**: John Doe
   - **Email**: your_test_email@gmail.com
   - **Password**: Test1234 (must meet requirements)
   - **Confirm Password**: Test1234
4. Click **"Create Account"**
5. **Check your email** for the 6-digit verification code
6. Enter the code in the verification screen
7. Click **"Verify Email"**
8. You'll be logged in automatically!

### Test Login Flow

1. Click **"Sign In"** tab
2. Enter your **email** and **password**
3. Click **"Sign In"**
4. If email not verified, you'll receive a new OTP
5. Enter the OTP to complete login

### Password Requirements

When registering, your password must have:
- ✅ At least 8 characters
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)

**Example valid passwords:**
- `Password123`
- `SecurePass1`
- `MyHealth2024`

---

## 📧 Email Templates

The system sends two types of emails:

### 1. Verification Email (OTP)
- **Subject**: "Verify Your Email - M&M Healthcare"
- **Contains**: 6-digit code
- **Expiry**: 10 minutes
- **Can resend**: Yes

### 2. Welcome Email
- **Subject**: "Welcome to M&M Healthcare! 🎉"
- **Sent**: After successful email verification
- **Contains**: Feature overview and welcome message

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiry
- **Email Verification**: Required before login
- **OTP Expiration**: 10-minute validity
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend URL only

---

## 🛠️ API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "healthDetails": {
    "height": "180",
    "weight": "75",
    "bloodGroup": "O+"
  }
}
```

---

## 🐛 Troubleshooting

### Email not sending

**Problem**: Verification emails not arriving

**Solutions**:
1. Check Gmail App Password is correct in `.env`
2. Verify 2-Step Verification is enabled on your Google account
3. Check spam/junk folder
4. Try generating a new App Password
5. Check server logs for email errors

### MongoDB connection error

**Problem**: `MongoDB connection error`

**Solutions**:
1. **Local MongoDB**: Verify MongoDB is running with `mongosh`
2. **Atlas**: Check connection string is correct
3. **Atlas**: Ensure your IP address is whitelisted
4. **Atlas**: Verify username/password are correct

### Port already in use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in server/.env to 5001
```

### CORS errors

**Problem**: `Access to fetch blocked by CORS policy`

**Solutions**:
1. Ensure backend is running on port 5000
2. Ensure frontend is running on port 5173
3. Check `FRONTEND_URL` in server/.env matches your frontend URL

### TypeScript errors

**Problem**: TypeScript compilation errors

**Solution**: These are expected until dependencies are installed. Run:
```bash
npm install
```

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isEmailVerified: Boolean (default: false),
  emailVerificationOTP: String,
  otpExpiry: Date,
  avatar: String,
  phone: String,
  location: String,
  preferences: {
    language: String (default: 'en'),
    voiceEnabled: Boolean (default: true),
    notifications: Boolean (default: true)
  },
  healthDetails: {
    height: String,
    weight: String,
    bloodGroup: String,
    dateOfBirth: String,
    gender: String,
    allergies: String,
    chronicConditions: String,
    emergencyContact: String,
    preferredUnits: String (metric/imperial)
  },
  createdAt: Date,
  lastLogin: Date
}
```

---

## 🎨 UI Features

- **Animated Background**: Floating particles
- **Real-time Password Validation**: Visual indicators
- **OTP Input**: Auto-focus and paste support
- **Error/Success Messages**: Animated notifications
- **Loading States**: Spinner animations
- **Responsive Design**: Works on all devices
- **Dark Mode Support**: (can be enabled in settings)

---

## 📝 Environment Variables Summary

### Backend (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017/healthcare_app
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚢 Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables in your hosting platform
2. Use MongoDB Atlas for production database
3. Set `NODE_ENV=production`
4. Use a strong `JWT_SECRET`
5. Update `FRONTEND_URL` to your production frontend URL

### Frontend Deployment (e.g., Vercel, Netlify)

1. Set `VITE_API_URL` to your production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check server logs for detailed error messages
4. Ensure MongoDB is running and accessible

---

## ✅ Checklist

Before running the application, ensure:

- [ ] MongoDB is installed and running
- [ ] Gmail App Password is generated
- [ ] Backend `.env` file is configured
- [ ] Frontend `.env` file is configured
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server is running (`cd server && npm run dev`)
- [ ] Frontend is running (`npm run dev`)

---

## 🎉 Success!

If everything is set up correctly, you should be able to:

1. ✅ Register a new account
2. ✅ Receive verification email with OTP
3. ✅ Verify email using OTP
4. ✅ Login with verified account
5. ✅ Access the healthcare dashboard

**Enjoy your secure, production-ready healthcare application!** 🏥
