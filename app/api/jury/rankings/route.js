import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const juryId = searchParams.get('juryId');

    console.log('Received juryId:', juryId);

    // Validate juryId
    if (!juryId || !mongoose.isValidObjectId(juryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing juryId' },
        { status: 400 }
      );
    }

    // Aggregate scores by contestant
    const rankings = await Score.aggregate([
      // Match scores for the given jury
      { $match: { jury: new mongoose.Types.ObjectId(juryId) } },
      // Group by contestant to sum scores
      {
        $group: {
          _id: '$contestant',
          totalScore: { $sum: '$score' },
          teamName: { $first: '$teamName' },
          itemName: { $first: '$itemName' },
          category: { $first: '$category' },
        },
      },
      // Lookup contestant details
      {
        $lookup: {
          from: 'contestant',
          localField: '_id',
          foreignField: '_id',
          as: 'contestantDetails',
        },
      },
      // Unwind contestant details, preserve null results
      {
        $unwind: {
          path: '$contestantDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Project final fields with rank
      {
        $project: {
          contestantId: '$_id',
          name: {
            $ifNull: ['$contestantDetails.name', 'Unknown Contestant'],
          },
          contestantNumber: {
            $ifNull: ['$contestantDetails.contestantNumber', 'N/A'],
          },
          teamName: { $ifNull: ['$teamName', 'N/A'] },
          itemName: { $ifNull: ['$itemName', 'N/A'] },
          category: { $ifNull: ['$category', 'N/A'] },
          totalScore: 1,
          rank: { $concat: [{ $toString: { $add: [{ $indexOfArray: [ '$$ROOT', '$$CURRENT' ] }, 1] } }] }, // Assign rank based on sort order
        },
      },
      // Sort by totalScore (descending)
      { $sort: { totalScore: -1 } },
      // Update rank to use "1st", "2nd", "3rd" for top 3, then numeric
      {
        $project: {
          contestantId: 1,
          name: 1,
          contestantNumber: 1,
          teamName: 1,
          itemName: 1,
          category: 1,
          totalScore: 1,
          rank: {
            $switch: {
              branches: [
                { case: { $eq: ['$rank', '1'] }, then: '1st' },
                { case: { $eq: ['$rank', '2'] }, then: '2nd' },
                { case: { $eq: ['$rank', '3'] }, then: '3rd' },
              ],
              default: '$rank',
            },
          },
        },
      },
    ]);

    console.log('Rankings:', rankings);

    return NextResponse.json(
      { success: true, rankings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching rankings:', error.name, error.message, error.stack);
    return NextResponse.json(
      { success: false, message: 'Server error fetching rankings', error: error.message },
      { status: 500 }
    );
  }
}