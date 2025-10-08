import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const healthDetailsSchema = new mongoose.Schema({
  height: String,
  weight: String,
  bloodGroup: String,
  dateOfBirth: String,
  gender: String,
  allergies: String,
  chronicConditions: String,
  emergencyContact: String,
  preferredUnits: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric'
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  avatar: String,
  phone: String,
  location: String,
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    voiceEnabled: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  healthDetails: healthDetailsSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.emailVerificationOTP || !this.otpExpiry) {
    return false;
  }
  
  if (new Date() > this.otpExpiry) {
    return false;
  }
  
  return this.emailVerificationOTP === otp;
};

const User = mongoose.model('User', userSchema);

export default User;
