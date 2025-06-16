import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';
import connectToDatabase from '@/lib/dbConnect';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ success: false, message: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const { groupName } = await params;

    if (!groupName) {
      return NextResponse.json(
        { success: false, message: 'Group name is required.' },
        { status: 400 }
      );
    }

    // Fetch contestants in the group
    const contestants = await Contestant.find({ groupName })
      .select('_id name contestantNumber category')
      .lean();

    if (!contestants.length) {
      return NextResponse.json(
        { success: false, message: 'No contestants found for this group.' },
        { status: 404 }
      );
    }

    const contestantIds = contestants.map((c) => c._id);

    // Fetch items where any contestant from the group is registered
    const items = await Item.find({ participants: { $in: contestantIds } })
      .select('_id name category stage participants')
      .lean();

    // Enrich items with participant details
    const enrichedItems = items.map((item) => ({
      ...item,
      participants: contestants.filter((c) => item.participants
        .map((pid) => pid.toString())
        .includes(c._id.toString())),
    }));

    return NextResponse.json({
      success: true,
      data: {
        groupName,
        contestants,
        items: enrichedItems,
      },
    });
  } catch (error) {
    console.error('Error fetching group details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch group details.' },
      { status: 500 }
    );
  }
}
