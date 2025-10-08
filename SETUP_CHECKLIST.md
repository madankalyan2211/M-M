# ✅ Setup Checklist

Follow this checklist step-by-step to get your healthcare app running.

---

## 📝 Pre-Setup (5 minutes)

### 1. Install Prerequisites

- [ ] **Node.js installed** (v18 or higher)
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **MongoDB installed** OR **MongoDB Atlas account created**
  
  **Option A - Local MongoDB (macOS):**
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  mongosh  # Test connection
  ```
  
  **Option B - MongoDB Atlas (Cloud):**
  - [ ] Go to https://www.mongodb.com/cloud/atlas
  - [ ] Create free account
  - [ ] Create cluster
  - [ ] Get connection string

- [ ] **Gmail App Password generated**
  - [ ] Go to https://myaccount.google.com/security
  - [ ] Enable 2-Step Verification
  - [ ] Go to App Passwords
  - [ ] Generate password for "Mail"
  - [ ] Copy 16-character password (e.g., `abcd efgh ijkl mnop`)

---

## 🔧 Backend Setup (3 minutes)

### 2. Install Backend Dependencies

- [ ] Open terminal
- [ ] Navigate to server folder:
  ```bash
  cd "Healthcare App Design 4/server"
  ```
- [ ] Install dependencies:
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete

### 3. Configure Backend Environment

- [ ] Create `.env` file:
  ```bash
  cp .env.example .env
  ```
- [ ] Open `server/.env` in text editor
- [ ] Fill in these values:

  ```env
  # MongoDB (choose one)
  MONGODB_URI=mongodb://localhost:27017/healthcare_app
  # OR for Atlas:
  # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_app
  
  # JWT Secret (any random string)
  JWT_SECRET=my_super_secret_key_change_this_12345
  
  # Gmail credentials
  EMAIL_USER=your_email@gmail.com
  EMAIL_APP_PASSWORD=your_16_char_app_password_here
  
  # Server config (leave as is)
  PORT=5000
  NODE_ENV=development
  FRONTEND_URL=http://localhost:5173
  ```

- [ ] Save the file

### 4. Start Backend Server

- [ ] Run development server:
  ```bash
  npm run dev
  ```
- [ ] Verify you see:
  ```
  ✅ MongoDB connected successfully
  🚀 Server running on port 5000
  📧 Email service configured with: your_email@gmail.com
  ```
- [ ] **Keep this terminal open!**

---

## 💻 Frontend Setup (2 minutes)

### 5. Install Frontend Dependencies

- [ ] Open **NEW terminal** window
- [ ] Navigate to project root:
  ```bash
  cd "Healthcare App Design 4"
  ```
- [ ] Install dependencies:
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete

### 6. Configure Frontend Environment

- [ ] Create `.env` file:
  ```bash
  cp .env.example .env
  ```
- [ ] Open `.env` in text editor
- [ ] Add this line:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Save the file

### 7. Start Frontend Server

- [ ] Run development server:
  ```bash
  npm run dev
  ```
- [ ] Verify you see:
  ```
  VITE vX.X.X  ready in XXX ms
  
  ➜  Local:   http://localhost:5173/
  ```
- [ ] **Keep this terminal open too!**

---

## 🧪 Test the Application (2 minutes)

### 8. Test Registration Flow

- [ ] Open browser to http://localhost:5173
- [ ] You should see the M&M Healthcare login page
- [ ] Click **"Sign Up"** tab
- [ ] Fill in the form:
  - [ ] **Name**: Test User
  - [ ] **Email**: your_actual_email@gmail.com (use real email!)
  - [ ] **Password**: Test1234
  - [ ] **Confirm Password**: Test1234
- [ ] Verify password requirements show green checkmarks:
  - [ ] ✅ At least 8 characters
  - [ ] ✅ One uppercase letter
  - [ ] ✅ One lowercase letter
  - [ ] ✅ One number
- [ ] Click **"Create Account"**
- [ ] You should see success message and OTP screen

### 9. Verify Email

- [ ] Check your email inbox
- [ ] Look for email from "M&M Healthcare"
- [ ] Subject: "Verify Your Email - M&M Healthcare"
- [ ] Copy the 6-digit code (e.g., 123456)
- [ ] Go back to browser
- [ ] Enter the code in the 6 input boxes
- [ ] Click **"Verify Email"**
- [ ] You should see success message
- [ ] Check email again for welcome email
- [ ] You should be automatically logged in!

### 10. Test Login Flow

- [ ] Refresh the page (to logout)
- [ ] Click **"Sign In"** tab
- [ ] Enter your email and password
- [ ] Click **"Sign In"**
- [ ] You should be logged in successfully!

---

## ✅ Verification Checklist

### Backend is working if:
- [ ] Terminal shows "MongoDB connected successfully"
- [ ] Terminal shows "Server running on port 5000"
- [ ] No error messages in terminal
- [ ] Can access http://localhost:5000/api/health in browser

### Frontend is working if:
- [ ] Can open http://localhost:5173
- [ ] See M&M Healthcare login page
- [ ] No console errors (press F12 → Console tab)
- [ ] Animations are smooth

### Email is working if:
- [ ] Received OTP email within 1 minute
- [ ] Email has 6-digit code
- [ ] Email looks professional with M&M branding
- [ ] Received welcome email after verification

### Database is working if:
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] User data persists after server restart
- [ ] MongoDB shows "healthcare_app" database

---

## 🐛 Troubleshooting

### ❌ "Email not sending"
- [ ] Check `EMAIL_USER` in `server/.env` is correct
- [ ] Check `EMAIL_APP_PASSWORD` is the 16-char app password (not your Gmail password)
- [ ] Verify 2-Step Verification is enabled on Google account
- [ ] Check spam/junk folder
- [ ] Check server terminal for email errors

### ❌ "MongoDB connection error"
- [ ] If using local MongoDB:
  - [ ] Run `mongosh` to verify MongoDB is running
  - [ ] Run `brew services start mongodb-community` if not running
- [ ] If using Atlas:
  - [ ] Check connection string is correct
  - [ ] Verify username/password in connection string
  - [ ] Check IP whitelist in Atlas (add 0.0.0.0/0 for testing)

### ❌ "Port already in use"
- [ ] Find process using port:
  ```bash
  lsof -i :5000
  ```
- [ ] Kill the process:
  ```bash
  kill -9 <PID>
  ```
- [ ] Or change `PORT=5001` in `server/.env`

### ❌ "CORS error"
- [ ] Verify backend is running on port 5000
- [ ] Verify frontend is running on port 5173
- [ ] Check `FRONTEND_URL` in `server/.env` matches frontend URL

### ❌ "Module not found" errors
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` again

---

## 🎉 Success Indicators

You've successfully set up the app if:

- [x] Backend server running without errors
- [x] Frontend accessible at http://localhost:5173
- [x] Can register new account
- [x] Receive OTP email
- [x] Can verify email with OTP
- [x] Receive welcome email
- [x] Can login with verified account
- [x] User data saved in MongoDB

---

## 📊 Final Status Check

Run these commands to verify everything:

```bash
# Check Node.js version
node --version

# Check if MongoDB is running (local)
mongosh

# Check backend is running
curl http://localhost:5000/api/health

# Check frontend is running
curl http://localhost:5173
```

---

## 🚀 You're Done!

If all checkboxes are checked, your healthcare app is fully functional!

### What you can do now:
- ✅ Register users with email verification
- ✅ Login with verified accounts
- ✅ Store user data in MongoDB
- ✅ Send professional emails via Gmail
- ✅ Enforce strong password requirements

### Next Steps:
1. Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) to understand the code
2. Read [AUTHENTICATION_FLOW.md](AUTHENTICATION_FLOW.md) to see visual diagrams
3. Customize the app for your needs
4. Deploy to production (see SETUP_GUIDE.md)

---

**Congratulations! 🎉 Your healthcare app is ready!**
