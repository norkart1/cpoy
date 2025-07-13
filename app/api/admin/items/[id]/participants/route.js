// import dbConnect from '@/lib/dbConnect';
// import Item from '@/models/Item';
// import Contestant from '@/models/Contestant'; // Add this import
// import { NextResponse } from 'next/server';

// // Ensure the Contestant model is registered by importing it
// console.log(Contestant); // Optional: Log to confirm the model is loaded

// export async function GET(request, { params }) {
//   const { id } = await params;

//   await dbConnect();
//   console.log('itemId:', id);

//   if (!id) {
//     return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
//   }

//   try {
//     const item = await Item.findById(id).populate('participants');

//     if (!item) {
//       return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       itemName: item.name,
//       participants: item.participants || [],
//     });

//   } catch (error) {
//     console.error('Error fetching participants:', error);
//     return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
//   }
// }

import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params; // Await params to fix error

  await dbConnect();
  console.log('itemId:', id);

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
  }

  try {
    const item = await Item.findById(id)
      .populate({
        path: 'participants',
        select: 'contestantNumber name groupName category',
      })
      .select('name codeLetter')
      .lean();

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    // Map codeLetter to participants
    const participants = item.participants.map((p) => {
      const codeLetterEntry = item.codeLetter?.find((cl) =>
        cl.contestantId.toString() === p._id.toString()
      );
      return {
        _id: p._id,
        contestantNumber: p.contestantNumber || 'N/A',
        name: p.name || 'Unknown',
        groupName: p.groupName || 'N/A',
        category: p.category || 'Unknown',
        codeLetter: codeLetterEntry ? codeLetterEntry.codeLetter : 'N/A',
      };
    });

    return NextResponse.json({
      success: true,
      itemName: item.name,
      participants,
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}