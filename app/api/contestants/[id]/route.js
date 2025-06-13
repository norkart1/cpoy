import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Contestant from '@/models/Contestant';
import connectToDatabase from '@/lib/dbConnect';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contestant ID' },
        { status: 400 }
      );
    }

    const contestant = await Contestant.findById(id).lean();
    if (!contestant) {
      return NextResponse.json(
        { success: false, message: 'Contestant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contestant });
  } catch (error) {
    console.error('Error fetching contestant:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contestant' },
      { status: 500 }
    );
  }
}