import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Item from '@/models/Item';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all items sorted by name
    const items = await Item.find({}).sort({ name: 1 }).lean();

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export function POST() {
  return NextResponse.json(
    { success: false, message: 'Method Not Allowed' },
    { status: 405 }
  );
}