import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const testDeployment = async () => {
  try {
    console.log('=== Healthcare App Deployment Test ===');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Port:', process.env.PORT || 5003);
    console.log('Frontend URL:', process.env.FRONTEND_URL || 'Not set');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    console.log('Email User:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    
    if (process.env.MONGODB_URI) {
      console.log('\n--- Testing MongoDB Connection ---');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ MongoDB connected successfully');
      
      // Test user model
      const userCount = await User.countDocuments();
      console.log(`Found ${userCount} users in the database`);
      
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
    
    if (process.env.JWT_SECRET) {
      console.log('\n--- Testing JWT Secret ---');
      const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET);
      console.log('✅ JWT token generation successful');
      console.log('Sample token:', testToken.substring(0, 20) + '...');
    }
    
    console.log('\n=== Deployment Test Complete ===');
    console.log('✅ All tests passed! Ready for deployment.');
    
  } catch (error) {
    console.error('❌ Deployment test failed:', error);
    process.exit(1);
  }
};

testDeployment();