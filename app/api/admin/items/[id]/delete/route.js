import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Item from '@/models/Item';

export async function POST(req, { params }) {
  const { id } = params;

  console.log('🟡 Received ID for deletion:', id); // ✅ Check if ID is received

  try {
    await connectToDatabase();
    await Item.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting item:', error); // ✅ Optional: log server errors
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
