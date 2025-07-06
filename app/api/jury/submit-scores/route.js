import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import Item from '@/models/Item';
import Score from '@/models/score';
import Contestant from '@/models/Contestant';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();

    const { juryId, scores } = await req.json();

    console.log('Received juryId:', juryId, 'Scores:', scores);

    // Validate juryId
    if (!juryId || !mongoose.isValidObjectId(juryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing juryId' },
        { status: 400 }
      );
    }

    // Validate scores
    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No scores provided' },
        { status: 400 }
      );
    }

    // Fetch jury
    const jury = await Jury.findById(juryId).select('assignedItems');
    if (!jury) {
      return NextResponse.json(
        { success: false, message: 'Jury not found' },
        { status: 404 }
      );
    }

    console.log('Jury assignedItems:', jury.assignedItems);

    // Validate assignedItems
    if (!jury.assignedItems || jury.assignedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items assigned to this jury' },
        { status: 400 }
      );
    }

    // Fetch items with populated participants
    const items = await Item.find({ _id: { $in: jury.assignedItems } })
      .select('_id name category participants')
      .populate({
        path: 'participants',
        select: '_id groupName',
      });

    console.log('Fetched items:', items.map(item => ({
      _id: item._id,
      name: item.name,
      category: item.category,
      participants: item.participants.map(p => p._id.toString()),
    })));

    // Create a map of contestant IDs to item, itemName, category, and teamName
    const contestantMap = new Map();
    items.forEach((item) => {
      (item.participants || []).forEach((participant) => {
        contestantMap.set(participant._id.toString(), {
          itemId: item._id,
          itemName: item.name || 'Unknown Competition',
          category: item.category || 'N/A',
          teamName: participant.groupName || 'N/A',
        });
      });
    });

    console.log('Contestant Map:', Array.from(contestantMap.entries()));

    // Validate scores and prepare score documents
    const scoreDocs = [];
    for (const [contestantId, score] of Object.entries(scores)) {
      // Validate contestantId
      if (!mongoose.isValidObjectId(contestantId)) {
        return NextResponse.json(
          { success: false, message: `Invalid contestant ID: ${contestantId}` },
          { status: 400 }
        );
      }

      // Check if contestant is assigned to jury
      if (!contestantMap.has(contestantId)) {
        return NextResponse.json(
          { success: false, message: `Contestant ${contestantId} not assigned to this jury` },
          { status: 400 }
        );
      }

      // Validate score
      const scoreNum = Number(score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 50) {
        return NextResponse.json(
          { success: false, message: `Invalid score for contestant ${contestantId}: ${score}` },
          { status: 400 }
        );
      }

      const { itemId, itemName, category, teamName } = contestantMap.get(contestantId);
      scoreDocs.push({
        jury: juryId,
        contestant: contestantId,
        item: itemId,
        score: scoreNum,
        teamName,
        itemName,
        category,
      });
    }

    // Check for existing scores to prevent duplicates
    const existingScores = await Score.find({
      jury: juryId,
      contestant: { $in: scoreDocs.map((doc) => doc.contestant) },
      item: { $in: scoreDocs.map((doc) => doc.item) },
    });

    if (existingScores.length > 0) {
      const duplicateContestants = existingScores.map((s) => s.contestant.toString());
      return NextResponse.json(
        {
          success: false,
          message: `Scores already submitted for contestants: ${duplicateContestants.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Save scores
    await Score.insertMany(scoreDocs);

    return NextResponse.json(
      { success: true, message: 'Scores submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting scores:', error.name, error.message, error.stack);
    return NextResponse.json(
      { success: false, message: 'Server error submitting scores', error: error.message },
      { status: 500 }
    );
  }
}