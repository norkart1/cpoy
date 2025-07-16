import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    // Aggregate to get unique itemName and category pairs
    const items = await Score.aggregate([
      {
        $group: {
          _id: { itemName: '$itemName', category: '$category' },
          itemName: { $first: '$itemName' },
          category: { $first: '$category' },
        },
      },
      {
        $project: {
          _id: 0,
          itemName: 1,
          category: 1,
        },
      },
      {
        $sort: { itemName: 1 },
      },
    ]);

    if (!items.length) {
      return NextResponse.json(
        { success: false, message: 'No items found in scores' },
        { status: 404 }
      );
    }

    console.log('Fetched items:', items);

    return NextResponse.json(
      { success: true, items },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching items:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json(
      { success: false, message: 'Server error fetching items', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}