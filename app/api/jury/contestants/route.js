import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import Item from '@/models/Item';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const juryId = searchParams.get('juryId');

    console.log('Received juryId:', juryId); // Debugging

    // Validate juryId
    if (!juryId || !mongoose.isValidObjectId(juryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing juryId' },
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

    // Fetch items with populated participants
    const items = await Item.find({ _id: { $in: jury.assignedItems } })
      .select('_id name') // Only fetch item _id and name
      .populate({
        path: 'participants',
        select: '_id name contestantNumber groupName', // Include groupName
      });

    // Map contestants with item details
    const contestants = items.flatMap((item) =>
      (item.participants || []).map((participant) => ({
        _id: participant._id,
        name: participant.name || 'Unknown',
        contestantNumber: participant.contestantNumber || 'N/A',
        groupName: participant.groupName || 'N/A',
        itemId: item._id,
        itemName: item.name || 'Unknown Competition',
      }))
    );

    console.log('Processed contestants:', contestants); // Debugging

    return NextResponse.json({ success: true, contestants }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contestants:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching contestants' },
      { status: 500 }
    );
  }
}
