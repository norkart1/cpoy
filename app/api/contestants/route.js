// app\api\contestants\route.js

import Contestant from "@/models/Contestant";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";

// GET: Fetch contestants, optionally filtered by groupName
export async function GET(request) {
  // Use request.nextUrl to parse the URL and query parameters
  const { searchParams } = request.nextUrl;
  const groupName = searchParams.get("groupName");
  console.log("GroupName received:", groupName);

  try {
    await connectDB();
    const query = groupName ? { groupName } : {};
    const contestants = await Contestant.find(query).lean();
    return NextResponse.json({ success: true, data: contestants }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contestants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contestants" },
      { status: 500 }
    );
  }
}