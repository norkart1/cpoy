import { connectDB } from '@/lib/dbConnect';
import Item from '@/models/Item';
import Jury from '@/models/Jury';

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { itemId, juryId } = body;

    const item = await Item.findById(itemId);
    if (!item) {
      return Response.json({ success: false, message: 'Item not found.' }, { status: 404 });
    }

    const jury = await Jury.findById(juryId);
    if (!jury) {
      return Response.json({ success: false, message: 'Jury not found.' }, { status: 404 });
    }

    // If jury already has an assigned item, remove previous assignment
    if (jury.assignedItems.length > 0) {
      const existingItemId = jury.assignedItems[0];
      jury.assignedItems = [];
      await jury.save();
      await Item.findByIdAndUpdate(existingItemId, { jury: null });
    }

    // Assign new jury to the item
    item.jury = juryId;
    await item.save();

    jury.assignedItems.push(itemId);
    await jury.save();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error assigning jury:', error);
    return Response.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
