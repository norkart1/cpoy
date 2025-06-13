import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Item from '@/models/Item';
import connectToDatabase from '@/lib/dbConnect';

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { programId, action } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(programId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid contestant or program ID' },
        { status: 400 }
      );
    }

    const item = await Item.findById(programId);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Program not found' },
        { status: 404 }
      );
    }

    if (action === 'add') {
      if (!item.participants.includes(id)) {
        item.participants.push(id);
        await item.save();
      }
    } else if (action === 'remove') {
      item.participants = item.participants.filter(pid => pid.toString() !== id);
      await item.save();
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Program updated successfully' });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update program' },
      { status: 500 }
    );
  }
}