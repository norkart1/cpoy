// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Users, CheckCircle, AlertCircle, Lock } from "lucide-react";

// export default function CreateTeamForm() {
//   const [teamName, setTeamName] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState(null);

//   const handleCreateTeam = async (e) => {
//     e.preventDefault();
//     setMessage(null);

//     try {
//       const res = await axios.post("/api/admin/create-team", { teamName, password });
//       if (res.status === 201) {
//         setMessage({ type: "success", text: res.data.message });
//         setTeamName("");
//         setPassword("");
//       } else {
//         setMessage({ type: "error", text: res.data.error });
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage({
//         type: "error",
//         text: error.response?.data?.error || "Failed to create team",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 p-4">
//       <div className="relative w-full max-w-md">
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-center">
//             <div className="flex justify-center mb-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-white mb-1">Create New Team</h2>
//             <p className="text-blue-100 text-sm">Enter credentials to register a team</p>
//           </div>

//           {/* Form Body */}
//           <div className="px-8 py-6">
//             {message && (
//               <div
//                 className={`mb-6 p-4 rounded-lg flex items-center space-x-3 text-sm ${
//                   message.type === "success"
//                     ? "bg-green-50 border border-green-200 text-green-800"
//                     : "bg-red-50 border border-red-200 text-red-800"
//                 }`}
//               >
//                 {message.type === "success" ? (
//                   <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//                 ) : (
//                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//                 )}
//                 <p>{message.text}</p>
//               </div>
//             )}

//             <form onSubmit={handleCreateTeam} className="space-y-5">
//               {/* Team Name */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Team Name
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                     className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="Enter team name"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="Enter password"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
//               >
//                 Create Team
//               </button>
//             </form>
//           </div>

//           <div className="text-center pb-4 text-xs text-gray-500">
//             Admin panel – secure team creation
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, CheckCircle, AlertCircle, Lock, Pencil, Save, X } from "lucide-react";
import AdminSidebar from '@/components/adminSidebar';

export default function CreateTeamForm() {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [teams, setTeams] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editPass, setEditPass] = useState("");

  useEffect(() => {
    fetchTeams();
  }, [message]);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/admin/create-team");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams");
    }
  };

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
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to create team",
      });
    }
  };

  const updateTeam = async (id) => {
    try {
      const res = await axios.put("/api/admin/create-team", {
        id,
        newTeamName: null, // don't update name
        newPassword: editPass,
      });
      if (res.status === 200) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setEditingTeamId(null);
      } else {
        setMessage({ type: "error", text: "Update failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating team" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10">
        {/* Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10">
          {teams.map((team) => (
            <div key={team._id} className="bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                <Users className="inline-block w-5 h-5 mr-2 text-indigo-600" />
                {team.teamName}
              </h2>
              {editingTeamId === team._id ? (
                <>
                  <label className="block text-sm text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={editPass}
                    onChange={(e) => setEditPass(e.target.value)}
                    className="w-full text-gray-500 px-3 py-2 border border-gray-300 rounded-lg mb-2 bg-gray-50"
                  />
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button
                      onClick={() => updateTeam(team._id)}
                      className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingTeamId(null)}
                      className="w-full sm:w-auto text-red-500 hover:underline text-sm flex items-center justify-center gap-1"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingTeamId(team._id);
                    setEditPass("");
                  }}
                  className="mt-2 text-sm text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Pencil size={16} /> Change Password
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Create Form */}
        <div className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 sm:px-8 py-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create New Team</h2>
            <p className="text-blue-100 text-sm">Enter credentials to register a team</p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 text-sm ${message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
                  }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleCreateTeam} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-500 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all"
              >
                Create Team
              </button>
            </form>
          </div>

          <div className="text-center pb-4 text-xs text-gray-500">
            Admin panel – secure team creation
          </div>
        </div>
      </main>
    </div>


  );
}

