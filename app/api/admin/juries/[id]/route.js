import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    await Jury.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Jury deleted successfully' });
  } catch (err) {
    console.error('Error deleting jury:', err);
    return NextResponse.json({ success: false, message: 'Error deleting jury' }, { status: 500 });
  }
}
