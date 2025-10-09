import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';
import { 
  registerValidation, 
  loginValidation, 
  otpValidation, 
  validate 
} from '../middleware/validators.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register', registerValidation, validate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      isEmailVerified: false
    });
    
    // Generate OTP
    const otp = user.generateOTP();
    await user.save();
    
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name);
    
    if (!emailResult.success) {
      // Delete user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email. Please try again.' 
      });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Please check your email for the verification code.',
      data: {
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

// Verify OTP
router.post('/verify-otp', otpValidation, validate, async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already verified' 
      });
    }
    
    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }
    
    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.otpExpiry = null;
    await user.save();
    
    // Send welcome email
    await sendWelcomeEmail(email, user.name);
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location,
      preferences: user.preferences,
      healthDetails: user.healthDetails,
      isEmailVerified: user.isEmailVerified,
      loginTime: new Date().toISOString()
    };
    
    res.json({ 
      success: true, 
      message: 'Email verified successfully!',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already verified' 
      });
    }
    
    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();
    
    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification email. Please try again.' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Verification code sent successfully!' 
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resend code. Please try again.' 
    });
  }
});

// Login
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate new OTP
      const otp = user.generateOTP();
      await user.save();
      
      // Send OTP email
      await sendOTPEmail(email, otp, user.name);
      
      return res.status(403).json({ 
        success: false, 
        message: 'Email not verified. A new verification code has been sent to your email.',
        requiresVerification: true,
        email: user.email
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Check if user has completed health profile
    const hasCompletedHealthProfile = user.healthDetails && 
      Object.keys(user.healthDetails).length > 0 &&
      user.healthDetails.height &&
      user.healthDetails.weight &&
      user.healthDetails.bloodGroup;
    
    // Return user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location,
      preferences: user.preferences,
      healthDetails: user.healthDetails,
      isEmailVerified: user.isEmailVerified,
      hasCompletedHealthProfile: hasCompletedHealthProfile,
      loginTime: new Date().toISOString()
    };
    
    res.json({ 
      success: true, 
      message: 'Login successful!',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

// Get current user (protected route) - updated to include health details check
router.get('/me', authenticate, async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      phone: req.user.phone,
      location: req.user.location,
      preferences: req.user.preferences,
      healthDetails: req.user.healthDetails,
      isEmailVerified: req.user.isEmailVerified,
      hasCompletedHealthProfile: !!req.user.healthDetails && 
        Object.keys(req.user.healthDetails).length > 0 &&
        req.user.healthDetails.height &&
        req.user.healthDetails.weight &&
        req.user.healthDetails.bloodGroup
    };
    
    res.json({ 
      success: true, 
      data: userData 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user data' 
    });
  }
});

// Update user profile (protected route)
router.put('/profile', authenticate, async (req, res) => {
  try {
    console.log('Profile update request received:', req.body);
    console.log('Authenticated user:', req.user);
    const allowedUpdates = ['name', 'phone', 'location', 'avatar', 'preferences', 'healthDetails'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    console.log('Updates to apply:', updates);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Updated user:', user);
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
router.options('/cors-test', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

router.get('/cors-test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

export default router;
