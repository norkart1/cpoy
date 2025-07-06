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

    // Fetch items with populated participants and additional fields
    const items = await Item.find({ _id: { $in: jury.assignedItems } })
      .select('_id name category participants type stage')
      .populate({
        path: 'participants',
        select: '_id groupName',
      });

    console.log('Fetched items:', items.map(item => ({
      _id: item._id,
      name: item.name,
      category: item.category,
      type: item.type,
      stage: item.stage,
      participants: item.participants.map(p => p._id.toString()),
    })));

    // Create a map of contestant IDs to item details
    const contestantMap = new Map();
    items.forEach((item) => {
      (item.participants || []).forEach((participant) => {
        contestantMap.set(participant._id.toString(), {
          itemId: item._id,
          itemName: item.name || 'Unknown Competition',
          category: item.category || 'N/A',
          teamName: participant.groupName || 'N/A',
          type: item.type || 'A',
          stage: item.stage || 'stage',
        });
      });
    });

    console.log('Contestant Map:', Array.from(contestantMap.entries()));

    // Convert scores to array and sort
    const sortedScores = Object.entries(scores)
      .map(([contestantId, score]) => ({ contestantId, score: Number(score) }))
      .sort((a, b) => b.score - a.score);

    console.log('Sorted Scores:', sortedScores);

    // Get total number of contestants with scores
    const totalContestants = sortedScores.length;

    // Validate scores and prepare score documents with ranks
    const scoreDocs = [];
    sortedScores.forEach((entry, index) => {
      const { contestantId, score } = entry;

      // Validate contestantId
      if (!mongoose.isValidObjectId(contestantId)) {
        return NextResponse.json(
          { success: false, message: `Invalid contestant ID: ${contestantId}` },
          { status: 400 }
        );
      }

      // Check if contestant is assigned to jury
      if (!contestantMap.has(contestantId)) {
        console.log(`Contestant ${contestantId} not found in contestantMap`);
        return;
      }

      // Validate score
      const scoreNum = Number(score);
      if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100) {
        return NextResponse.json(
          { success: false, message: `Invalid score for contestant ${contestantId}: ${score}, must be between 1 and 100` },
          { status: 400 }
        );
      }

      const { itemId, itemName, category, teamName, type, stage } = contestantMap.get(contestantId);
      // Assign rank based on position, capped at "2nd" if only two contestants
      const rank = totalContestants <= 2
        ? index < totalContestants ? ['1st', '2nd'][index] : null
        : index < 3 ? ['1st', '2nd', '3rd'][index] : String(index + 1);
      if (rank) {
        scoreDocs.push({
          jury: juryId,
          contestant: contestantId,
          item: itemId,
          score: scoreNum,
          teamName,
          itemName,
          category,
          type,
          stage,
          rank,
        });
      }
    });

    console.log('Score Docs:', scoreDocs);

    // Update or insert scores
    const operations = scoreDocs.map(async (doc) => {
      const existingScore = await Score.findOne({
        jury: doc.jury,
        contestant: doc.contestant,
        item: doc.item,
      });

      if (existingScore) {
        // Update existing score
        return Score.findOneAndUpdate(
          { jury: doc.jury, contestant: doc.contestant, item: doc.item },
          { $set: { score: doc.score, type: doc.type, stage: doc.stage, rank: doc.rank, createdAt: new Date() } },
          { new: true }
        );
      } else {
        // Insert new score
        return Score.create(doc);
      }
    });

    await Promise.all(operations);

    // Fetch contestant numbers for rankings
    const contestantIds = scoreDocs.map(doc => doc.contestant);
    const contestantsData = await Contestant.find({ _id: { $in: contestantIds } }).select('contestantNumber name');
    console.log('Contestants Data:', contestantsData); // Debug log
    const contestantNumberMap = new Map(contestantsData.map(c => [c._id.toString(), { number: c.contestantNumber, name: c.name }]));

    // Prepare rankings data to pass to the frontend
    const rankings = scoreDocs.map((doc) => {
      const contestantData = contestantNumberMap.get(doc.contestant.toString()) || { number: 'N/A', name: 'Unknown Contestant' };
      return {
        contestantId: doc.contestant,
        name: contestantData.name,
        contestantNumber: contestantData.number,
        teamName: doc.teamName,
        itemName: doc.itemName,
        category: doc.category,
        totalScore: doc.score,
        rank: doc.rank,
      };
    });

    console.log('Rankings:', rankings);

    return NextResponse.json(
      { success: true, message: 'Scores submitted successfully', rankings },
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