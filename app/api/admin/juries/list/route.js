// Example Next.js API route
import Jury from '@/models/Jury';
import  connectDB  from '@/lib/dbConnect';

export async function GET(req) {
    try {
        await connectDB();

        const juries = await Jury.find(); // fetch all juries
        console.log("juuu", JSON.stringify(juries, null, 2));
        return new Response(
            JSON.stringify({ success: true, juries }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: 'Failed to fetch juries' }),
            { status: 500 }
        );
    }
}