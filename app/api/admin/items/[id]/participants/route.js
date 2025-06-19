import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';
import Contestant from '@/models/Contestant'; // Add this import
import { NextResponse } from 'next/server';

// Ensure the Contestant model is registered by importing it
console.log(Contestant); // Optional: Log to confirm the model is loaded

export async function GET(request, { params }) {
  const { id } = await params;

  await dbConnect();
  console.log('itemId:', id);

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
  }

  try {
    const item = await Item.findById(id).populate('participants');

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      itemName: item.name,
      participants: item.participants || [],
    });

  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
// import dbConnect from '@/lib/dbConnect';
// import Item from '@/models/Item';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export async function GET(request, { params }) {
//   const session = await getServerSession(authOptions);
//   console.log("Session:", session);

//   // Use `teamName` because your session has it instead of `groupName`
//   if (!session || !session.user?.teamName) {
//     console.error("Unauthorized: Missing session or teamName");
//     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//   }

//   const { id } = params;

//   if (!id) {
//     return NextResponse.json({ success: false, message: 'Missing itemId' }, { status: 400 });
//   }

//   await dbConnect();

//   try {
//     const item = await Item.findById(id).populate({
//       path: 'participants',
//       match: { groupName: session.user.teamName }, // Match against teamName from session
//     });

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





// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Item from '@/models/Item';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// export const dynamic = 'force-dynamic';

// export async function GET(request, context) {
//   const params = await context.params;
//   const { id } = params;

//   const session = await getServerSession(authOptions);
//   console.log('Session:', session); // Debug: Inspect session

//   // Check if user is admin (adjust based on your authOptions)
//   if (!session || session.user?.role !== 'admin') {
//     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const item = await Item.findById(id)
//       .populate('participants') // Fetch all participants, no groupName filter
//       .lean();

//     console.log('Item:', { id, name: item?.name, participants: item?.participants }); // Debug

//     if (!item) {
//       return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       itemName: item.name,
//       participants: item.participants || [],
//     });
//   } catch (error) {
//     console.error('Error fetching participants:', error);
//     return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
//   }
// }

// import dbConnect from '@/lib/dbConnect';
// import Item from '@/models/Item';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export async function GET(request, context) {
//   const params = await context.params; // ✅ await it to prevent warning
//   const { id } = params;

//   const session = await getServerSession(authOptions);
//   if (!session || !session.user?.teamName) {
//     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//   }

//   await dbConnect();

//   try {
//     const item = await Item.findById(id).populate({
//       path: 'participants',
//       match: { groupName: session.user.teamName },
//     });

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
