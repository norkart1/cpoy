"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Share2, Edit3, Users, Award, Calendar, Tag, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ContestantList from "@/components/ContestantsList";
import Link from "next/link";
import UserSidebar from "@/components/userSidebar";


import { signOut } from "next-auth/react";


export default function AddItem() {
const router = useRouter();
  const { data: session, status } = useSession();

  const allowedTeams = ["QUDWATHULULAMA", "SUHBATHUSSADATH","NUSRATHULUMARA"];

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !allowedTeams.includes(session.user.name)) {
      router.push("/team-login");
    } else {
      setTeamName(session.user.teamName || "");
    }
  }, [session, status, router]);



  const [formItems, setFormItems] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [showJuryModal, setShowJuryModal] = useState(false);
  const [juries, setJuries] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [contestants, setContestants] = useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");


  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session) {
      router.push("/team-login");
    } else {
      setTeamName(session.user.teamName || "");
    }
  }, [session, status, router]);

  useEffect(() => {


    const fetchCreatedItems = async () => {
      try {
        const res = await fetch("/api/admin/items/list");
        const data = await res.json();
        if (data.success) setCreatedItems(data.items);
        else setMessage({ type: "error", text: "Failed to fetch items." });
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setMessage({ type: "error", text: "Server error fetching items." });
      }
    };

    fetchCreatedItems();
    addForm();
    // listContestants()
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/team-login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  const addForm = () => {
    setFormItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", category: "", type: "", stage: "" },
    ]);
  };

  const handleChange = (id, field, value) => {
    setFormItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (item) => {
    const { name, category, type, stage } = item;

    if (!name || !category || !type || !stage) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    try {
      const response = await axios.post("/api/admin/items/add", item);
      if (response.data.success) {
        setMessage({ type: "success", text: "Item added successfully!" });
        setCreatedItems((prev) => [
          ...prev,
          { ...item, _id: response.data.itemId || Date.now().toString() },
        ]);
        setFormItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setMessage({ type: "error", text: response.data.message || "Failed to add item." });
      }
    } catch (error) {
      console.error("Axios error:", error);
      setMessage({ type: "error", text: "Server error. Try again." });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await axios.post(`/api/admin/items/${id}/delete`);
      if (response.data.success) {
        setCreatedItems((prev) => prev.filter((item) => item._id !== id));
        setMessage({ type: "success", text: "Item deleted successfully." });
      } else {
        setMessage({ type: "error", text: response.data.message || "Failed to delete item." });
      }
    } catch (error) {
      console.error("Axios error:", error);
      setMessage({ type: "error", text: "Server error. Try again." });
    }
  };


  const getCategoryIcon = (category) => {
    switch (category) {
      case "senior":
        return <Award className="w-4 h-4" />;
      case "junior":
        return <Users className="w-4 h-4" />;
      case "subjunior":
        return <Tag className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "senior":
        return "bg-gradient-to-r from-purple-500 to-indigo-600";
      case "junior":
        return "bg-gradient-to-r from-blue-500 to-cyan-600";
      case "subjunior":
        return "bg-gradient-to-r from-green-500 to-teal-600";
      case "general(individual)":
        return "bg-gradient-to-r from-orange-500 to-red-600";
      case "general(group)":
        return "bg-gradient-to-r from-pink-500 to-rose-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600";
    }
  };

  const filteredItems = createdItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = searchCategory === "all" || item.category === searchCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <UserSidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="sm:px-6 lg:px-8 py-8">
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

          {/* <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
              Contestants {groupName ? `in ${groupName}` : "List"}
            </h1>
          </div> */}

          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Active Competitions</h2>
                <p className="text-gray-600 mt-1">{filteredItems.length} competitions found</p>
              </div>

              {/* Search and Filter Section */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    type="text"
                    placeholder="Search competitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white/60 w-full sm:w-64"
                  />
                </div>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white/60 text-gray-400 px-2 "
                >
                  <option value="all" className="text-gray-600">All Categories</option>
                  <option value="senior" className="text-gray-600">Senior</option>
                  <option value="junior" className="text-gray-600">Junior</option>
                  <option value="subjunior" className="text-gray-600">Sub Junior</option>
                  <option value="general(individual)" className="text-gray-600">General (Individual)</option>
                  <option value="general(group)" className="text-gray-600">General (Group)</option>
                </select>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No competitions found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 px-3 rounded-md ${getCategoryColor(item.category)} shadow-lg flex items-center gap-2`}>
                        {getCategoryIcon(item.category)}
                        <div className="text-white text-xs font-semibold">
                          {item.category.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {item.type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${item.stage === "stage" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          {item.stage === "stage" ? "On Stage" : "Off Stage"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.category.replace(/\(.*\)/, "").replace(/([a-z])([A-Z])/g, "$1 $2")} • Type {item.type}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => router.push(`/team-panel/items/${item._id}`)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        View
                      </button>

                      {teamName === "admin" &&
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Competition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>}

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
