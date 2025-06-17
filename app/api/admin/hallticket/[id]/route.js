import dbConnect from '@/lib/dbConnect';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';

export async function GET(request, { params }) {
  await dbConnect();
  const id = params.id;

  try {
    const contestant = await Contestant.findById(id);
    if (!contestant) {
      return new Response(JSON.stringify({ message: "Contestant not found" }), { status: 404 });
    }

    const programs = await Item.find({ participants: id });

    return new Response(JSON.stringify({ contestant, programs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error", error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
