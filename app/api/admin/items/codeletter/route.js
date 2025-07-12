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

    // Valid code letters: a to x and z (exclude y)
    const validLetters = 'abcdefghijklmnopqrstuvwxz'.split('');

    // Shuffle participants randomly
    const shuffledParticipants = [...item.participants].sort(() => Math.random() - 0.5);

    // Assign code letters
    const codeLetterArray = shuffledParticipants.map((participant, index) => {
      const letter = validLetters[index] || 'z'; // Fallback to 'z' if limit exceeded
      return {
        contestantId: participant._id,
        codeLetter: letter,
      };
    });

    // Store generated letters in the item document
    item.codeLetter = codeLetterArray;
    await item.save();

    return new Response(JSON.stringify({ success: true, codeLetter: item.codeLetter }), {
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
