import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';

export async function POST(req, { params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await connectToDatabase();
    await Contestant.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Contestant deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
