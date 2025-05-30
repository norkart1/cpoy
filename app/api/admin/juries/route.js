import dbConnect from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { username, password } = await request.json();

  try {
    const existing = await Jury.findOne({ username });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
    }

    const newJury = new Jury({ username, password });
    await newJury.save();

    return NextResponse.json({ success: true, jury: newJury });
  } catch (err) {
    console.error('Error creating jury:', err);
    return NextResponse.json({ success: false, message: 'Error creating jury' }, { status: 500 });
  }
}


export async function GET() {
  await dbConnect();

  try {
    const juries = await Jury.find();
    console
    return NextResponse.json({ success: true, juries });
  } catch (err) {
    console.error('Error fetching juries:', err);
    return NextResponse.json({ success: false, message: 'Error fetching juries' }, { status: 500 });
  }
}
