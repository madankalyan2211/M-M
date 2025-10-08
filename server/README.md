# Healthcare App Backend Server

Backend server for M&M Healthcare application with email verification, OTP authentication, and MongoDB integration.

## Features

- ✅ User registration with email verification
- ✅ OTP-based email verification (6-digit code)
- ✅ Strong password validation (minimum 8 characters, uppercase, lowercase, number)
- ✅ JWT-based authentication
- ✅ MongoDB database integration
- ✅ Gmail app password integration for email sending
- ✅ Secure password hashing with bcrypt
- ✅ Input validation and sanitization

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Gmail App Password

To send verification emails, you need to set up a Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Go to "App passwords" (search for it in settings)
5. Select "Mail" and "Other (Custom name)"
6. Name it "Healthcare App" and generate
7. Copy the 16-character password

### 3. Set Up Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/healthcare_app

# JWT Secret (generate a random string)
JWT_SECRET=your_secure_random_jwt_secret_here

# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Install and Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify MongoDB is running
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication

#### Register User
```
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
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Resend OTP
```
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile (Protected)
```
PUT /api/auth/profile
Authorization: Bearer <token>
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

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Email Verification Flow

1. User registers with email and password
2. System generates 6-digit OTP
3. OTP is sent to user's email (valid for 10 minutes)
4. User enters OTP to verify email
5. Upon successful verification, user receives welcome email
6. User can now login

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for authentication (7-day expiry)
- Input validation and sanitization
- Email verification required before login
- OTP expiration (10 minutes)
- Secure password requirements

## Testing

Test the server health:
```bash
curl http://localhost:5000/api/health
```

## Troubleshooting

### Email not sending
- Verify Gmail App Password is correct
- Check that 2-Step Verification is enabled
- Ensure EMAIL_USER and EMAIL_APP_PASSWORD are set in .env

### MongoDB connection error
- Verify MongoDB is running: `mongosh`
- Check MONGODB_URI in .env
- For Atlas, ensure IP whitelist is configured

### Port already in use
- Change PORT in .env to another port (e.g., 5001)
- Or kill the process using port 5000

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas for database
4. Set up proper CORS origins
5. Use environment variables for all sensitive data
6. Enable HTTPS
7. Set up proper logging and monitoring
