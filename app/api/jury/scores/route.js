import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import Item from '@/models/Item';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const juryId = searchParams.get('juryId');
  const contestantId = searchParams.get('contestantId');

  try {
    await dbConnect();

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

    // Fetch scores with related item field populated
    const scores = await Score.find(query)
      .populate('item', 'published') // Only get `published` field from item
      .select('contestant score rank itemName category stage teamName item')
      .sort({ score: -1 })
      .lean();

    // Filter out scores where item.published !== true
    const publishedScores = scores.filter((score) => score.item?.published === true);

    if (!publishedScores.length) {
      return NextResponse.json(
        { success: false, message: `No published scores found` },
        { status: 404 }
      );
    }

    // Format output
    const formattedScores = publishedScores.map((score) => ({
      _id: score._id.toString(),
      contestant: score.contestant.toString(),
      score: score.score,
      rank: score.rank || null,
      itemName: score.itemName,
      category: score.category,
      stage: score.stage,
      teamName: score.teamName,
    }));

    console.log('Fetched published scores:', formattedScores);

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
      {
        success: false,
        message: 'Server error fetching scores',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}


