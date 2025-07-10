import dbConnect from '@/lib/dbConnect'; // Ensure connection
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Ensure database connection is established
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const contestantNumber = searchParams.get('contestantNumber');

    if (!contestantNumber) {
      return NextResponse.json(
        { success: false, message: 'Missing contestantNumber' },
        { status: 400 }
      );
    }

    // Find the contestant by contestantNumber
    const contestant = await Contestant.findOne({ contestantNumber }).lean();
    if (!contestant) {
      return NextResponse.json(
        { success: false, message: 'Contestant not found' },
        { status: 404 }
      );
    }

    console.log('Contestant ID:', contestant._id); // Debug: Log the contestant _id

    // Debug: Check if Score model is defined
    if (!Score || !Score.find) {
      console.error('Score model is not defined or initialized:', Score);
      throw new Error('Score model is not available');
    }

    // Fetch scores for the contestant using contestant._id
    const scores = await Score.find({ contestant: contestant._id })
      .populate('item', 'name stage')
      .lean();

    console.log('Fetched scores:', scores); // Debug: Log the results

    return NextResponse.json(
      { success: true, scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching contestant scores:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching contestant scores', error: error.message },
      { status: 500 }
    );
  }
}