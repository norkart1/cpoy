import * as xlsx from 'xlsx';
import { NextResponse } from 'next/server';
import Contestant from '@/models/Contestant';
import connectToDatabase from '@/lib/dbConnect';

export const config = {
  api: {
    bodyParser: false, // Keep this false for manual parsing
  },
};

export async function POST(req) {
  try {
    await connectToDatabase();

    // Parse multipart form data using native Request.formData()
    const formData = await req.formData();

    // Get the file (assuming field name is 'file')
    const file = formData.get('file');

    if (file && file instanceof Blob) {
      // Read file buffer from Blob
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Read Excel data from buffer directly
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const contestants = xlsx.utils.sheet_to_json(worksheet, {
        header: ['contestantNumber', 'name', 'groupName', 'category'], // Added category
        defval: '',
      });

      for (const data of contestants) {
        const { contestantNumber, name, groupName, category } = data;

        if (!contestantNumber || contestantNumber === 'contestantNumber') continue;

        // Validate category
        if (!['subjunior', 'junior', 'senior'].includes(category)) {
          return NextResponse.json(
            { success: false, message: `Invalid category: ${category}. Must be subjunior, junior, or senior.` },
            { status: 400 }
          );
        }

        await Contestant.create({ contestantNumber, name, groupName, category });
      }

      return NextResponse.json({ success: true, message: 'Contestants uploaded from Excel successfully' });
    } else {
      // Manual form submission
      const contestantNumber = formData.get('contestantNumber');
      const name = formData.get('name');
      const groupName = formData.get('groupName');
      const category = formData.get('category');

      if (!contestantNumber || !name || !groupName || !category) {
        return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
      }

      // Validate category
      if (!['subjunior', 'junior', 'senior'].includes(category)) {
        return NextResponse.json(
          { success: false, message: `Invalid category: ${category}. Must be subjunior, junior, or senior.` },
          { status: 400 }
        );
      }

      await Contestant.create({ contestantNumber, name, groupName, category });

      return NextResponse.json({ success: true, message: 'Contestant uploaded successfully' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}