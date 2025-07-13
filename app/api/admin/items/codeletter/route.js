import connectToDatabase from '@/lib/dbConnect';
import Item from '@/models/Item';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { itemId } = await req.json();
    if (!itemId) {
      return new Response(JSON.stringify({ success: false, message: 'Item ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const item = await Item.findById(itemId).populate('participants');
    if (!item) {
      return new Response(JSON.stringify({ success: false, message: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prevent regeneration if already assigned
    if (item.codeLetter && item.codeLetter.length === item.participants.length) {
      return new Response(
        JSON.stringify({ success: false, message: 'Code letters already generated' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Valid single letters: a to x and z (exclude y)
    const singleLetters = 'abcdefghijklmnopqrstuvwxz'.split('');
    const maxSingleLetters = singleLetters.length; // 24 letters

    // Shuffle participants randomly
    const shuffledParticipants = [...item.participants].sort(() => Math.random() - 0.5);

    // Generate code letters
    const codeLetterArray = shuffledParticipants.map((participant, index) => {
      let codeLetter;

      if (index < maxSingleLetters) {
        // Use single letter for the first 24 participants
        codeLetter = singleLetters[index];
      } else {
        // Use two-character codes starting with 'a' for additional participants
        const number = index - maxSingleLetters + 1; // Start with a1 (index 24 -> 1)
        codeLetter = `a${number}`;
      }

      return {
        contestantId: participant._id,
        codeLetter: codeLetter, // Store as lowercase to match schema
      };
    });

    // Store generated letters in the item document
    item.codeLetter = codeLetterArray;
    await item.save();

    // Return uppercase code letters for consistency with UI
    const responseCodeLetters = codeLetterArray.map((entry) => ({
      contestantId: entry.contestantId,
      codeLetter: entry.codeLetter.toUpperCase(),
    }));

    return new Response(JSON.stringify({ success: true, codeLetter: responseCodeLetters }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error generating code letters:', error);
      return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }