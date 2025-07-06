import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    // Build the aggregation pipeline
    const pipeline = [
      // Match only documents with a rank (exclude unranked)
      { $match: { rank: { $in: ['1st', '2nd', '3rd'] } } },
      // Project to calculate points based on rank and category
      {
        $project: {
          teamName: 1,
          points: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$category', 'general(individual)'] },
                  then: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$rank', '1st'] }, then: 5 },
                        { case: { $eq: ['$rank', '2nd'] }, then: 3 },
                        { case: { $eq: ['$rank', '3rd'] }, then: 1 },
                      ],
                      default: 0,
                    },
                  },
                },
                {
                  case: { $eq: ['$category', 'general(group)'] },
                  then: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$rank', '1st'] }, then: 15 },
                        { case: { $eq: ['$rank', '2nd'] }, then: 10 },
                        { case: { $eq: ['$rank', '3rd'] }, then: 5 },
                      ],
                      default: 0,
                    },
                  },
                },
                // Default case for other categories (subjunior, junior, senior)
                {
                  case: { $ne: ['$category', null] },
                  then: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$rank', '1st'] }, then: 5 },
                        { case: { $eq: ['$rank', '2nd'] }, then: 3 },
                        { case: { $eq: ['$rank', '3rd'] }, then: 1 },
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