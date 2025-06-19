// import mongoose from 'mongoose';
// import { NextResponse } from 'next/server';
// import Item from '@/models/Item';
// import connectToDatabase from '@/lib/dbConnect';

// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     return NextResponse.json({ success: false, message: 'Database connection failed.' }, { status: 500 });
//   }

//   try {
//     console.log('Full params object:', params); // Debug entire params
//     const itemId = params.itemId; // Explicitly destructure
//     console.log('Extracted itemId:', itemId);

//     const { date, day, startTime, endTime } = await req.json();
//     console.log('Request body:', { date, day, startTime, endTime });

//     if (!mongoose.Types.ObjectId.isValid(itemId)) {
//       console.log('Invalid itemId:', itemId);
//       return NextResponse.json({ success: false, message: 'Invalid item ID.' }, { status: 400 });
//     }

//     if (!date || !day || !startTime || !endTime) {
//       return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
//     }

//     const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//     if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
//       return NextResponse.json({ success: false, message: 'Invalid time format. Use HH:mm.' }, { status: 400 });
//     }

//     const updatedItem = await Item.findByIdAndUpdate(
//       itemId,
//       {
//         date: new Date(date),
//         day,
//         timeRange: { start: startTime, end: endTime },
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedItem) {
//       return NextResponse.json({ success: false, message: 'Item not found.' }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Item schedule updated successfully.',
//       data: updatedItem,
//     });
//   } catch (error) {
//     console.error('Update item schedule error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to update item schedule.' },
//       { status: 500 }
//     );
//   }
// }

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Item from '@/models/Item';
import connectToDatabase from '@/lib/dbConnect';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ success: false, message: 'Database connection failed.' }, { status: 500 });
  }

  try {
    const resolvedParams = await params; // Await params Promise
    console.log('Resolved params:', resolvedParams);
    const itemId = resolvedParams.id; // Use id from resolved params
    console.log('Extracted itemId:', itemId);

    const { date, day, startTime, endTime } = await req.json();
    console.log('Request body:', { date, day, startTime, endTime });

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.log('Invalid itemId:', itemId);
      return NextResponse.json({ success: false, message: 'Invalid item ID.' }, { status: 400 });
    }

    if (!date || !day || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ success: false, message: 'Invalid time format. Use HH:mm.' }, { status: 400 });
    }

    const validDays = ['തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി', 'ഞായർ'];
    if (!validDays.includes(day)) {
      console.log('Invalid day:', day);
      return NextResponse.json({ success: false, message: 'Invalid day. Use a valid weekday (e.g., തിങ്കൾ).' }, { status: 400 });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        date: new Date(date),
        day,
        timeRange: { start: startTime, end: endTime },
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ success: false, message: 'Item not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Item schedule updated successfully.',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Update item schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update item schedule.' },
      { status: 500 }
    );
  }
}