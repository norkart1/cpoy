// app/api/admin/items/add-contestant/route.js
import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item'; // Your Item mongoose model
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { itemId, contestantId } = await request.json();

    console.log('Received POST to add contestant');
    console.log('itemId:', itemId);
    console.log('contestantId:', contestantId);

    if (!itemId || !contestantId) {
      console.warn('Missing itemId or contestantId');
      return NextResponse.json({ success: false, message: 'Missing itemId or contestantId' }, { status: 400 });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      console.warn('Item not found for itemId:', itemId);
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    // Use correct field: participants
    if (!item.participants) {
      item.participants = [];
    }

    if (item.participants.includes(contestantId)) {
      console.log('Contestant already exists in participants:', contestantId);
      return NextResponse.json({ success: false, message: 'Contestant already added' }, { status: 400 });
    }

    item.participants.push(contestantId);
    await item.save();

    console.log('Contestant added successfully:', contestantId);
    return NextResponse.json({ success: true, message: 'Contestant added successfully' });
  } catch (error) {
    console.error('Error adding contestant:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
