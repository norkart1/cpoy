"use client";

// eslint-disable react/no-unescaped-entities
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, User, Users, FileText } from "lucide-react";
import AdminSidebar from '@/components/adminSidebar';

export default function ContestantRegistration() {
  const [form, setForm] = useState({
    contestantNumber: "",
    name: "",
    groupName: "Ma'abariyah", // this line is now safe
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
        groupName: "QudwathulUlama",
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <main className='flex-1 p-6 md:p-10'>
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
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

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <div
                  className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"
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
                    <option value="QUDWATHULULAMA">QUDWATHUL ULAMA</option>
                    <option value="SUHBATHUSSADATH">SUHBATHU SSADATH</option>
                    <option value="NUSRATHULUMARA">NUSRATHUL UMARA</option>
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

          {/* Registered Contestants Table */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Registered Contestants</h2>
                <p className="text-sm text-gray-600">{contestants.length} contestants registered</p>
              </div>
            </div>

            {contestants.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No contestants yet</h3>
                <p className="text-gray-600">Register your first contestant to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-indigo-100 text-indigo-700 uppercase text-xs font-semibold">
                    <tr>
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Group</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contestants.map((contestant, idx) => (
                      <tr
                        key={contestant._id}
                        className="border-b border-gray-100 hover:bg-indigo-50/30 transition-all"
                      >
                        <td className="py-3 px-4 font-semibold text-indigo-600">#{contestant.contestantNumber}</td>
                        <td className="py-3 px-4 font-medium">{contestant.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-indigo-200 text-indigo-800 rounded-lg">
                            {contestant.groupName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full capitalize">
                            {contestant.category || "Not specified"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(contestant._id)}
                            className="text-red-600 hover:text-red-800 hover:scale-110 transition-all"
                            title="Delete Contestant"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}