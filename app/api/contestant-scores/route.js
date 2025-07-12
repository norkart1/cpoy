import dbConnect from '@/lib/dbConnect';
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

    // Fetch scores with item lookup and filter for published items
    const scores = await Score.aggregate([
      {
        $match: { contestant: contestant._id },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'itemDetails',
        },
      },
      {
        $unwind: '$itemDetails',
      },
      {
        $match: { 'itemDetails.published': true },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'item',
        },
      },
      {
        $unwind: '$item',
      },
      {
        $project: {
          item: { name: '$item.name', stage: '$item.stage' },
          rank: 1,
          category: 1,
          teamName: 1,
          contestant: 1,
        },
      },
    ]).lean();

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