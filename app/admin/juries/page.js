

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, User } from "lucide-react";
import AdminSidebar from '@/components/adminSidebar';

export default function JuryPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [juries, setJuries] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchJuries = async () => {
    try {
      const res = await fetch("/api/admin/juries");
      const data = await res.json();
      if (data.success) {
        setJuries(data.juries || []);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to fetch juries." });
      }
    } catch (error) {
      console.error("Error fetching juries:", error);
      setMessage({ type: "error", text: "Server error fetching juries." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    try {
      const res = await fetch("/api/admin/juries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: "success", text: "Jury created successfully!" });
        setUsername("");
        setPassword("");
        await fetchJuries();
      } else {
        setMessage({ type: "error", text: result.message || "Error creating jury." });
      }
    } catch (error) {
      console.error("Error creating jury:", error);
      setMessage({ type: "error", text: "Server error creating jury." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this jury?")) return;
    try {
      const res = await fetch(`/api/admin/juries/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: "success", text: "Jury deleted successfully." });
        await fetchJuries();
      } else {
        setMessage({ type: "error", text: result.message || "Failed to delete jury." });
      }
    } catch (error) {
      console.error("Error deleting jury:", error);
      setMessage({ type: "error", text: "Server error deleting jury." });
    }
  };

  useEffect(() => {
    fetchJuries();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <main className='flex-1'>
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Jury Management
                </h1>
                <p className="text-gray-600 mt-1">Create and manage jury accounts</p>
              </div>
              <button
                onClick={() => {
                  setUsername("");
                  setPassword("");
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Reset Form
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Message */}
          {message && (
            <div
              className={`mb-8 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${message.type === "success"
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

          {/* Form Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Jury</h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Jury Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Jury Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Create Jury
                </button>
              </div>
            </form>
          </div>

          {/* Juries Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Existing Juries</h2>
                <p className="text-gray-600 mt-1">{juries.length} juries created</p>
              </div>
            </div>

            {juries.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No juries yet</h3>
                <p className="text-gray-600">Create your first jury to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {juries.map((jury) => (
                  <div
                    key={jury._id}
                    className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                        <div className="text-white text-xs font-semibold mt-1">JURY</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {jury.username}
                      </h3>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDelete(jury._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Jury"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
