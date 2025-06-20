// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Contestant from '@/models/Contestant';
// import Item from '@/models/Item';

// export async function GET(request, { params }) {
//   await dbConnect();
//   const { id } = await params; // Await params to resolve dynamic route parameters

//   try {
//     // Fetch contestant by ID, select only contestantNumber
//     const contestant = await Contestant.findById(id).select('contestantNumber').lean();
//     if (!contestant) {
//       return NextResponse.json({ message: 'Contestant not found' }, { status: 404 });
//     }

//     // Fetch programs where contestant is a participant
//     const programs = await Item.find({ participants: id })
//       .select('name date day timeRange stage category')
//       .lean();

//     // Format response to match HallTicket component expectations
//     const response = {
//       contestant: {
//         contestantNumber: contestant.contestantNumber,
//       },
//       programs: programs.map((program) => ({
//         name: program.name,
//         date: program.date,
//         day: program.day,
//         timeRange: program.timeRange || { start: '', end: '' },
//         stage: program.stage,
//         category: program.category,
//       })),
//     };

//     return NextResponse.json(response, { status: 200 });
//   } catch (err) {
//     console.error('Error fetching hall ticket:', err);
//     return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    // Fetch contestant by ID, select contestantNumber, name, groupName
    const contestant = await Contestant.findById(id)
      .select('contestantNumber name groupName')
      .lean();
    if (!contestant) {
      return NextResponse.json({ message: 'Contestant not found' }, { status: 404 });
    }

    // Fetch programs where contestant is a participant
    const programs = await Item.find({ participants: id })
      .select('name date day timeRange stage category')
      .lean();

    // Format response to match HallTicket component expectations
    const response = {
      contestant: {
        contestantNumber: contestant.contestantNumber || 'N/A',
        name: contestant.name || 'Unknown',
        groupName: contestant.groupName || 'N/A',
      },
      programs: programs.map((program) => ({
        name: program.name,
        date: program.date,
        day: program.day,
        timeRange: program.timeRange || { start: '', end: '' },
        stage: program.stage,
        category: program.category,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Error fetching hall ticket:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}