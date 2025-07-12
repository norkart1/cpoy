// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Search, UserPlus, Trash2, User } from "lucide-react";
// import AdminSidebar from "@/components/adminSidebar";

// export default function ManageItemPage() {
//     const params = useParams();
//     const itemId = params.id;
//     const [searchQuery, setSearchQuery] = useState("");
//     const [contestants, setContestants] = useState([]);
//     const [participants, setParticipants] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//     const [itemName, setItemName] = useState("");

//     const handleSearch = async (query) => {
//         setSearchQuery(query);
//         if (!query) {
//             setContestants([]);
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await fetch(`/api/admin/contestants/search?q=${encodeURIComponent(query)}`);
//             if (!res.ok) {
//                 setContestants([]);
//                 setMessage({ type: "error", text: "Failed to search contestants." });
//                 return;
//             }
//             const data = await res.json();
//             setContestants(data || []);
//             setMessage(null);
//         } catch (err) {
//             console.error("Search error:", err);
//             setContestants([]);
//             setMessage({ type: "error", text: "Server error searching contestants." });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchParticipants = async () => {
//         try {
//             const res = await fetch(`/api/admin/items/${itemId}/participants`);
//             const data = await res.json();

//             if (res.ok && data.success) {
//                 setParticipants(Array.isArray(data.participants) ? data.participants : []);
//                 setItemName(data.itemName || "Untitled Item");
//             } else {
//                 setParticipants([]);
//                 setItemName("Unknown Item");
//                 setMessage({ type: "error", text: data.message || "Failed to fetch participants." });
//             }
//         } catch (err) {
//             console.error("Failed to fetch participants:", err);
//             setParticipants([]);
//             setItemName("Error");
//             setMessage({ type: "error", text: "Server error fetching participants." });
//         }
//     };

//     const addContestant = async (contestantId) => {
//         try {
//             const res = await fetch("/api/admin/items/add-contestant", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ itemId, contestantId }),
//             });
//             const result = await res.json();
//             if (result.success) {
//                 setMessage({ type: "success", text: "Contestant added successfully!" });
//                 fetchParticipants();
//                 setSearchQuery("");
//                 setContestants([]);
//             } else {
//                 setMessage({ type: "error", text: result.message || "Failed to add contestant." });
//             }
//         } catch (err) {
//             setMessage({ type: "error", text: "Server error adding contestant." });
//         }
//     };

//     const deleteContestant = async (contestantId) => {
//         if (!confirm("Are you sure you want to delete this contestant?")) return;

//         try {
//             const res = await fetch(`/api/admin/items/${itemId}/participants/${contestantId}`, {
//                 method: "DELETE",
//             });
//             const result = await res.json();
//             if (result.success) {
//                 setMessage({ type: "success", text: "Contestant deleted successfully." });
//                 fetchParticipants();
//             } else {
//                 setMessage({ type: "error", text: result.message || "Failed to delete contestant." });
//             }
//         } catch (err) {
//             setMessage({ type: "error", text: "Server error deleting contestant." });
//         }
//     };

//     useEffect(() => {
//         if (itemId) {
//             fetchParticipants();
//         }
//     }, [itemId]);

//     return (
//         <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//             <AdminSidebar />
//             <main className="flex-1 p-6 md:p-10">
//                 {/* Header Section */}
//                 <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
//                     <div className="px-4 sm:px-6 lg:px-8 py-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-gray-600 mt-1">Competition ID: {itemName}</p>
//                             </div>
//                             <button
//                                 onClick={() => {
//                                     setSearchQuery("");
//                                     setContestants([]);
//                                 }}
//                                 className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 <Search className="w-5 h-5" />
//                                 Clear Search
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="px-4 sm:px-6 lg:px-8 py-8">
//                     {/* Alert Message */}
//                     {message && (
//                         <div
//                             className={`mb-8 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${message.type === "success"
//                                 ? "bg-green-500/10 text-green-700 border border-green-200/50"
//                                 : "bg-red-500/10 text-red-700 border border-red-200/50"
//                                 }`}
//                             onClick={() => setMessage(null)}
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
//                                 <span className="font-medium">{message.text}</span>
//                                 <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
//                             </div>
//                         </div>
//                     )}

//                     {/* Add Contestant Section */}
//                     <div className="mb-12">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Contestant</h2>
//                         <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
//                             <div className="space-y-2 mb-6">
//                                 <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                                     <Search className="w-4 h-4" />
//                                     Search Contestants
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="Search by name or contestant number..."
//                                     value={searchQuery}
//                                     onChange={(e) => handleSearch(e.target.value)}
//                                     className="w-full p-4 text-gray-700 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
//                                 />
//                             </div>

//                             {/* Search Results */}
//                             <div className="space-y-3">
//                                 {loading && (
//                                     <div className="text-center text-gray-600 py-4 flex items-center gap-2 justify-center">
//                                         <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
//                                         Loading...
//                                     </div>
//                                 )}
//                                 {!loading && contestants.length === 0 && searchQuery && (
//                                     <p className="text-red-600 text-center py-4">No contestants found.</p>
//                                 )}
//                                 {!loading &&
//                                     contestants.map((contestant) => (
//                                         <div
//                                             key={contestant._id}
//                                             className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 flex justify-between items-center"
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                                                     {contestant.name ? contestant.name.split(" ").map((n) => n[0]).join("") : "N/A"}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
//                                                         {contestant.name || "Unknown"}
//                                                     </p>
//                                                     <p className="text-sm text-gray-600">#{contestant.contestantNumber || "N/A"}</p>
//                                                 </div>
//                                             </div>
//                                             <button
//                                                 onClick={() => addContestant(contestant._id)}
//                                                 className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
//                                             >
//                                                 <UserPlus className="w-4 h-4" />
//                                                 Add
//                                             </button>
//                                         </div>
//                                     ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Current Participants Section */}
//                     <div>
//                         <div className="flex items-center justify-between mb-8">
//                             <div>
//                                 <h2 className="text-2xl font-bold text-gray-800">Current Participants</h2>
//                                 <p className="text-gray-600 mt-1">{participants.length} participants</p>
//                             </div>
//                         </div>

//                         {participants.length === 0 ? (
//                             <div className="text-center py-16">
//                                 <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                                     <User className="w-12 h-12 text-indigo-500" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No participants yet</h3>
//                                 <p className="text-gray-600">Add contestants to this competition to get started.</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {participants.map((participant) => (
//                                     <div
//                                         key={participant._id}
//                                         className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
//                                     >
//                                         <div className="flex items-start justify-between mb-4">
//                                             <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
//                                                 <User className="w-4 h-4 text-white" />
//                                                 <div className="text-white text-xs font-semibold mt-1">
//                                                     #{participant.contestantNumber || "N/A"}
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-1">
//                                                 {participant.score && (
//                                                     <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
//                                                         Score: {participant.score}
//                                                     </span>
//                                                 )}
//                                                 {participant.badge && (
//                                                     <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
//                                                         {participant.badge}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="mb-6">
//                                             <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
//                                                 {participant.name || "Unknown"}
//                                             </h3>
//                                             <p className="text-gray-600 text-sm">Contestant #{participant.contestantNumber || "N/A"}</p>
//                                         </div>

//                                         <div className="flex items-center justify-end pt-4 border-t border-gray-200">
//                                             <button
//                                                 onClick={() => deleteContestant(participant._id)}
//                                                 className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
//                                                 title="Delete Contestant"
//                                             >
//                                                 <Trash2 className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>

//     );
// }




'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Search, UserPlus, Trash2, User } from 'lucide-react';
import AdminSidebar from '@/components/adminSidebar';

export default function ManageItemPage() {
  const params = useParams();
  const itemId = params.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [contestants, setContestants] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [itemName, setItemName] = useState('');

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setContestants([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contestants/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        setContestants([]);
        setMessage({ type: 'error', text: 'Failed to search contestants.' });
        return;
      }
      const data = await res.json();
      setContestants(data || []);
      setMessage(null);
    } catch (err) {
      console.error('Search error:', err);
      setContestants([]);
      setMessage({ type: 'error', text: 'Server error searching contestants.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/items/${itemId}/participants`);
      const data = await res.json();

      if (res.ok && data.success) {
        setParticipants(Array.isArray(data.participants) ? data.participants : []);
        setItemName(data.itemName || 'Untitled Item');
      } else {
        setParticipants([]);
        setItemName('Unknown Item');
        setMessage({ type: 'error', text: data.message || 'Failed to fetch participants.' });
      }
    } catch (err) {
      console.error('Failed to fetch participants:', err);
      setParticipants([]);
      setItemName('Error');
      setMessage({ type: 'error', text: 'Server error fetching participants.' });
    }
  }, [itemId, setParticipants, setItemName]);

  const addContestant = async (contestantId) => {
    try {
      const res = await fetch('/api/admin/items/add-contestant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, contestantId }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Contestant added successfully!' });
        fetchParticipants();
        setSearchQuery('');
        setContestants([]);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add contestant.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error adding contestant.' });
    }
  };

  const deleteContestant = async (contestantId) => {
    if (!confirm('Are you sure you want to delete this contestant?')) return;

    try {
      const res = await fetch(`/api/admin/items/${itemId}/participants/${contestantId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Contestant deleted successfully.' });
        fetchParticipants();
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to delete contestant.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error deleting contestant.' });
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchParticipants();
    }
  }, [itemId, fetchParticipants]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mt-1">Competition ID: {itemName}</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setContestants([]);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
                Clear Search
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Alert Message */}
          {message && (
            <div
              className={`mb-8 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-700 border border-green-200/50'
                  : 'bg-red-500/10 text-red-700 border border-red-200/50'
              }`}
              onClick={() => setMessage(null)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">{message.text}</span>
                <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
              </div>
            </div>
          )}

          {/* Add Contestant Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Contestant</h2>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Contestants
                </label>
                <input
                  type="text"
                  placeholder="Search by name or contestant number..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-4 text-gray-700 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                {loading && (
                  <div className="text-center text-gray-600 py-4 flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                    Loading...
                  </div>
                )}
                {!loading && contestants.length === 0 && searchQuery && (
                  <p className="text-red-600 text-center py-4">No contestants found.</p>
                )}
                {!loading &&
                  contestants.map((contestant) => (
                    <div
                      key={contestant._id}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {contestant.name ? contestant.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {contestant.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">#{contestant.contestantNumber || 'N/A'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addContestant(contestant._id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <UserPlus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Current Participants Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Current Participants</h2>
                <p className="text-gray-600 mt-1">{participants.length} participants</p>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No participants yet</h3>
                <p className="text-gray-600">Add contestants to this competition to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participants.map((participant) => (
                  <div
                    key={participant._id}
                    className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                        <div className="text-white text-xs font-semibold mt-1">
                          #{participant.contestantNumber || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {participant.score && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Score: {participant.score}
                          </span>
                        )}
                        {participant.badge && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {participant.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {participant.name || 'Unknown'}
                      </h3>
                      <p className="text-gray-600 text-sm">Contestant #{participant.contestantNumber || 'N/A'}</p>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={() => deleteContestant(participant._id)}
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
      </main>
    </div>
  );
}