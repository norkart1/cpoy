import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import Item from '@/models/Item';
import mongoose from 'mongoose';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const juryId = searchParams.get('juryId');

    console.log('Received juryId:', juryId);

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

    console.log('Jury assignedItems:', jury.assignedItems);

    // Check if assignedItems is empty
    if (!jury.assignedItems || jury.assignedItems.length === 0) {
      console.log('No assigned items for jury:', juryId);
      return NextResponse.json(
        { success: true, contestants: [] },
        { status: 200 }
      );
    }

    // Validate ObjectIds in assignedItems
    const validItemIds = jury.assignedItems.filter((id) => mongoose.isValidObjectId(id));
    console.log('Valid Item IDs:', validItemIds);

    if (validItemIds.length === 0) {
      console.log('No valid item IDs found for jury:', juryId);
      return NextResponse.json(
        { success: true, contestants: [] },
        { status: 200 }
      );
    }

    // Log Item and Contestant models
    console.log('Item Model:', mongoose.models.Item);
    console.log('Contestant Model:', mongoose.models.Contestant);

    // Fetch items with populated codeLetter contestantIds
    const items = await Item.find({ _id: { $in: validItemIds } })
      .select('_id name codeLetter')
      .populate({
        path: 'codeLetter.contestantId',
        select: '_id name contestantNumber groupName',
        model: 'Contestant',
      });

    console.log('Fetched Items:', items);

    // Map contestants with item details and codeLetter
    const contestants = items.flatMap((item) =>
      (item.codeLetter || []).map((codeEntry) => ({
        _id: codeEntry.contestantId?._id,
        name: codeEntry.contestantId?.name || 'Unknown',
        contestantNumber: codeEntry.contestantId?.contestantNumber || 'N/A',
        groupName: codeEntry.contestantId?.groupName || 'N/A',
        itemId: item._id,
        itemName: item.name || 'Unknown Competition',
        codeLetter: codeEntry.codeLetter || 'N/A',
      }))
    );

    console.log('Processed contestants:', contestants);

    return NextResponse.json({ success: true, contestants }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contestants:', error.name, error.message, error.stack);
    return NextResponse.json(
      { success: false, message: 'Server error fetching contestants', error: error.message },
      { status: 500 }
    );
  }
}