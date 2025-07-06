import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    // Define points based on rank and type
    const pointsMap = {
      A: { '1st': 5, '2nd': 3, '3rd': 1 },
      B: { '1st': 15, '2nd': 10, '3rd': 5 },
    };

    // Build the aggregation pipeline
    const pipeline = [
      // Match only documents with a rank (exclude unranked)
      { $match: { rank: { $in: ['1st', '2nd', '3rd'] } } },
      // Project to calculate points based on rank and type
      {
        $project: {
          teamName: 1,
          points: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$type', 'A'] },
                  then: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$rank', '1st'] }, then: pointsMap.A['1st'] },
                        { case: { $eq: ['$rank', '2nd'] }, then: pointsMap.A['2nd'] },
                        { case: { $eq: ['$rank', '3rd'] }, then: pointsMap.A['3rd'] },
                      ],
                      default: 0,
                    },
                  },
                },
                {
                  case: { $eq: ['$type', 'B'] },
                  then: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$rank', '1st'] }, then: pointsMap.B['1st'] },
                        { case: { $eq: ['$rank', '2nd'] }, then: pointsMap.B['2nd'] },
                        { case: { $eq: ['$rank', '3rd'] }, then: pointsMap.B['3rd'] },
                      ],
                      default: 0,
                    },
                  },
                },
              ],
              default: 0,
            },
          },
        },
      },
      // Group by teamName to sum points
      {
        $group: {
          _id: '$teamName',
          totalPoints: { $sum: '$points' },
        },
      },
      // Project to rename _id to teamName
      {
        $project: {
          teamName: '$_id',
          totalPoints: 1,
          _id: 0,
        },
      },
      // Sort by totalPoints in descending order
      { $sort: { totalPoints: -1 } },
    ];

    const scores = await Score.aggregate(pipeline);

    console.log('Calculated team scores:', scores);

    return NextResponse.json(
      { success: true, scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching team scores:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, message: 'Server error fetching team scores', error: error.message },
      { status: 500 }
    );
  }
}