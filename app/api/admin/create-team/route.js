import  connectToDatabase  from "../../../../lib/dbConnect.js";
import Team from "../../../../models/Team.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse request body
    // const { teamName, password } = await request.json();

    let teamName="team1"
    let password="21"

    // Validate input
    if (!teamName || !password) {
      return new Response(
        JSON.stringify({ error: "Team name and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if teamName already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return new Response(
        JSON.stringify({ error: "Team name already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new team
    const team = new Team({
      teamName,
      password: hashedPassword,
    });
    await team.save();

    return new Response(
      JSON.stringify({ message: "Team created successfully", team: { teamName } }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}