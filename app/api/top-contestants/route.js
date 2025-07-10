import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const results = await Score.aggregate([
      // Join with Contestant to get category from Contestant schema
      {
        $lookup: {
          from: 'contestant',
          localField: 'contestant',
          foreignField: '_id',
          as: 'contestantDetails',
        },
      },
      { $unwind: '$contestantDetails' },
      // Group by contestant and calculate total points based on Contestant category
      {
        $group: {
          _id: '$contestant',
          contestantNumber: { $first: '$contestantDetails.contestantNumber' },
          name: { $first: '$contestantDetails.name' },
          teamName: { $first: '$teamName' },
          contestantCategory: { $first: '$contestantDetails.category' }, // Category from Contestant
          totalPoints: {
            $sum: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', '1st'] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', '2nd'] },
                      ],
                    },
                    then: 5,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(individual)'] },
                        { $eq: ['$rank', '3rd'] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(group)'] },
                        { $eq: ['$rank', '1st'] },
                      ],
                    },
                    then: 15,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(group)'] },
                        { $eq: ['$rank', '2nd'] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [
                        { $eq: ['$category', 'general(group)'] },
                        { $eq: ['$rank', '3rd'] },
                      ],
                    },
                    then: 5,
                  },
                  { case: { $eq: ['$rank', '1st'] }, then: 5 },
                  { case: { $eq: ['$rank', '2nd'] }, then: 3 },
                  { case: { $eq: ['$rank', '3rd'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
      },
      // Filter out contestants with zero total points
      {
        $match: {
          totalPoints: { $ne: 0 },
        },
      },
      // Use facet to get top 5 per category from Contestant
      {
        $facet: {
          subjunior: [
            { $match: { contestantCategory: 'subjunior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
          junior: [
            { $match: { contestantCategory: 'junior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
          senior: [
            { $match: { contestantCategory: 'senior' } },
            { $sort: { totalPoints: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, contestantNumber: 1, name: 1, teamName: 1, score: '$totalPoints' } },
          ],
        },
      },
      {
        $project: {
          subjunior: 1,
          junior: 1,
          senior: 1,
        },
      },
    ]);

    return NextResponse.json(
      { success: true, ...results[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching top contestants:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching top contestants', error: error.message },
      { status: 500 }
    );
  }
}



