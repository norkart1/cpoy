// app/api/admin/juries/assign/route.js
import  connectDB  from '@/lib/dbConnect';
import Jury from '@/models/Jury';
import Item from '@/models/Item';

export async function POST(req) {
  try {
    await connectDB();

    const { itemId, juryId } = await req.json();

    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ success: false, message: 'Item not found.' }), { status: 404 });
    }

    const jury = await Jury.findById(juryId);
    if (!jury) {
      return new Response(JSON.stringify({ success: false, message: 'Jury not found.' }), { status: 404 });
    }

    // If jury already has assigned items, remove previous
    if (jury.assignedItems.length > 0) {
      const previousItemId = jury.assignedItems[0];
      jury.assignedItems = [];
      await jury.save();

      // Clear jury from previously assigned item
      await Item.findByIdAndUpdate(previousItemId, { jury: null });
    }

    // Assign the new item
    item.jury = juryId;
    await item.save();

    // Update jury's assignedItems
    jury.assignedItems.push(itemId);
    await jury.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('[POST /api/admin/juries/assign] Error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error assigning jury.' }), { status: 500 });
  }
}
