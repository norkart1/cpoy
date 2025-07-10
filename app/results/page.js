"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Search } from "lucide-react";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ResultPage() {
  const [teamScores, setTeamScores] = useState([]);
  const [topContestants, setTopContestants] = useState({
    subjunior: [],
    junior: [],
    senior: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch team total scores
    fetch("/api/team/total-scores")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setTeamScores(data.scores.slice(0, 3));
        } else {
          console.error("API error (team scores):", data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching team scores:", err.message);
        fetch("/api/team/total-scores").then((res) =>
          console.log("Raw response (team scores):", res)
        );
      });

    // Fetch top 5 contestants per category
    fetch("/api/top-contestants")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data);
        if (data.success) {
          setTopContestants({
            subjunior: data.subjunior || [],
            junior: data.junior || [],
            senior: data.senior || [],
          });
        } else {
          setTopContestants({ subjunior: [], junior: [], senior: [] });
          console.error("API error:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching top contestants:", err.message);
        setTopContestants({ subjunior: [], junior: [], senior: [] });
      });
  }, []);

  // Handle search and redirect
  const handleCheck = (e) => {
    e.preventDefault();
    if (searchQuery && !isNaN(searchQuery)) {
      window.location.href = `/contestant-result-table?contestantNumber=${searchQuery}`;
    } else {
      console.error("Please enter a valid contestant number");
    }
  };

  // Chart data for top 3 teams
  const chartData = {
    labels: teamScores.map((team) => team.teamName),
    datasets: [
      {
        label: "Total Points",
        data: teamScores.map((team) => team.totalPoints),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Top 3 Teams by Total Points" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Contestant Number Input and Check Button */}
      <div className="max-w-md mx-auto mb-6 bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <input
          type="number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Contestant Number"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCheck}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Check Result
        </button>
      </div>

      {/* Top 3 Teams Graph */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Top 3 Teams</h2>
        {teamScores.length > 0 ? (
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading team scores...</p>
        )}
      </div>

      {/* Top 5 Contestants by Category */}
      <div className="bg-white text-gray-500 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Top 5 Contestants by Category</h2>
        {["subjunior", "junior", "senior"].map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{category}</h3>
            {topContestants[category].length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Rank</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Contestant #</th>
                      <th className="border p-2">Team</th>
                      <th className="border p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContestants[category].map((contestant, index) => (
                      <tr key={contestant.contestantNumber} className="border-t">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{contestant.name}</td>
                        <td className="border p-2">#{contestant.contestantNumber}</td>
                        <td className="border p-2">{contestant.teamName}</td>
                        <td className="border p-2 font-bold text-center">{contestant.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading {category} contestants...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}