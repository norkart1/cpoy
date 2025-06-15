import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const groupName = searchParams.get('groupName');
    const participantIds = searchParams.get('participantIds')?.split(',').filter(id => id) || [];

    if (!groupName || !participantIds.length) {
      return NextResponse.json(
        { success: false, message: 'Missing groupName or participantIds' },
        { status: 400 }
      );
    }

    // Count contestants from the same group in the participantIds list
    const count = await Contestant.countDocuments({
      groupName,
      _id: { $in: participantIds },
    });

    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error('Error counting team participants:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to count team participants' },
      { status: 500 }
    );
  }
}