import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const testToken = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
    
    // Find an existing user or create a test user
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('Creating test user...');
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        isEmailVerified: true
      });
      await user.save();
    }
    
    console.log('User ID:', user._id);
    
    // Generate a valid token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET);
    console.log('Generated valid token:', token);
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testToken();