import dbConnect from '@/lib/dbConnect'; // your db connection util
import Contestant from '@/models/Contestant'; // your mongoose model
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  console.log('DB connected');

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  console.log('Search query:', q);

  if (!q) {
    console.log('Empty query, returning empty array');
    return NextResponse.json([], { status: 200 });
  }

  try {
    const safeQuery = escapeRegex(q);
    const regex = new RegExp(safeQuery, 'i');
    console.log('Regex created:', regex);

    const contestants = await Contestant.find({
      $or: [
        { name: { $regex: regex } },
        { groupName: { $regex: regex } },
        { contestantNumber: { $regex: regex } },
      ],
    })
      .limit(10)
      .select('name contestantNumber groupName')
      .lean();

    console.log('Found contestants:', contestants.length);
    return NextResponse.json(contestants);
  } catch (error) {
    console.error('Error searching contestants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
