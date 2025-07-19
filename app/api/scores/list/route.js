import mongoose from 'mongoose';
import Score from '@/models/score'; // Adjusted path relative to app/api/scores/list
import Contestant from '@/models/Contestant'; // Adjusted path
import Item from '@/models/Item'; // Adjusted path
import  connectDB  from '@/lib/dbConnect'; // Adjusted path
import { NextResponse } from 'next/server';

// Log registered models for debugging
console.log('Registered Mongoose models:', Object.keys(mongoose.models));

export async function GET(request) {
  try {
    await connectDB();

    // Fetch all scores with populated contestant details
    const scores = await Score.find()
      .populate({
        path: 'contestant',
        select: 'contestantNumber codeLetter teamName',
      })
      .sort({ createdAt: -1 }) // Sort scores by createdAt descending
      .lean();

    // Group scores by itemName and category
    const groupedScores = scores.reduce((acc, score) => {
      const { contestant } = score;
      if (!contestant) return acc; // Skip if contestant is missing

      const itemName = score.itemName || 'Unknown Item';
      const category = score.category || 'N/A';
      const key = `${itemName}_${category}`; // Composite key

      if (!acc[key]) {
        acc[key] = {
          itemName,
          category,
          type: score.type || 'N/A',
          stage: score.stage || 'N/A',
          scores: [],
        };
      }

      acc[key].scores.push({
        contestantId: contestant._id,
        contestantNumber: contestant.contestantNumber || 'N/A',
        codeLetter: contestant.codeLetter || 'N/A',
        teamName: contestant.teamName || score.teamName || 'N/A',
        score: score.score,
        rank: score.rank || 'N/A',
        category: score.category || 'N/A',
        createdAt: score.createdAt,
      });

      return acc;
    }, {});

    // Sort scores within each item-category pair by createdAt descending
    Object.keys(groupedScores).forEach((key) => {
      groupedScores[key].scores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    // Sort items by itemName, then category
    const sortedScores = Object.keys(groupedScores)
      .sort((a, b) => {
        const [itemNameA, categoryA] = a.split('_');
        const [itemNameB, categoryB] = b.split('_');
        return itemNameA.localeCompare(itemNameB) || categoryA.localeCompare(categoryB);
      })
      .reduce((acc, key) => {
        acc[key] = groupedScores[key];
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