import dbConnect from '@/lib/dbConnect';
import Score from '@/models/score';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    // Build the aggregation pipeline
    const pipeline = [
      // Group by item to count occurrences and capture itemName
      {
        $group: {
          _id: '$item', // Group by item (ObjectId)
          count: { $sum: 1 }, // Count occurrences
          itemName: { $first: '$itemName' }, // Capture itemName
        },
      },
      // Match items with count greater than 3
      {
        $match: {
          count: { $gt: 3 },
        },
      },
      // Project to format output
      {
        $project: {
          itemId: '$_id', // Rename _id to itemId
          itemName: 1,
          count: 1,
          _id: 0, // Exclude _id
        },
      },
      // Sort by count in descending order
      {
        $sort: {
          count: -1,
        },
      },
    ];

    const repeatedItems = await Score.aggregate(pipeline);

    console.log('Items repeated more than three times:', repeatedItems);

    if (repeatedItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items found with more than three occurrences' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: repeatedItems },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching repeated items:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json(
      { success: false, message: 'Server error fetching repeated items', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}