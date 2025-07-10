"use client";

import { useState } from "react";

export default function ContestantResult() {
  const [contestantNumber, setContestantNumber] = useState("");
  const [results, setResults] = useState({ stage: [], offstage: [] });
  const [contestant, setContestant] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!contestantNumber || isNaN(contestantNumber)) {
      setError("Please enter a valid contestant number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setContestant(null);
    setResults({ stage: [], offstage: [] });
    setTotalScore(0);

    try {
      // Fetch contestant by contestantNumber
      const contestantRes = await fetch(
        `/api/contestant?contestantNumber=${contestantNumber}`
      );
      const contestantData = await contestantRes.json();
      console.log("Contestant API response:", contestantData); // Debug
      if (contestantData.success && contestantData.contestant) {
        setContestant(contestantData.contestant);
      } else {
        setError("Contestant not found");
      }

      // Fetch and calculate scores
      const scoreRes = await fetch(
        `/api/contestant-scores?contestantNumber=${contestantNumber}`
      );
      const scoreData = await scoreRes.json();
      console.log("Scores API response:", scoreData); // Debug
      if (scoreData.success) {
        const calculatedScores = scoreData.scores.map((score) => {
          let calculatedScore = 0;
          if (score.rank && score.category) {
            if (score.rank === "1st" && score.category === "general(individual)")
              calculatedScore = 8;
            else if (score.rank === "2nd" && score.category === "general(individual)")
              calculatedScore = 5;
            else if (score.rank === "3rd" && score.category === "general(individual)")
              calculatedScore = 2;
            else if (score.rank === "1st" && score.category === "general(group)")
              calculatedScore = 15;
            else if (score.rank === "2nd" && score.category === "general(group)")
              calculatedScore = 10;
            else if (score.rank === "3rd" && score.category === "general(group)")
              calculatedScore = 5;
            else if (score.rank === "1st") calculatedScore = 5;
            else if (score.rank === "2nd") calculatedScore = 3;
            else if (score.rank === "3rd") calculatedScore = 1;
          }
          return { ...score, calculatedScore };
        });

        const stageResults = calculatedScores.filter((s) => s.stage === "stage");
        const offstageResults = calculatedScores.filter((s) => s.stage === "offstage");
        setResults({ stage: stageResults, offstage: offstageResults });

        const total = calculatedScores.reduce((sum, s) => sum + (s.calculatedScore || 0), 0);
        setTotalScore(total);
      } else {
        setError("No scores found for this contestant");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Server error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contestant Results</h2>
        <form onSubmit={handleCheck} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4">
            <label htmlFor="contestantNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Contestant Number
            </label>
            <input
              type="number"
              id="contestantNumber"
              value={contestantNumber}
              onChange={(e) => setContestantNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 4"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Check Result"}
          </button>
        </form>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}
        {isLoading && (
          <p className="text-center text-gray-500 mb-4">Loading...</p>
        )}
        {contestant && !error && !isLoading && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {contestant.name} (#{contestant.contestantNumber}, {contestant.groupName}, {contestant.category})
            </h3>
            <p className="mb-4 text-lg font-bold text-gray-700">Total Score: {totalScore}</p>

            {results.stage.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2 text-gray-700">Stage Results:</h4>
                <div className="space-y-2">
                  {results.stage.map((score, index) => (
                    <div
                      key={score._id}
                      className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {score.itemName} (Rank: {score.rank || "N/A"})
                      </span>
                      <span className="text-lg font-bold text-blue-600">{score.calculatedScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.offstage.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2 text-gray-700">Offstage Results:</h4>
                <div className="space-y-2">
                  {results.offstage.map((score, index) => (
                    <div
                      key={score._id}
                      className="p-3 bg-gray-50 rounded-md flex justify-between items-center"
                    >
                      <span className="text-gray-600">
                        {score.itemName} (Rank: {score.rank || "N/A"})
                      </span>
                      <span className="text-lg font-bold text-blue-600">{score.calculatedScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.stage.length === 0 && results.offstage.length === 0 && (
              <p className="text-center text-gray-500">No results found for this contestant.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}