import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id, contestantId } = await params; // ✅ Await params to resolve id and contestantId

  await dbConnect();

  if (!id || !contestantId) {
    return NextResponse.json({ success: false, message: 'Missing id or contestantId' }, { status: 400 });
  }

  try {
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    item.participants = item.participants.filter(
      participantId => participantId.toString() !== contestantId
    );

    await item.save();

    return NextResponse.json({ success: true, message: 'Contestant deleted successfully' });
  } catch (error) {
    console.error('Error deleting contestant:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}