
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';

export async function POST(request, { params }) {
  try {
    // Await params to handle dynamic route correctly
    const { id } = await params;

    // Parse request body
    const { itemId, isRegistered } = await request.json();
    if (!itemId || typeof isRegistered !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const contestantsCollection = db.collection('contestants');

    // Find contestant
    const contestant = await contestantsCollection.findOne({ _id: id });
    if (!contestant) {
      return NextResponse.json(
        { success: false, message: 'Contestant not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update registeredItems
    let updatedRegisteredItems = contestant.registeredItems || [];
    if (isRegistered) {
      // Remove itemId if registered (unregister)
      updatedRegisteredItems = updatedRegisteredItems.filter((iid) => iid !== itemId);
    } else {
      // Add itemId if not registered (register)
      if (!updatedRegisteredItems.includes(itemId)) {
        updatedRegisteredItems.push(itemId);
      }
    }

    // Update contestant in database
    const updateResult = await contestantsCollection.updateOne(
      { _id: id },
      { $set: { registeredItems: updatedRegisteredItems } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update contestant' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Item registration updated' },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
