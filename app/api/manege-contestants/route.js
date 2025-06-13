import mongoose from 'mongoose';
import Contestant from '../../../models/Contestant'; // Adjust path as needed
import Item from '../../../models/Item'; // Adjust path as needed
import connectToDatabase from '@/lib/dbConnect';

// Connect to MongoDB

// API Route Handler
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const groupName = searchParams.get('groupName');

    // Build query for contestants
    const query = groupName ? { groupName: { $regex: groupName, $options: 'i' } } : {};

    // Fetch contestants
    const contestants = await Contestant.find(query).lean();

    // Enrich contestants with item counts
    const enrichedContestants = await Promise.all(
      contestants.map(async (contestant) => {
        // Aggregate item counts for specific stage and category values
        const itemCounts = await Item.aggregate([
          { $match: { participants: contestant._id } }, // Match items with contestant
          {
            $group: {
              _id: null,
              state: {
                $sum: { $cond: [{ $eq: ['$stage', 'stage'] }, 1, 0] },
              },
              offstate: {
                $sum: { $cond: [{ $eq: ['$stage', 'offstage'] }, 1, 0] },
              },
              generalIndividual: {
                $sum: { $cond: [{ $eq: ['$category', 'general(individual)'] }, 1, 0] },
              },
              generalGroup: {
                $sum: { $cond: [{ $eq: ['$category', 'general(group)'] }, 1, 0] },
              },
            },
          },
        ]);

        // Extract counts (default to 0 if no items)
        const counts = itemCounts[0] || {
          state: 0,
          offstate: 0,
          generalIndividual: 0,
          generalGroup: 0,
        };

        return {
          ...contestant,
          stage: counts.state,
          offstage: counts.offstate,
          generalIndividual: counts.generalIndividual,
          generalGroup: counts.generalGroup,
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: enrichedContestants,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching contestants:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch contestants',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}