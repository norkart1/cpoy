// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth.js";
// import { redirect } from "next";
import Link from "next/link";

// Sample team data (replace with MongoDB query if needed)
const teams = [
  { name: "Team A", score: 450 },
  { name: "Team B", score: 380 },
  { name: "Team C", score: 320 },
];

export default async function Scoreboard() {
  // Check session
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     redirect("/team-login");
//   }

  return (
    <div className="min-h-screen bg-gray-100 flex text-black flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Competition Scoreboard</h1>
        
        {/* Scoreboard */}
        <div className="grid grid-cols-1 gap-4">
          {teams.map((team, index) => (
            <div
              key={team.name}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-4">{index + 1}.</span>
                <span className="text-xl font-medium">{team.name}</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{team.score} pts</span>
            </div>
          ))}
        </div>

        {/* Button to Team Panel */}
        <div className="mt-8 text-center">
          <Link
            href="/team-panel"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Go to Team Panel
          </Link>
        </div>
      </div>
    </div>
  );
}