import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';
import Contestant from '@/models/Contestant'; // Add this import
import { NextResponse } from 'next/server';

// Ensure the Contestant model is registered by importing it
console.log(Contestant); // Optional: Log to confirm the model is loaded

export async function GET(request, { params }) {
  const { id } = await params;

  await dbConnect();
  console.log('itemId:', id);

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
  }

  try {
    const item = await Item.findById(id).populate('participants');

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item.participants || []);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}