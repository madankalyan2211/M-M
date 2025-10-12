import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const healthDetailsSchema = new mongoose.Schema({
  height: {
    type: String,
    required: [true, 'Height is required']
  },
  weight: {
    type: String,
    required: [true, 'Weight is required']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required']
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required']
  },
  allergies: {
    type: String,
    default: ''
  },
  chronicConditions: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  preferredUnits: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric'
  }
}, { _id: false });

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
  hasCompletedProfile: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookups
userSchema.index({ email: 1 });

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

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;