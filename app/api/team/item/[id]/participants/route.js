import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';
import Contestant from '@/models/Contestant';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  console.log('Session:', { user: session?.user }); // Debug: Inspect session

  if (!session || !session.user?.teamName) {
    return NextResponse.json({ success: false, message: 'Unauthorized or missing teamName' }, { status: 401 });
  }

  await dbConnect();
  console.log('itemId:', id, 'teamName:', session.user.teamName); // Debug

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
  }

  try {
    const item = await Item.findById(id)
      .populate({
        path: 'participants',
        match: { groupName: session.user.teamName },
        select: 'name groupName category type stage',
      })
      .lean();

    console.log('Item:', { id, name: item?.name, participants: item?.participants }); // Debug

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      itemName: item.name,
      participants: item.participants || [],
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}