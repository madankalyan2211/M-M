# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js installed (v18+)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Gmail account with App Password

---

## 1️⃣ Setup Gmail App Password (5 minutes)

1. Go to https://myaccount.google.com/
2. Click **Security** → Enable **2-Step Verification**
3. Search "App passwords" → Click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Name: "Healthcare App" → Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

---

## 2️⃣ Install MongoDB (Choose One)

### Option A: Local MongoDB (macOS)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Option B: MongoDB Atlas (Cloud - Easier)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster
3. Get connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/healthcare_app`)

---

## 3️⃣ Backend Setup (3 minutes)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `server/.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/healthcare_app
JWT_SECRET=my_super_secret_key_12345
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Start backend:**
```bash
npm run dev
```

✅ You should see: `✅ MongoDB connected successfully` and `🚀 Server running on port 5000`

---

## 4️⃣ Frontend Setup (2 minutes)

**Open NEW terminal:**

```bash
# Go to project root
cd "Healthcare App Design 4"

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```

✅ Open http://localhost:5173

---

## 5️⃣ Test It! (2 minutes)

1. Click **"Sign Up"**
2. Fill in:
   - Name: Test User
   - Email: your_email@gmail.com
   - Password: Test1234
   - Confirm: Test1234
3. Click **"Create Account"**
4. **Check your email** for 6-digit code
5. Enter code → Click **"Verify Email"**
6. ✅ You're in!

---

## 🎯 What You Get

✅ Email verification with OTP  
✅ Strong password validation (8+ chars, uppercase, lowercase, number)  
✅ User data saved in MongoDB  
✅ Secure JWT authentication  
✅ Beautiful, responsive UI  

---

## 🐛 Common Issues

**Email not sending?**
- Check Gmail App Password is correct
- Check spam folder
- Verify 2-Step Verification is enabled

**MongoDB error?**
- Run `mongosh` to verify MongoDB is running
- Or use MongoDB Atlas connection string

**Port in use?**
- Change `PORT=5001` in server/.env

---

## 📁 Project Structure

```
Healthcare App Design 4/
├── server/                    # Backend
│   ├── models/User.js        # User schema
│   ├── routes/auth.js        # Auth endpoints
│   ├── utils/emailService.js # Email sending
│   ├── server.js             # Main server
│   └── .env                  # Backend config
├── src/
│   ├── components/
│   │   └── LoginPage.tsx     # Login/Register/OTP UI
│   └── services/
│       └── api.ts            # API client
└── .env                      # Frontend config
```

---

## 🎉 That's It!

Your healthcare app is now running with:
- ✅ Email verification
- ✅ OTP authentication
- ✅ Strong passwords
- ✅ MongoDB storage

For detailed documentation, see **SETUP_GUIDE.md**
