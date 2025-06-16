import { NextResponse } from 'next/server'; // Updated to NextResponse
import connectToDatabase from '@/lib/dbConnect'; // Fixed import
import Item from '@/models/Item';
import Jury from '@/models/Jury';

export async function POST(req) {
  try {
    await connectToDatabase(); // Use connectToDatabase
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ success: false, message: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { itemId, juryId } = body;

    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found.' }, { status: 404 });
    }

    const jury = await Jury.findById(juryId);
    if (!jury) {
      return NextResponse.json({ success: false, message: 'Jury not found.' }, { status: 404 });
    }

    // Remove previous item from jury
    if (jury.assignedItems.length > 0) {
      const oldItemId = jury.assignedItems[0];
      jury.assignedItems = [];
      await jury.save();
      await Item.findByIdAndUpdate(oldItemId, { jury: null });
    }

    // Assign new jury to item
    item.jury = juryId;
    await item.save();

    // Add item to jury
    jury.assignedItems.push(itemId);
    await jury.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assign Jury Error:", error);
    return NextResponse.json({ success: false, message: 'Error assigning jury.' }, { status: 500 });
  }
}