"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, User, Users, FileText } from "lucide-react";

export default function ContestantRegistration() {
  const [form, setForm] = useState({
    contestantNumber: "",
    name: "",
    groupName: "Ma'abariyah",
    category: "subjunior",
    file: null,
  });
  const [contestants, setContestants] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch contestants on component load
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const res = await axios.get("/api/admin/contestants");
        setContestants(res.data.contestants || []);
      } catch (err) {
        console.error("Error fetching contestants:", err);
        setMessage({ type: "error", text: "Failed to fetch contestants." });
      }
    };
    fetchContestants();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contestantNumber || !form.name || !form.groupName || !form.category) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    const formData = new FormData();
    formData.append("contestantNumber", form.contestantNumber);
    formData.append("name", form.name);
    formData.append("groupName", form.groupName);
    formData.append("category", form.category);
    if (form.file) formData.append("file", form.file);

    try {
      const res = await axios.post("/api/admin/contestants/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Contestant registered successfully!" });
      setForm({
        contestantNumber: "",
        name: "",
        groupName: "Ma'abariyah",
        category: "subjunior",
        file: null,
      });
      const updated = await axios.get("/api/admin/contestants");
      setContestants(updated.data.contestants || []);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to register contestant.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contestant?")) return;

    try {
      await axios.post(`/api/admin/contestants/${id}/delete`);
      setContestants((prev) => prev.filter((c) => c._id !== id));
      setMessage({ type: "success", text: "Contestant deleted successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete contestant.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Contestant Registration
              </h1>
              <p className="text-gray-600 mt-1">Register and manage fest contestants</p>
            </div>
            <button
              onClick={() =>
                setForm({
                  contestantNumber: "",
                  name: "",
                  groupName: "Ma'abariyah",
                  category: "subjunior",
                  file: null,
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Reset Form
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
              <div
                className={`w-2 h-2 rounded-full ${
                  message.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Contestant</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contestant Number
                </label>
                <input
                  type="number"
                  name="contestantNumber"
                  value={form.contestantNumber}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  placeholder="Enter contestant name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group
                </label>
                <select
                  name="groupName"
                  value={form.groupName}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                >
                  <option value="Ma'abariyah">Ma'abariyah</option>
                  <option value="team1">team1</option>
                  <option value="team2">team2</option>
                  <option value="team3">team3</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                >
                  <option value="subjunior">Subjunior</option>
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Upload Excel (.xlsx)
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".xlsx"
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Register Contestant
              </button>
            </div>
          </form>
        </div>

        {/* Registered Contestants Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Registered Contestants</h2>
              <p className="text-gray-600 mt-1">{contestants.length} contestants registered</p>
            </div>
          </div>

          {contestants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No contestants yet</h3>
              <p className="text-gray-600">Register your first contestant to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contestants.map((contestant) => (
                <div
                  key={contestant._id}
                  className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                      <User className="w-4 h-4 text-white" />
                      <div className="text-white text-xs font-semibold mt-1">
                        {contestant.groupName.toUpperCase()}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      #{contestant.contestantNumber}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {contestant.name}
                    </h3>
                    <p className="text-gray-600 text-sm">Group: {contestant.groupName}</p>
                    <p className="text-gray-600 text-sm">
                      Category:{" "}
                      {contestant.category
                        ? contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1)
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDelete(contestant._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete Contestant"
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
    </div>
  );
}