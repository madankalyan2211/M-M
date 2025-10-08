# 🔐 Authentication Flow Diagram

## Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. USER FILLS REGISTRATION FORM
   ┌──────────────────────────┐
   │ Name: John Doe           │
   │ Email: john@example.com  │
   │ Password: Test1234       │  ← Must be 8+ chars, uppercase,
   │ Confirm: Test1234        │    lowercase, number
   └──────────────────────────┘
              ↓
   
2. FRONTEND VALIDATES PASSWORD
   ┌──────────────────────────┐
   │ ✅ At least 8 characters │
   │ ✅ One uppercase letter  │
   │ ✅ One lowercase letter  │
   │ ✅ One number            │
   └──────────────────────────┘
              ↓
   
3. SENDS TO BACKEND API
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "Test1234",
     "confirmPassword": "Test1234"
   }
              ↓
   
4. BACKEND VALIDATES & CREATES USER
   ┌──────────────────────────┐
   │ • Validate input         │
   │ • Check email unique     │
   │ • Hash password (bcrypt) │
   │ • Generate 6-digit OTP   │
   │ • Save to MongoDB        │
   └──────────────────────────┘
              ↓
   
5. SENDS EMAIL VIA GMAIL
   ┌──────────────────────────────────────┐
   │ From: M&M Healthcare                 │
   │ To: john@example.com                 │
   │ Subject: Verify Your Email           │
   │                                      │
   │ Your verification code is: 123456    │
   │ This code expires in 10 minutes      │
   └──────────────────────────────────────┘
              ↓
   
6. FRONTEND SHOWS OTP SCREEN
   ┌──────────────────────────┐
   │ Enter Verification Code  │
   │  ┌───┬───┬───┬───┬───┬───┐│
   │  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 ││
   │  └───┴───┴───┴───┴───┴───┘│
   │  [Resend Code]           │
   └──────────────────────────┘
              ↓
   
7. USER ENTERS OTP
   POST /api/auth/verify-otp
   {
     "email": "john@example.com",
     "otp": "123456"
   }
              ↓
   
8. BACKEND VERIFIES OTP
   ┌──────────────────────────┐
   │ • Check OTP matches      │
   │ • Check not expired      │
   │ • Mark email verified    │
   │ • Generate JWT token     │
   └──────────────────────────┘
              ↓
   
9. SENDS WELCOME EMAIL
   ┌──────────────────────────────────────┐
   │ Subject: Welcome to M&M Healthcare!  │
   │                                      │
   │ Your email has been verified! 🎉     │
   │                                      │
   │ What you can do now:                 │
   │ 🩺 AI-Powered Symptom Analysis       │
   │ 🔒 Secure Health Records             │
   └──────────────────────────────────────┘
              ↓
   
10. USER LOGGED IN
   ┌──────────────────────────┐
   │ ✅ Email Verified        │
   │ ✅ JWT Token Saved       │
   │ ✅ Redirect to Dashboard │
   └──────────────────────────┘
```

---

## Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                           LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. USER ENTERS CREDENTIALS
   ┌──────────────────────────┐
   │ Email: john@example.com  │
   │ Password: Test1234       │
   │ [x] Remember me          │
   └──────────────────────────┘
              ↓
   
2. SENDS TO BACKEND
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "Test1234"
   }
              ↓
   
3. BACKEND VALIDATES
   ┌──────────────────────────┐
   │ • Find user by email     │
   │ • Compare password hash  │
   │ • Check email verified   │
   └──────────────────────────┘
              ↓
         ┌────┴────┐
         │         │
    VERIFIED   NOT VERIFIED
         │         │
         ↓         ↓
   
4a. IF VERIFIED              4b. IF NOT VERIFIED
   ┌──────────────────┐         ┌──────────────────┐
   │ • Generate JWT   │         │ • Generate OTP   │
   │ • Update login   │         │ • Send email     │
   │ • Return token   │         │ • Show OTP form  │
   └──────────────────┘         └──────────────────┘
         ↓                            ↓
   ┌──────────────────┐         (Go to step 6 of
   │ ✅ Logged In     │          Registration Flow)
   │ Redirect to App  │
   └──────────────────┘
```

---

## Password Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PASSWORD VALIDATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

USER TYPES: "t"
   ↓
┌──────────────────────────┐
│ ⭕ At least 8 characters │  ← Gray circle (not met)
│ ⭕ One uppercase letter  │
│ ⭕ One lowercase letter  │
│ ✅ One number            │
└──────────────────────────┘

USER TYPES: "Test"
   ↓
┌──────────────────────────┐
│ ⭕ At least 8 characters │
│ ✅ One uppercase letter  │  ← Green checkmark (met)
│ ✅ One lowercase letter  │
│ ⭕ One number            │
└──────────────────────────┘

USER TYPES: "Test1234"
   ↓
┌──────────────────────────┐
│ ✅ At least 8 characters │  ← All requirements met!
│ ✅ One uppercase letter  │
│ ✅ One lowercase letter  │
│ ✅ One number            │
└──────────────────────────┘
   ↓
[Create Account] button ENABLED
```

---

## OTP Input Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        OTP INPUT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

INITIAL STATE
┌───┬───┬───┬───┬───┬───┐
│ _ │   │   │   │   │   │  ← Cursor in first box
└───┴───┴───┴───┴───┴───┘

USER TYPES "1"
┌───┬───┬───┬───┬───┬───┐
│ 1 │ _ │   │   │   │   │  ← Auto-focus next box
└───┴───┴───┴───┴───┴───┘

USER TYPES "2"
┌───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ _ │   │   │   │  ← Auto-focus next box
└───┴───┴───┴───┴───┴───┘

USER TYPES "3456"
┌───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │  ← All filled!
└───┴───┴───┴───┴───┴───┘
   ↓
[Verify Email] button ENABLED

PASTE SUPPORT
User pastes "123456"
   ↓
┌───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │  ← Auto-fills all boxes
└───┴───┴───┴───┴───┴───┘
```

---

## Database Storage Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STORAGE FLOW                       │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION
   ↓
MongoDB Document Created:
┌─────────────────────────────────────┐
│ {                                   │
│   _id: "507f1f77bcf86cd799439011"  │
│   name: "John Doe",                 │
│   email: "john@example.com",        │
│   password: "$2a$10$hashed...",     │  ← Hashed, not plain text!
│   isEmailVerified: false,           │
│   emailVerificationOTP: "123456",   │
│   otpExpiry: "2025-10-08T02:00:00", │
│   preferences: {                    │
│     language: "en",                 │
│     voiceEnabled: true,             │
│     notifications: true             │
│   },                                │
│   createdAt: "2025-10-08T01:50:00"  │
│ }                                   │
└─────────────────────────────────────┘
   ↓
OTP VERIFICATION
   ↓
Document Updated:
┌─────────────────────────────────────┐
│ {                                   │
│   ...                               │
│   isEmailVerified: true,            │  ← Changed to true
│   emailVerificationOTP: null,       │  ← Cleared
│   otpExpiry: null,                  │  ← Cleared
│   lastLogin: "2025-10-08T01:55:00"  │  ← Added
│ }                                   │
└─────────────────────────────────────┘
```

---

## Email Service Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       EMAIL SERVICE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. BACKEND CALLS EMAIL SERVICE
   sendOTPEmail("john@example.com", "123456", "John Doe")
              ↓
   
2. CREATE NODEMAILER TRANSPORTER
   ┌──────────────────────────┐
   │ Service: Gmail           │
   │ User: your@gmail.com     │
   │ Pass: app_password       │
   └──────────────────────────┘
              ↓
   
3. BUILD HTML EMAIL
   ┌─────────────────────────────────────┐
   │ <!DOCTYPE html>                     │
   │ <html>                              │
   │   <body>                            │
   │     <div class="header">            │
   │       🏥 M&M Healthcare             │
   │     </div>                          │
   │     <div class="otp-box">           │
   │       123456                        │
   │     </div>                          │
   │   </body>                           │
   │ </html>                             │
   └─────────────────────────────────────┘
              ↓
   
4. SEND VIA GMAIL SMTP
   ┌──────────────────────────┐
   │ smtp.gmail.com:587       │
   │ TLS Encryption           │
   └──────────────────────────┘
              ↓
   
5. EMAIL DELIVERED
   ┌─────────────────────────────────────┐
   │ 📧 Inbox: john@example.com          │
   │                                     │
   │ From: M&M Healthcare                │
   │ Subject: Verify Your Email          │
   │                                     │
   │ Your code: 123456                   │
   └─────────────────────────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         SECURITY FLOW                            │
└─────────────────────────────────────────────────────────────────┘

PASSWORD HASHING
Plain: "Test1234"
   ↓
bcrypt.hash(password, 10)
   ↓
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
   ↓
Stored in MongoDB (never plain text!)

JWT TOKEN GENERATION
User verified
   ↓
jwt.sign({ userId: "507f..." }, SECRET, { expiresIn: '7d' })
   ↓
Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ↓
Sent to frontend
   ↓
Stored in localStorage
   ↓
Sent with every API request:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OTP EXPIRATION
OTP Generated: 01:50:00
   ↓
Expiry Set: 02:00:00 (10 minutes later)
   ↓
User tries at 02:05:00
   ↓
if (now > otpExpiry) {
  return "OTP expired"
}
```

---

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FRONTEND   │◄───────►│   BACKEND    │◄───────►│   MONGODB    │
│  (React +    │  HTTP   │  (Express +  │  Mongoose│  (Database)  │
│   Vite)      │  REST   │   Node.js)   │         │              │
│              │   API   │              │         │              │
│ Port: 5173   │         │  Port: 5000  │         │ Port: 27017  │
└──────────────┘         └──────┬───────┘         └──────────────┘
                                │
                                │ Nodemailer
                                ↓
                         ┌──────────────┐
                         │  GMAIL SMTP  │
                         │              │
                         │ Sends OTP &  │
                         │ Welcome      │
                         │ Emails       │
                         └──────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

SCENARIO 1: Email Already Exists
   ↓
Backend checks: User.findOne({ email })
   ↓
Found existing user
   ↓
Return: { success: false, message: "Email already registered" }
   ↓
Frontend shows error message in red box

SCENARIO 2: Invalid OTP
   ↓
User enters: "999999"
   ↓
Backend checks: user.emailVerificationOTP === "123456"
   ↓
Doesn't match
   ↓
Return: { success: false, message: "Invalid or expired OTP" }
   ↓
Frontend shows error, clears OTP inputs

SCENARIO 3: Expired OTP
   ↓
User enters OTP after 15 minutes
   ↓
Backend checks: new Date() > user.otpExpiry
   ↓
Expired
   ↓
Return: { success: false, message: "Invalid or expired OTP" }
   ↓
Frontend shows "Resend Code" button
```

This visual guide helps understand the complete authentication flow!
