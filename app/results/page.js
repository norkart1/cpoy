// "use client";

// import { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Search } from "lucide-react";

// // Register ChartJS components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function ResultPage() {
//   const [teamScores, setTeamScores] = useState([]);
//   const [topContestants, setTopContestants] = useState({
//     subjunior: [],
//     junior: [],
//     senior: [],
//   });
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     // Fetch team total scores
//     fetch("/api/team/total-scores")
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           setTeamScores(data.scores.slice(0, 3));
//         } else {
//           console.error("API error (team scores):", data.message);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching team scores:", err.message);
//         fetch("/api/team/total-scores").then((res) =>
//           console.log("Raw response (team scores):", res)
//         );
//       });

//     // Fetch top 5 contestants per category
//     fetch("/api/top-contestants")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log("API response:", data);
//         if (data.success) {
//           setTopContestants({
//             subjunior: data.subjunior || [],
//             junior: data.junior || [],
//             senior: data.senior || [],
//           });
//         } else {
//           setTopContestants({ subjunior: [], junior: [], senior: [] });
//           console.error("API error:", data.message);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching top contestants:", err.message);
//         setTopContestants({ subjunior: [], junior: [], senior: [] });
//       });
//   }, []);

//   // Handle search and redirect
//   const handleCheck = (e) => {
//     e.preventDefault();
//     if (searchQuery && !isNaN(searchQuery)) {
//       window.location.href = `/contestant-result-table?contestantNumber=${searchQuery}`;
//     } else {
//       console.error("Please enter a valid contestant number");
//     }
//   };

//   // Chart data for top 3 teams
//   const chartData = {
//     labels: teamScores.map((team) => team.teamName),
//     datasets: [
//       {
//         label: "Total Points",
//         data: teamScores.map((team) => team.totalPoints),
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//         borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "Top 3 Teams by Total Points" },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Contestant Number Input and Check Button */}
//       <div className="max-w-md mx-auto mb-6 bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
//         <input
//           type="number"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Enter Contestant Number"
//           className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleCheck}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
//         >
//           Check Result
//         </button>
//       </div>

//       {/* Top 3 Teams Graph */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-2xl font-bold mb-4">Top 3 Teams</h2>
//         {teamScores.length > 0 ? (
//           <div className="h-64">
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">Loading team scores...</p>
//         )}
//       </div>

//       {/* Top 5 Contestants by Category */}
//       <div className="bg-white text-gray-500 rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-2xl font-bold mb-4">Top 5 Contestants by Category</h2>
//         {["subjunior", "junior", "senior"].map((category) => (
//           <div key={category} className="mb-6">
//             <h3 className="text-xl font-semibold mb-2">{category}</h3>
//             {topContestants[category].length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border-collapse">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="border p-2">Rank</th>
//                       <th className="border p-2">Name</th>
//                       <th className="border p-2">Contestant #</th>
//                       <th className="border p-2">Team</th>
//                       <th className="border p-2">Score</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topContestants[category].map((contestant, index) => (
//                       <tr key={contestant.contestantNumber} className="border-t">
//                         <td className="border p-2 text-center">{index + 1}</td>
//                         <td className="border p-2">{contestant.name}</td>
//                         <td className="border p-2">#{contestant.contestantNumber}</td>
//                         <td className="border p-2">{contestant.teamName}</td>
//                         <td className="border p-2 font-bold text-center">{contestant.score}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">Loading {category} contestants...</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { Trophy, Search, Award } from 'lucide-react';

export default function ResultPage() {
  const [teamScores, setTeamScores] = useState([]);
  const [topContestants, setTopContestants] = useState({ subjunior: [], junior: [], senior: [] });
  const [overallTop, setOverallTop] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch team scores
        const teamRes = await fetch('/api/team/total-scores');
        if (!teamRes.ok) throw new Error(`Team scores fetch failed: ${teamRes.status}`);
        const teamData = await teamRes.json();
        if (teamData.success) {
          setTeamScores(teamData.scores.slice(0, 3));
        } else {
          throw new Error(`Team scores API error: ${teamData.message}`);
        }

        // Fetch top contestants
        const contestantsRes = await fetch('/api/top-contestants');
        const contestantsData = await contestantsRes.json();
        if (!contestantsRes.ok) {
          throw new Error(contestantsData.message || `Top contestants fetch failed: ${contestantsRes.status}`);
        }
        if (contestantsData.success) {
          setTopContestants({
            subjunior: (contestantsData.subjunior || []).slice(0, 3), // Limit to top 3
            junior: (contestantsData.junior || []).slice(0, 3),
            senior: (contestantsData.senior || []).slice(0, 3),
          });

          // Calculate overall top performer
          const allContestants = [
            ...(contestantsData.subjunior || []).slice(0, 3),
            ...(contestantsData.junior || []).slice(0, 3),
            ...(contestantsData.senior || []).slice(0, 3),
          ];
          const topPerformer = allContestants.reduce((max, curr) =>
            !max || curr.score > max.score ? curr : max, null
          );
          setOverallTop(topPerformer);
        } else {
          throw new Error(contestantsData.message || 'No top contestants found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load results. Please try again.');
        console.error('Error fetching data:', {
          message: err.message,
          status: err.status || null,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheck = (e) => {
    e.preventDefault();
    if (searchQuery && !isNaN(searchQuery)) {
      window.location.href = `/contestant-result-table?contestantNumber=${searchQuery}`;
    } else {
      setError('Please enter a valid contestant number');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
        .font-geist-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes glow { 0%, 100% { box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); } 50% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.4); } }
        .animate-glow { animation: glow 2s ease-in-out infinite; }

        @keyframes slide-in { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }

        .trophy-gold { color: #FFD700; }
        .trophy-silver { color: #C0C0C0; }
        .trophy-bronze { color: #CD7F32; }
      `}</style>

      {/* Search Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-geist-sans mb-4">Find Your Results</h2>
            <p className="text-gray-600 text-base sm:text-lg font-geist-mono">Enter your contestant ID to view your individual performance</p>
          </div>
          <form onSubmit={handleCheck} className="relative max-w-2xl mx-auto mb-8">
            <input
              type="number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter contestant ID (e.g., 999)"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-black transition-colors bg-white font-geist-mono"
            />
            <button type="submit" className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <Search className="w-6 h-6 text-gray-400" />
            </button>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="py-8 text-center text-red-600 font-geist-sans text-base sm:text-lg">{error}</div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-gray-600 font-geist-sans text-base sm:text-lg">Loading...</div>
      )}

      {/* Overall Champion */}
      {!loading && overallTop && (
        <div className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 trophy-gold animate-glow" />
              <h2 className="text-3xl sm:text-4xl font-bold font-geist-sans mb-4">Overall Champion</h2>
              <p className="text-gray-300 text-base sm:text-lg font-geist-mono">The highest scoring performer across all categories</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 animate-slide-in">
              <div className="text-2xl sm:text-4xl font-bold font-geist-sans mb-2">{overallTop.name}</div>
              <div className="text-base sm:text-xl text-gray-300 font-geist-mono mb-4">
                ID: {overallTop.contestantNumber} • {overallTop.teamName}
              </div>
              <div className="text-4xl sm:text-5xl font-black trophy-gold mb-4">{overallTop.score}</div>
              <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wide font-geist-mono">Points</div>
            </div>
          </div>
        </div>
      )}

      {/* Group Rankings */}
      {!loading && teamScores.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-geist-sans mb-4">Group Rankings</h2>
              <p className="text-gray-600 text-base sm:text-lg font-geist-mono">Top three teams based on cumulative performance</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {teamScores.map((group, index) => (
                <div
                  key={group.teamName}
                  className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 animate-slide-in ${
                    index === 0 ? 'bg-black text-white shadow-2xl' : 'bg-gray-50 border-2 border-gray-200 hover:border-black'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-black" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      index === 0 ? 'bg-white text-black' : 'bg-black text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm opacity-60 uppercase tracking-wide font-geist-mono">Group</div>
                      <div className="text-base sm:text-lg font-bold font-geist-sans">{group.teamName}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl sm:text-4xl font-black font-geist-sans mb-1">{group.totalPoints}</div>
                    <div className="text-sm opacity-60 uppercase tracking-wide font-geist-mono">Total Points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Champions */}
      {!loading && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-geist-sans mb-4">Category Champions</h2>
              <p className="text-gray-600 text-base sm:text-lg font-geist-mono">Top three performers in each age category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {Object.entries(topContestants).map(([category, performers], catIndex) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-gray-100 hover:border-black transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${catIndex * 0.2}s` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-8 h-8 text-black" />
                    <div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Category</div>
                      <div className="text-lg sm:text-xl font-bold font-geist-sans capitalize">{category}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {performers.length > 0 ? (
                      performers.map((performer, index) => (
                        <div key={performer.contestantNumber} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-black text-white trophy-gold' :
                            index === 1 ? 'bg-gray-200 text-black trophy-silver' :
                            'bg-gray-200 text-black trophy-bronze'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm sm:text-base font-semibold font-geist-sans">{performer.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">
                              ID: {performer.contestantNumber} • {performer.teamName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-bold font-geist-sans">{performer.score}</div>
                            <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">pts</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm font-geist-mono">No performers found for {category}.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="py-12 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold font-geist-sans mb-4">Alathurpadi Dars Fest 2025</h3>
          <p className="text-gray-400 text-sm sm:text-base font-geist-mono mb-6">
            Celebrating academic excellence and teamwork.
          </p>
          <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">
            Results generated on {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}