"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, LogIn } from "lucide-react";

export default function JuryLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    try {
      const res = await fetch("/api/jury/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Login successful!" });
        localStorage.setItem("jury", JSON.stringify(data.jury));
        setTimeout(() => router.push("/jury/dashboard"), 1000); // Delay for message visibility
      } else {
        setMessage({ type: "error", text: data.message || "Invalid username or password." });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ type: "error", text: "Server error during login." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Jury Login
          </h2>
          <p className="text-gray-600 mt-2">Access your jury dashboard</p>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${
              message.type === "success"
                ? "bg-green-500/10 text-green-700 border border-green-200/50"
                : "bg-red-500/10 text-red-700 border border-red-200/50"
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
