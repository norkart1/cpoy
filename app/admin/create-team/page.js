"use client";

import { useState } from "react";
import axios from "axios";
import { Users, CheckCircle, AlertCircle, Lock } from "lucide-react";

export default function CreateTeamForm() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post("/api/admin/create-team", { teamName, password });
      if (res.status === 201) {
        setMessage({ type: "success", text: res.data.message });
        setTeamName("");
        setPassword("");
      } else {
        setMessage({ type: "error", text: res.data.error });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to create team",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create New Team</h2>
            <p className="text-blue-100 text-sm">Enter credentials to register a team</p>
          </div>

          {/* Form Body */}
          <div className="px-8 py-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleCreateTeam} className="space-y-5">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Team Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter team name"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Create Team
              </button>
            </form>
          </div>

          <div className="text-center pb-4 text-xs text-gray-500">
            Admin panel – secure team creation
          </div>
        </div>
      </div>
    </div>
  );
}
