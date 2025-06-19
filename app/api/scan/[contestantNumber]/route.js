import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { contestantNumber } = await params;

  await dbConnect();
  console.log('contestantNumber:', contestantNumber); // Debug

  if (!contestantNumber) {
    return NextResponse.json({ success: false, message: 'Missing contestantNumber' }, { status: 400 });
  }

  try {
    // Fetch contestant by contestantNumber
    const contestant = await Contestant.findOne({ contestantNumber })
      .select('contestantNumber name')
      .lean();

    if (!contestant) {
      return NextResponse.json({ success: false, message: 'Contestant not found' }, { status: 404 });
    }

    // Fetch items where contestant is a participant
    const items = await Item.find({ participants: contestant._id })
      .select('name date day timeRange stage category')
      .lean();

    return NextResponse.json({
      success: true,
      contestant: {
        contestantNumber: contestant.contestantNumber,
        name: contestant.name || 'Unknown',
      },
      items: items.map((item) => ({
        name: item.name,
        date: item.date,
        day: item.day,
        timeRange: item.timeRange || { start: '', end: '' },
        stage: item.stage,
        category: item.category,
      })),
    });
  } catch (error) {
    console.error('Error fetching contestant data:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}