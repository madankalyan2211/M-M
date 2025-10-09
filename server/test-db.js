import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
    
    // Test finding a user
    const User = (await import('./models/User.js')).default;
    const users = await User.find({}).limit(5);
    console.log('Found users:', users.length);
    
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testDB();