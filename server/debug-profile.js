import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const debugProfile = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
    
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      isEmailVerified: true
    });
    
    await testUser.save();
    console.log('Created test user:', testUser._id);
    
    // Generate a valid token
    const token = jwt.sign({ userId: testUser._id.toString() }, process.env.JWT_SECRET);
    console.log('Generated token:', token);
    
    // Try to update the user's profile
    const healthDetails = {
      height: "180",
      weight: "75",
      bloodGroup: "O+"
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      testUser._id,
      { $set: { healthDetails } },
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Updated user:', updatedUser.healthDetails);
    
    // Clean up - delete the test user
    await User.findByIdAndDelete(testUser._id);
    console.log('Cleaned up test user');
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

debugProfile();