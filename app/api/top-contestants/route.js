
import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const results = await Score.aggregate([
      // Step 1: Filter ranked documents, exclude general(group)
      {
        $match: {
          rank: { $in: ['First', 'Second', 'Third'] },
          category: { $ne: 'general(group)' }, // Exclude general(group) scores
        },
      },
      // Debug: Log matched scores
      {
        $addFields: {
          debugMatch: {
            contestant: '$contestant',
            rank: '$rank',
            category: '$category',
            teamName: '$teamName',
          },
        },
      },
      // Step 2: Join with Contestant
      {
        $lookup: {
          from: 'contestant',
          localField: 'contestant',
          foreignField: '_id',
          as: 'contestantDetails',
        },
      },
      // Debug: Log lookup results
      {
        $addFields: {
          hasContestant: { $gt: [{ $size: '$contestantDetails' }, 0] },
          debugLookup: {
            contestantId: '$contestant',
            contestantDetails: '$contestantDetails',
          },
        },
      },
      // Step 3: Filter documents with valid contestant details
      {
        $match: {
          hasContestant: true,
        },
      },
      // Step 4: Unwind contestantDetails
      { $unwind: '$contestantDetails' },
      // Step 5: Normalize category to lowercase
      {
        $addFields: {
          contestantCategory: { $toLower: '$contestantDetails.category' },
        },
      },
      // Debug: Log after unwind
      {
        $addFields: {
          debugUnwind: {
            contestantId: '$contestant',
            contestantCategory: '$contestantCategory',
            name: '$contestantDetails.name',
          },
        },
      },
      // Step 6: Group by contestant and calculate total points
      {
        $group: {
          _id: '$contestant',
          contestantNumber: { $first: '$contestantDetails.contestantNumber' },
          name: { $first: '$contestantDetails.name' },
          teamName: { $first: '$teamName' },
          contestantCategory: { $first: '$contestantCategory' },
          totalPoints: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', 'First'] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', 'Second'] },
                      ],
                    },
                    then: 5,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', 'Third'] },
                      ],
                    },
                    then: 2,
                  },
                  { case: { $eq: ['$rank', 'First'] }, then: 5 },
                  { case: { $eq: ['$rank', 'Second'] }, then: 3 },
                  { case: { $eq: ['$rank', 'Third'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
      },
      // Step 7: Filter non-zero points
      {
        $match: {
          totalPoints: { $ne: 0 },
        },
      },
      // Debug: Log grouped results
      {
        $addFields: {
          debugGroup: {
            _id: '$_id',
            contestantNumber: '$contestantNumber',
            name: '$name',
            teamName: '$teamName',
            contestantCategory: '$contestantCategory',
            totalPoints: '$totalPoints',
          },
        },
      },
      // Step 8: Facet by category
      {
        $facet: {
          subjunior: [
            { $match: { contestantCategory: 'subjunior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 3 }, // Limit to top 3
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
          junior: [
            { $match: { contestantCategory: 'junior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 3 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
          senior: [
            { $match: { contestantCategory: 'senior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 3 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
          generalIndividual: [
            { $match: { contestantCategory: { $in: ['subjunior', 'junior', 'senior'] } } },
            { $sort: { totalPoints: -1 } },
            { $limit: 3 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
        },
      },
      {
        $project: {
          subjunior: 1,
          junior: 1,
          senior: 1,
          generalIndividual: 1,
        },
      },
    ]);

    console.log('Aggregation results:', JSON.stringify(results[0], null, 2));

    if (
      !results[0].subjunior.length &&
      !results[0].junior.length &&
      !results[0].senior.length &&
      !results[0].generalIndividual.length
    ) {
      const debugCounts = await Score.aggregate([
        { $match: { rank: { $in: ['First', 'Second', 'Third'] }, category: { $ne: 'general(group)' } } },
        { $group: { _id: null, rankedCount: { $sum: 1 } } },
        { $lookup: { from: 'contestant', localField: 'contestant', foreignField: '_id', as: 'contestantDetails' } },
        { $match: { contestantDetails: { $ne: [] } } },
        { $group: { _id: null, matchedContestantCount: { $sum: 1 } } },
      ]);
      console.log('Debug counts:', debugCounts);
      return NextResponse.json(
        {
          success: false,
          message: 'No ranked contestants found',
          subjunior: [],
          junior: [],
          senior: [],
          generalIndividual: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ...results[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching top contestants:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, message: 'Server error fetching top contestants', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}