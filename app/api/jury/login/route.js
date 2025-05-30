import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import bcrypt from 'bcryptjs'; // Use bcryptjs for Next.js compatibility

export async function POST(req) {
  try {
    await dbConnect();

    const { username, password } = await req.json();
    console.log('Received login data:', { username, password: '***' }); // Debug: Mask password

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const jury = await Jury.findOne({ username }).select('_id username password'); // Fixed: Removed extra parenthesis
    if (!jury) {
      console.log('Jury not found for username:', username); // Debugging
      return NextResponse.json(
        { success: false, message: 'Invalid username.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, jury.password);
    if (!isMatch) {
      console.log('Password mismatch for username:', username); // Debugging
      return NextResponse.json(
        { success: false, message: 'Invalid password.' },
        { status: 401 }
      );
    }

    const juryData = {
      _id: jury._id.toString(), // Convert ObjectId to string
      username: jury.username,
    };

    console.log('Login successful, returning:', juryData); // Debugging

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        jury: juryData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json(
      { success: false, message: 'Login failed.' },
      { status: 500 }
    );
  }
}
