// app/api/admin/items/add/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbConnect';
import Item from '@/models/Item';

export async function POST(req) {
  await connectToDatabase(); // now logs "MongoDB connected..."

  const body = await req.json();
  const { name, category, type, stage } = body;

  if (!name || !category || !type || !stage) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const existingItem = await Item.findOne({
      name: name.toLowerCase(),
      category: category.toLowerCase(),
    });

    if (existingItem) {
      return NextResponse.json({ success: false, message: 'Item already exists in this category.' }, { status: 409 });
    }

    const newItem = new Item({
      name: name.toLowerCase(),
      category: category.toLowerCase(),
      type,
      stage,
    });

    await newItem.save();

    return NextResponse.json({ success: true, message: 'Item added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('❌ Error adding item:', error);
    return NextResponse.json({ success: false, message: 'Server error while adding item.' }, { status: 500 });
  }
}
