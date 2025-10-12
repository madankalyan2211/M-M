import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Save health details
router.post('/health-details', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const healthDetails = req.body;

    // Update user with health details
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        healthDetails,
        hasCompletedProfile: true 
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health details saved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedProfile: user.hasCompletedProfile
      }
    });
  } catch (error) {
    console.error('Error saving health details:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving health details',
      error: error.message
    });
  }
});

// Check if user has completed profile
router.get('/check-profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('hasCompletedProfile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      hasCompletedProfile: user.hasCompletedProfile || false
    });
  } catch (error) {
    console.error('Error checking profile status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking profile status',
      error: error.message
    });
  }
});

export default router;
