"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ContestantResultTable() {
  const searchParams = useSearchParams();
  const contestantNumber = searchParams.get("contestantNumber");
  const [results, setResults] = useState({ stage: [], offstage: [] });
  const [contestant, setContestant] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!contestantNumber || isNaN(contestantNumber)) {
        setError("Invalid or missing contestant number");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch contestant by contestantNumber
        const contestantRes = await fetch(
          `/api/contestant?contestantNumber=${contestantNumber}`
        );
        const contestantData = await contestantRes.json();
        if (contestantData.success && contestantData.contestant) {
          setContestant(contestantData.contestant);
        } else {
          setError("Contestant not found");
        }

        // Fetch and calculate scores
        const scoreRes = await fetch(
          `/api/contestant?contestantNumber=${contestantNumber}`
        );
        const scoreData = await scoreRes.json();
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

    fetchData();
  }, [contestantNumber]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contestant Results</h2>
      {error ? (
        <p className="text-center text-red-500 mb-4">{error}</p>
      ) : isLoading ? (
        <p className="text-center text-gray-500 mb-4">Loading...</p>
      ) : contestant ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {contestant.name} (#{contestant.contestantNumber}, {contestant.groupName}, {contestant.category})
          </h3>
          <p className="mb-4 text-lg font-bold text-gray-700">Total Score: {totalScore}</p>

          {results.stage.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2 text-gray-700">Stage Results</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Item Name</th>
                      <th className="border p-2 text-left">Rank</th>
                      <th className="border p-2 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.stage.map((score) => (
                      <tr key={score._id} className="border-t">
                        <td className="border p-2">{score.itemName}</td>
                        <td className="border p-2">{score.rank || "N/A"}</td>
                        <td className="border p-2 font-bold text-blue-600">{score.calculatedScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.offstage.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-2 text-gray-700">Offstage Results</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2 text-left">Item Name</th>
                      <th className="border p-2 text-left">Rank</th>
                      <th className="border p-2 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.offstage.map((score) => (
                      <tr key={score._id} className="border-t">
                        <td className="border p-2">{score.itemName}</td>
                        <td className="border p-2">{score.rank || "N/A"}</td>
                        <td className="border p-2 font-bold text-blue-600">{score.calculatedScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {results.stage.length === 0 && results.offstage.length === 0 && (
            <p className="text-center text-gray-500">No results found for this contestant.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}