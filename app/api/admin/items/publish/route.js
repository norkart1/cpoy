import connectToDatabase from '@/lib/dbConnect';
import Item from '@/models/Item';

export async function PATCH(req) {
  try {
    await connectToDatabase();

    const { itemId } = await req.json();
    if (!itemId) {
      return new Response(JSON.stringify({ success: false, message: 'Item ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ success: false, message: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    item.published = !item.published;
    await item.save();

    return new Response(JSON.stringify({ success: true, published: item.published }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating publish status:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}