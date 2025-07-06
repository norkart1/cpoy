"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Trophy, ArrowLeft } from "lucide-react";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [itemName, setItemName] = useState("N/A");
  const [category, setCategory] = useState("N/A");
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const juryId = searchParams.get("juryId");

  useEffect(() => {
    if (!juryId) {
      setMessage({ type: "error", text: "Invalid jury ID. Redirecting to dashboard..." });
      setTimeout(() => router.push("/jury/dashboard"), 1000);
      return;
    }

    const fetchRankings = async () => {
      try {
        console.log("Fetching rankings with juryId:", juryId);
        const res = await axios.get("/api/jury/rankings", {
          params: { juryId },
        });
        console.log("Rankings API response:", res.data);
        if (res.data.success) {
          const rankings = res.data.rankings || [];
          setRankings(rankings);
          // Extract itemName and category from first ranking, if available
          if (rankings.length > 0) {
            setItemName(rankings[0].itemName || "N/A");
            setCategory(rankings[0].category || "N/A");
          } else {
            // Fallback: Fetch item details if no rankings
            const stored = localStorage.getItem("jury");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.assignedItems?.length > 0) {
                try {
                  const itemRes = await axios.get("/api/jury/items", {
                    params: { itemIds: parsed.assignedItems[0] },
                  });
                  console.log("Item API response:", itemRes.data);
                  if (itemRes.data.success && itemRes.data.items?.length > 0) {
                    setItemName(itemRes.data.items[0].name || "N/A");
                    setCategory(itemRes.data.items[0].category || "N/A");
                  }
                } catch (err) {
                  console.error("Error fetching item:", err.response?.data || err.message);
                }
              }
            }
          }
        } else {
          setMessage({ type: "error", text: res.data.message || "Failed to load rankings." });
        }
      } catch (err) {
        console.error("Error fetching rankings:", err.response?.data || err.message);
        setMessage({ type: "error", text: "Server error fetching rankings." });
      }
    };

    fetchRankings();
  }, [juryId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/30 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                Contest Leaderboard
              </h1>
              <p className="text-gray-700 mt-2 font-semibold">All Contestants Ranked</p>
              <p className="text-gray-700 mt-1 font-medium">Item: {itemName}</p>
              <p className="text-gray-700 mt-1 font-medium">Category: {category}</p>
            </div>
            <button
              onClick={() => router.push("/jury/dashboard")}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Alert Message */}
        {message && (
          <div
            className={`mb-8 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${
              message.type === "success"
                ? "bg-green-500/20 text-green-800 border border-green-300/50"
                : "bg-red-500/20 text-red-800 border border-red-300/50"
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}></div>
              <span className="font-medium">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
            </div>
          </div>
        )}

        {/* Rankings Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-md">Leaderboard</h2>
          {rankings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="w-16 h-16 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 drop-shadow">No rankings available</h3>
              <p className="text-gray-200">No scores have been submitted yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {rankings.map((rank, index) => (
                <div
                  key={rank.contestantId}
                  className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        index === 0
                          ? "w-12 h-12 bg-yellow-500 clip-path-triangle"
                          : index === 1
                          ? "w-12 h-12 bg-gray-400 rounded-full"
                          : index === 2
                          ? "w-12 h-12 bg-amber-600 clip-path-hexagon"
                          : "w-12 h-12 bg-indigo-500 rounded-full"
                      }`}
                    >
                      {index === 0 && "1st"}
                      {index === 1 && "2nd"}
                      {index === 2 && "3rd"}
                      {index >= 3 && index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{rank.name}</h3>
                      <p className="text-gray-600 font-medium">Chest Number: {rank.contestantNumber}</p>
                      <p className="text-gray-600 font-medium">Team: {rank.teamName}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-500 drop-shadow">{rank.totalScore}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* CSS for custom clip-path shapes */
