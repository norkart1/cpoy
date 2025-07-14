import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const juryId = searchParams.get('juryId');
    const contestantId = searchParams.get('contestantId');

    console.log('Fetching scores for:', { juryId, contestantId });

    if (!juryId && !contestantId) {
      return NextResponse.json(
        { success: false, message: 'Missing juryId or contestantId' },
        { status: 400 }
      );
    }

    if (juryId && !mongoose.isValidObjectId(juryId)) {
      return NextResponse.json(
        { success: false, message: `Invalid juryId: ${juryId}` },
        { status: 400 }
      );
    }
    if (contestantId && !mongoose.isValidObjectId(contestantId)) {
      return NextResponse.json(
        { success: false, message: `Invalid contestantId: ${contestantId}` },
        { status: 400 }
      );
    }

    const query = {};
    if (juryId) query.jury = juryId;
    if (contestantId) query.contestant = contestantId;

    const scores = await Score.find(query)
      .select('contestant score rank itemName category stage teamName')
      .sort({ score: -1 })
      .lean();

    if (!scores.length) {
      return NextResponse.json(
        { success: false, message: `No scores found for contestantId: ${contestantId || 'none'}` },
        { status: 404 }
      );
    }

    // Filter for only First, Second, and Third ranks (assuming "Tired" was a typo for "Third")
    const validRanks = ['First', 'Second', 'Third'];
    const filteredScores = scores.filter((score) =>
      score.rank && validRanks.includes(score.rank)
    );

    // Calculate points based on category and rank
    const formattedScores = filteredScores.map((score) => {
      let calculatedScore = 0;

      if (score.category === 'general(individual)') {
        if (score.rank === 'First') calculatedScore = 8;
        else if (score.rank === 'Second') calculatedScore = 5;
        else if (score.rank === 'Third') calculatedScore = 3;
      } else if (score.category !== 'general(group)') {
        if (score.rank === 'First') calculatedScore = 5;
        else if (score.rank === 'Second') calculatedScore = 3;
        else if (score.rank === 'Third') calculatedScore = 1;
      } else {
        calculatedScore = 0; // Set to 0 for general(group)
      }

      return {
        _id: score._id.toString(),
        contestant: score.contestant.toString(),
        score: score.score,
        rank: score.rank,
        itemName: score.itemName,
        category: score.category,
        stage: score.stage,
        teamName: score.teamName,
        calculatedScore,
      };
    });

    console.log('Fetched scores:', formattedScores);

    return NextResponse.json({ success: true, scores: formattedScores }, { status: 200 });
  } catch (error) {
    console.error('Error fetching scores:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      contestantId: searchParams.get('contestantId'),
    });
    return NextResponse.json(
      { success: false, message: 'Server error fetching scores', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}