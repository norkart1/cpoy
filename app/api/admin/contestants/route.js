// app/api/admin/contestants/route.js (or route.ts)

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';

export async function GET() {
  try {
    await connectToDatabase();
    const contestants = await Contestant.find({});
    return NextResponse.json({ success: true, contestants });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
