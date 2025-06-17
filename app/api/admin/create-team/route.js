// import  connectToDatabase  from "../../../../lib/dbConnect.js";
// import Team from "../../../../models/Team.js";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     // Connect to MongoDB
//     await connectToDatabase();

//     // Parse request body
//     // const { teamName, password } = await request.json();

//     let teamName="QUDWATHULULAMA"
//     let password="21"

//     // Validate input
//     if (!teamName || !password) {
//       return new Response(
//         JSON.stringify({ error: "Team name and password are required" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Check if teamName already exists
//     const existingTeam = await Team.findOne({ teamName });
//     if (existingTeam) {
//       return new Response(
//         JSON.stringify({ error: "Team name already exists" }),
//         { status: 409, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new team
//     const team = new Team({
//       teamName,
//       password: hashedPassword,
//     });
//     await team.save();

//     return new Response(
//       JSON.stringify({ message: "Team created successfully", team: { teamName } }),
//       { status: 201, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error creating team:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

import connectToDatabase from "@/lib/dbConnect";
import Team from "@/models/Team";
import bcrypt from "bcryptjs";

// POST: Create team
export async function POST(request) {
  try {
    await connectToDatabase();
    const { teamName, password } = await request.json();

    if (!teamName || !password) {
      return new Response(JSON.stringify({ error: "Team name and password are required" }), { status: 400 });
    }

    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return new Response(JSON.stringify({ error: "Team already exists" }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeam = new Team({ teamName, password: hashedPassword });
    await newTeam.save();

    return new Response(JSON.stringify({ message: "Team created successfully" }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// GET: Fetch all teams
export async function GET() {
  try {
    await connectToDatabase();
    const teams = await Team.find({}, { teamName: 1 });
    return new Response(JSON.stringify(teams), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch teams" }), { status: 500 });
  }
}

// PUT: Update team credentials
// PUT: Update team credentials
export async function PUT(request) {
  try {
    await connectToDatabase();
    const { id, newTeamName, newPassword } = await request.json();

    if (!id || (!newTeamName && !newPassword)) {
      return new Response(JSON.stringify({ error: "Missing fields to update" }), { status: 400 });
    }

    const updateData = {};
    if (newTeamName) updateData.teamName = newTeamName;
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

    const updatedTeam = await Team.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTeam) {
      return new Response(JSON.stringify({ error: "Team not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Team updated", updatedTeam }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


// import connectToDatabase from "@/lib/dbConnect";
// import Team from "@/models/Team";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//   try {
//     await connectToDatabase();
//     const { teamName, password } = await request.json();

//     if (!teamName || !password) {
//       return new Response(JSON.stringify({ error: "Team name and password are required" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const existingTeam = await Team.findOne({ teamName });
//     if (existingTeam) {
//       return new Response(JSON.stringify({ error: "Team already exists" }), {
//         status: 409,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeam = new Team({ teamName, password: hashedPassword });
//     await newTeam.save();

//     return new Response(
//       JSON.stringify({ message: "Team created successfully", team: { teamName } }),
//       {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (err) {
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
