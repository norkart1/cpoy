// import dbConnect from '@/lib/dbConnect';
// import Contestant from '@/models/Contestant';
// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const contestantNumber = searchParams.get('contestantNumber');

//     if (!contestantNumber) {
//       return NextResponse.json(
//         { success: false, message: 'Missing contestantNumber' },
//         { status: 400 }
//       );
//     }

//     const contestant = await Contestant.findOne({ contestantNumber }).lean();
//     if (!contestant) {
//       return NextResponse.json(
//         { success: false, message: 'Contestant not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, contestant },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching contestant:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error fetching contestant', error: error.message },
//       { status: 500 }
//     );
//   }
// }


import dbConnect from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const contestantNumber = searchParams.get('contestantNumber');

    if (!contestantNumber) {
      return NextResponse.json(
        { success: false, message: 'Missing contestantNumber' },
        { status: 400 }
      );
    }

    const contestant = await Contestant.findOne({ contestantNumber }).lean();
    if (!contestant) {
      return NextResponse.json(
        { success: false, message: 'Contestant not found' },
        { status: 404 }
      );
    }

    const scores = contestant.scores || []; // scores is inside the contestant doc

    return NextResponse.json(
      { success: true, contestant, scores },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching contestant:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching contestant', error: error.message },
      { status: 500 }
    );
  }
}
