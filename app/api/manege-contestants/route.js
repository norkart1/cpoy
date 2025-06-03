import mongoose from 'mongoose';
import Contestant from '../../../models/Contestant'; // Adjust path based on your project structure

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// API Route Handler
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const groupName = searchParams.get('groupName');
    
    const query = groupName ? { groupName: { $regex: groupName, $options: 'i' } } : {};
    const contestants = await Contestant.find(query).lean();
    
    return new Response(JSON.stringify({
      success: true,
      data: contestants,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching contestants:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch contestants',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}