import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import Contestant from '@/models/Contestant';
import Item from '@/models/Item';
import Team from '@/models/Team';
import connectToDatabase from '@/lib/dbConnect';

export async function POST(req) {
  try {
        await connectToDatabase();
    } catch (error) {
        console.error('Database connection failed:', error);
        return NextResponse.json(
            { success: false, message: 'Database connection failed.' },
            { status: 500 }
        );
    }

    try {
        const { contestantIds, password, teamName } = await req.json();

        if (!contestantIds || !Array.isArray(contestantIds) || contestantIds.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No contestants selected for deletion.' },
                { status: 400 }
            );
        }

        if (!password || !teamName) {
            return NextResponse.json(
                { success: false, message: 'Team name and password are required.' },
                { status: 400 }
            );
        }

        // Validate contestant IDs
        const validIds = contestantIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (validIds.length !== contestantIds.length) {
            return NextResponse.json(
                { success: false, message: 'Invalid contestant IDs provided.' },
                { status: 400 }
            );
        }

        // Verify team password
        const team = await Team.findOne({ teamName }).select('password');
        if (!team) {
            return NextResponse.json(
                { success: false, message: 'Team not found.' },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcryptjs.compare(password, team.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid password.' },
                { status: 401 }
            );
        }

        // Verify contestants belong to the team
        const contestants = await Contestant.find({ _id: { $in: validIds }, groupName: teamName });
        if (contestants.length !== validIds.length) {
            return NextResponse.json(
                { success: false, message: 'Some contestants do not belong to your team.' },
                { status: 403 }
            );
        }

        // Delete contestants
        const deleteResult = await Contestant.deleteMany({ _id: { $in: validIds } });
        if (deleteResult.deletedCount !== validIds.length) {
            console.error('Failed to delete all selected contestants:', deleteResult);
            return NextResponse.json(
                { success: false, message: 'Failed to delete some contestants.' },
                { status: 500 }
            );
        }

        // Remove contestant IDs from Item.participants
        await Item.updateMany(
            { participants: { $in: validIds } },
            { $pull: { participants: { $in: validIds } } }
        );

        return NextResponse.json({
            success: true,
            message: 'Contestants deleted successfully.',
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete contestants.' },
            { status: 500 }
        );
    }
}