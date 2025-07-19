// import dbConnect from '@/lib/dbConnect';
// import Score from '@/models/score';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     await dbConnect();

//     // Build the aggregation pipeline
//     const pipeline = [
//       // Match only documents with a rank (exclude unranked)
//       { $match: { rank: { $in: ['1st', '2nd', '3rd'] } } },
//       // Project to calculate points based on rank and category
//       {
//         $project: {
//           teamName: 1,
//           points: {
//             $switch: {
//               branches: [
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(individual)'] }, { $eq: ['$rank', '1st'] }] },
//                   then: 8,
//                 },
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(individual)'] }, { $eq: ['$rank', '2nd'] }] },
//                   then: 5,
//                 },
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(individual)'] }, { $eq: ['$rank', '3rd'] }] },
//                   then: 2,
//                 },
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(group)'] }, { $eq: ['$rank', '1st'] }] },
//                   then: 15,
//                 },
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(group)'] }, { $eq: ['$rank', '2nd'] }] },
//                   then: 10,
//                 },
//                 {
//                   case: { $and: [{ $eq: ['$category', 'general(group)'] }, { $eq: ['$rank', '3rd'] }] },
//                   then: 5,
//                 },
//                 {
//                   case: { $eq: ['$rank', '1st'] },
//                   then: 5,
//                 },
//                 {
//                   case: { $eq: ['$rank', '2nd'] },
//                   then: 3,
//                 },
//                 {
//                   case: { $eq: ['$rank', '3rd'] },
//                   then: 1,
//                 },
//               ],
//               default: 0,
//             },
//           },
//         },
//       },
//       // Group by teamName to sum points
//       {
//         $group: {
//           _id: '$teamName',
//           totalPoints: { $sum: '$points' },
//         },
//       },
//       // Project to rename _id to teamName
//       {
//         $project: {
//           teamName: '$_id',
//           totalPoints: 1,
//           _id: 0,
//         },
//       },
//       // Sort by totalPoints in descending order
//       { $sort: { totalPoints: -1 } },
//     ];

//     const scores = await Score.aggregate(pipeline);

//     console.log('Calculated team scores:', scores);

//     return NextResponse.json(
//       { success: true, scores },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching team scores:', {
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//     });
//     return NextResponse.json(
//       { success: false, message: 'Server error fetching team scores', error: error.message },
//       { status: 500 }
//     );
//   }
// }
import mongoose from 'mongoose';
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';
import  connectDB  from '@/lib/dbConnect';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    await connectDB();

    // Fetch all scores with populated item and contestant details
    const scores = await Score.find()
      .populate({
        path: 'item',
        select: 'name type stage',
      })
      .populate({
        path: 'contestant',
        select: 'contestantNumber codeLetter teamName',
      })
      .sort({ createdAt: -1 }) // Sort scores by createdAt descending
      .lean();

    // Group scores by itemName (ignoring category)
    const groupedScores = scores.reduce((acc, score) => {
      const { item, contestant } = score;
      if (!item || !contestant) return acc; // Skip if item or contestant is missing

      const itemName = item.name || 'Unknown Item';

      if (!acc[itemName]) {
        acc[itemName] = {
          type: item.type,
          stage: item.stage,
          scores: [],
        };
      }

      acc[itemName].scores.push({
        contestantId: contestant._id,
        contestantNumber: contestant.contestantNumber || 'N/A',
        codeLetter: contestant.codeLetter || 'N/A',
        teamName: contestant.teamName || 'N/A',
        score: score.score,
        rank: score.rank || 'N/A',
        createdAt: score.createdAt,
      });

      return acc;
    }, {});

    // Sort scores within each item by createdAt descending
    Object.keys(groupedScores).forEach((itemName) => {
      groupedScores[itemName].scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    // Sort items by itemName alphabetically
    const sortedScores = Object.keys(groupedScores)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, itemName) => {
        acc[itemName] = groupedScores[itemName];
        return acc;
      }, {});

    // Log for debugging
    console.log('Grouped items:', Object.keys(sortedScores));

    return NextResponse.json({ success: true, data: sortedScores }, { status: 200 });
  } catch (error) {
    console.error('Error fetching scores:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json({ success: false, message: 'Server error fetching scores' }, { status: 500 });
  }
}