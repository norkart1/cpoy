"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Trophy, ArrowLeft } from "lucide-react";

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
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
          setRankings(res.data.rankings || []);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Contest Rankings
              </h1>
              <p className="text-gray-600 mt-1">Top 3 Contestants</p>
            </div>
            <button
              onClick={() => router.push("/jury/dashboard")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Message */}
        {message && (
          <div
            className={`mb-8 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${
              message.type === "success"
                ? "bg-green-500/10 text-green-700 border border-green-200/50"
                : "bg-red-500/10 text-red-700 border border-red-200/50"
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="font-medium">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
            </div>
          </div>
        )}

        {/* Rankings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Contestants</h2>
          {rankings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No rankings available</h3>
              <p className="text-gray-600">No scores have been submitted yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {rankings.map((rank, index) => (
                <div
                  key={rank.contestantId}
                  className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{rank.name}</h3>
                      <p className="text-gray-600">Team: {rank.teamName}</p>
                      <p className="text-gray-600">Item: {rank.itemName}</p>
                      <p className="text-gray-600">Category: {rank.category}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">{rank.totalScore}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}