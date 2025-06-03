// import { NextResponse } from 'next/server';

// // Static dummy data to simulate a database
// const contestants = [
//   {
//     _id: '123456789',
//     name: 'Illyas veleri',
//     contestantNumber: 'C001',
//     registeredItems: ['1', '3'],
//   },
//   {
//     _id: '987654321',
//     name: 'Jane Smith',
//     contestantNumber: 'C002',
//     registeredItems: ['2', '5'],
//   },
// ];

// // GET /api/contestants/[id]
// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     // Validate ID
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: 'Contestant ID is required' },
//         { status: 400, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Find contestant
//     const contestant = contestants.find((c) => c._id === id);
//     if (!contestant) {
//       return NextResponse.json(
//         { success: false, message: 'Contestant not found' },
//         { status: 404, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     // Return contestant data
//     return NextResponse.json(
//       { success: true, data: contestant },
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     console.error('API Error:', error.message);
//     return NextResponse.json(
//       { success: false, message: 'Server error' },
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }

import { NextResponse } from 'next/server';

// Static dummy data to simulate a database
const contestants = [
  {
    _id: '123456789',
    name: 'Illyas veleri',
    contestantNumber: 'C001',
    registeredItems: ['1', '3'],
  },
  {
    _id: '987654321',
    name: 'Jane Smith',
    contestantNumber: 'C002',
    registeredItems: ['2', '5'],
  },
];

// GET /api/contestants/[id]
export async function GET(request, { params }) {
  try {
    // Await params to handle dynamic route correctly
    const { id } = await params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Contestant ID is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find contestant
    const contestant = contestants.find((c) => c._id === id);
    if (!contestant) {
      return NextResponse.json(
        { success: false, message: 'Contestant not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return contestant data
    return NextResponse.json(
      { success: true, data: contestant },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
