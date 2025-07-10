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
import Link from "next/link";

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
  const [contestantScores, setContestantScores] = useState(null);

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

  // Handle search by contestantNumber
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `/api/contestant-scores?contestantNumber=${searchQuery}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        const rankedScores = data.scores.filter((score) =>
          ["1st", "2nd", "3rd"].includes(score.rank)
        );
        setContestantScores(rankedScores);
      } else {
        setContestantScores(null);
        console.error("Search failed:", data.message);
      }
    } catch (err) {
      setContestantScores(null);
      fetch(`/api/contestant-scores?contestantNumber=${searchQuery}`).then((res) =>
        console.log("Raw response (search):", res)
      );
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
       <div className="text-center">
        <Link href="/contestant-result">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Check Your Result
          </button>
        </Link>
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

      {/* Contestant Search */}
      {/* <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Search Contestant Results</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Contestant Number"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        {contestantScores && contestantScores.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ranked Scores:</h3>
            {contestantScores.reduce(
              (acc, score) => {
                const section = score.stage === "offstage" ? acc.offstage : acc.stage;
                section.push(
                  <div
                    key={score._id}
                    className="p-2 bg-gray-50 rounded flex justify-between"
                  >
                    <span>{score.itemName} (Rank: {score.rank})</span>
                    <span className="font-bold">{score.score}</span>
                  </div>
                );
                return acc;
              },
              { stage: [], offstage: [] }
            ).stage.length > 0 && (
              <div>
                <h4 className="text-md font-medium">Stage Results:</h4>
                {[...new Set(
                  contestantScores
                    .filter((s) => s.stage === "stage")
                    .map((s) => s.itemName)
                )].map((itemName) => (
                  <div key={itemName}>
                    {contestantScores
                      .filter((s) => s.stage === "stage" && s.itemName === itemName)
                      .map((s) => (
                        <div
                          key={s._id}
                          className="p-2 bg-gray-50 rounded flex justify-between"
                        >
                          <span>{s.itemName} (Rank: {s.rank})</span>
                          <span className="font-bold">{s.score}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
            {contestantScores.reduce(
              (acc, score) => {
                const section = score.stage === "offstage" ? acc.offstage : acc.stage;
                section.push(
                  <div
                    key={score._id}
                    className="p-2 bg-gray-50 rounded flex justify-between"
                  >
                    <span>{score.itemName} (Rank: {score.rank})</span>
                    <span className="font-bold">{score.score}</span>
                  </div>
                );
                return acc;
              },
              { stage: [], offstage: [] }
            ).offstage.length > 0 && (
              <div>
                <h4 className="text-md font-medium">Offstage Results:</h4>
                {[...new Set(
                  contestantScores
                    .filter((s) => s.stage === "offstage")
                    .map((s) => s.itemName)
                )].map((itemName) => (
                  <div key={itemName}>
                    {contestantScores
                      .filter((s) => s.stage === "offstage" && s.itemName === itemName)
                      .map((s) => (
                        <div
                          key={s._id}
                          className="p-2 bg-gray-50 rounded flex justify-between"
                        >
                          <span>{s.itemName} (Rank: {s.rank})</span>
                          <span className="font-bold">{s.score}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : contestantScores === null && searchQuery ? (
          <p className="text-center text-red-500">No results found for {searchQuery}</p>
        ) : null}
      </div> */}
    </div>
  );
}