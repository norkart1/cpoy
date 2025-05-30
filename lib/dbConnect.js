import mongoose from 'mongoose';

let isConnected = false;

export default async function connectToDatabase() {
  if (isConnected) return;

  try {
    console.log("called")
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB connected...');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
