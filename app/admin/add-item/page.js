// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Plus, Trash2, Share2, Edit3, Users, Award, Calendar, Tag, Eye } from "lucide-react";
// import { useRouter } from "next/navigation";
// import AdminSidebar from '@/components/adminSidebar';
// export default function AddItem() {

//   const [formItems, setFormItems] = useState([]);
//   const [createdItems, setCreatedItems] = useState([]);
//   const [message, setMessage] = useState(null);
//   const [showJuryModal, setShowJuryModal] = useState(false);
//   const [juries, setJuries] = useState([]);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchCreatedItems = async () => {
//       try {
//         const res = await fetch("/api/admin/items/list");
//         const data = await res.json();
//         if (data.success) setCreatedItems(data.items);
//         else setMessage({ type: "error", text: "Failed to fetch items." });
//       } catch (error) {
//         console.error("Failed to fetch items:", error);
//         setMessage({ type: "error", text: "Server error fetching items." });
//       }
//     };

//     fetchCreatedItems();
//     addForm();
//   }, []);

//   const addForm = () => {
//     setFormItems((prev) => [
//       ...prev,
//       { id: Date.now(), name: "", category: "", type: "", stage: "" },
//     ]);
//   };

//   const handleChange = (id, field, value) => {
//     setFormItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
//     );
//   };

//   const handleSave = async (item) => {
//     const { name, category, type, stage } = item;

//     if (!name || !category || !type || !stage) {
//       setMessage({ type: "error", text: "Please fill all required fields." });
//       return;
//     }

//     try {
//       const response = await axios.post("/api/admin/items/add", item);
//       if (response.data.success) {
//         setMessage({ type: "success", text: "Item added successfully!" });
//         setCreatedItems((prev) => [
//           ...prev,
//           { ...item, _id: response.data.itemId || Date.now().toString() },
//         ]);
//         setFormItems((prev) => prev.filter((i) => i.id !== item.id));
//       } else {
//         setMessage({ type: "error", text: response.data.message || "Failed to add item." });
//       }
//     } catch (error) {
//       console.error("Axios error:", error);
//       setMessage({ type: "error", text: "Server error. Try again." });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this item?")) return;

//     try {
//       const response = await axios.post(`/api/admin/items/${id}/delete`);
//       if (response.data.success) {
//         setCreatedItems((prev) => prev.filter((item) => item._id !== id));
//         setMessage({ type: "success", text: "Item deleted successfully." });
//       } else {
//         setMessage({ type: "error", text: response.data.message || "Failed to delete item." });
//       }
//     } catch (error) {
//       console.error("Axios error:", error);
//       setMessage({ type: "error", text: "Server error. Try again." });
//     }
//   };

//   const handleShare = async (itemId) => {
//     try {
//       const res = await axios.get("/api/admin/juries/list");
//       if (res.data.success) {
//         setJuries(res.data.juries);
//         setSelectedItemId(itemId);
//         setShowJuryModal(true);
//       } else {
//         setMessage({ type: "error", text: res.data.message || "Failed to fetch juries." });
//       }
//     } catch (error) {
//       console.error("Error fetching juries:", error);
//       setMessage({ type: "error", text: "Server error fetching juries." });
//     }
//   };

//   const shareWithJury = async (itemId, juryId) => {
//     try {
//       const res = await axios.post("/api/admin/juries/assign", { itemId, juryId });
//       if (res.data.success) {
//         setMessage({ type: "success", text: `Item successfully assigned to jury!` });
//         setShowJuryModal(false);
//       } else {
//         setMessage({ type: "error", text: res.data.message || "Failed to assign item." });
//       }
//     } catch (error) {
//       console.error("Error assigning jury:", error);
//       setMessage({ type: "error", text: "Server error while assigning jury." });
//     }
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case "senior":
//         return <Award className="w-4 h-4" />;
//       case "junior":
//         return <Users className="w-4 h-4" />;
//       case "subjunior":
//         return <Tag className="w-4 h-4" />;
//       default:
//         return <Calendar className="w-4 h-4" />;
//     }
//   };

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case "senior":
//         return "bg-gradient-to-r from-purple-500 to-indigo-600";
//       case "junior":
//         return "bg-gradient-to-r from-blue-500 to-cyan-600";
//       case "subjunior":
//         return "bg-gradient-to-r from-green-500 to-teal-600";
//       case "general(individual)":
//         return "bg-gradient-to-r from-orange-500 to-red-600";
//       case "general(group)":
//         return "bg-gradient-to-r from-pink-500 to-rose-600";
//       default:
//         return "bg-gradient-to-r from-gray-500 to-slate-600";
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <AdminSidebar />
//       <main className='flex-1'>
//       {/* Header Section */}
//       <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
//         <div className="px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Competition Manager
//               </h1>
//               <p className="text-gray-600 mt-1">Create and manage fest competitions</p>
//             </div>
//             <button
//               onClick={addForm}
//               className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//             >
//               <Plus className="w-5 h-5" />
//               Add New Item
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="px-4 sm:px-6 lg:px-8 py-8">
//         {/* Alert Message */}
//         {message && (
//           <div
//             className={`mb-8 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl ${
//               message.type === "success"
//                 ? "bg-green-500/10 text-green-700 border border-green-200/50"
//                 : "bg-red-500/10 text-red-700 border border-red-200/50"
//             }`}
//             onClick={() => setMessage(null)}
//           >
//             <div className="flex items-center gap-3">
//               <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
//               <span className="font-medium">{message.text}</span>
//               <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
//             </div>
//           </div>
//         )}

//         {/* Form Section */}
//         {formItems.length > 0 && (
//           <div className="mb-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Competition</h2>
//             <div className="space-y-6">
//               {formItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700">Competition Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter competition name"
//                         value={item.name}
//                         onChange={(e) => handleChange(item.id, "name", e.target.value)}
//                         className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700">Category</label>
//                       <select
//                         value={item.category}
//                         onChange={(e) => handleChange(item.id, "category", e.target.value)}
//                         className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
//                       >
//                         <option value="">Select Category</option>
//                         <option value="subjunior">Sub Junior</option>
//                         <option value="junior">Junior</option>
//                         <option value="senior">Senior</option>
//                         <option value="general(individual)">General (Individual)</option>
//                         <option value="general(group)">General (Group)</option>
//                       </select>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700">Type</label>
//                       <select
//                         value={item.type}
//                         onChange={(e) => handleChange(item.id, "type", e.target.value)}
//                         className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transitionw-colors bg-white/50 backdrop-blur-sm text-gray-700"
//                       >
//                         <option value="">Select Type</option>
//                         <option value="A">Type A</option>
//                         <option value="B">Type B</option>
//                       </select>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700">Stage</label>
//                       <select
//                         value={item.stage}
//                         onChange={(e) => handleChange(item.id, "stage", e.target.value)}
//                         className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
//                       >
//                         <option value="">Select Stage</option>
//                         <option value="stage">On Stage</option>
//                         <option value="offstage">Off Stage</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       onClick={() => handleSave(item)}
//                       className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//                     >
//                       Save Competition
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Created Items Section */}
//         <div>
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Active Competitions</h2>
//               <p className="text-gray-600 mt-1">{createdItems.length} competitions created</p>
//             </div>
//           </div>

//           {createdItems.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Award className="w-12 h-12 text-indigo-500" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">No competitions yet</h3>
//               <p className="text-gray-600">Create your first competition to get started</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {createdItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className={`p-3 rounded-2xl ${getCategoryColor(item.category)} shadow-lg`}>
//                       {getCategoryIcon(item.category)}
//                       <div className="text-white text-xs font-semibold mt-1">
//                         {item.category.toUpperCase()}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
//                         {item.type}
//                       </span>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           item.stage === "stage" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
//                         }`}
//                       >
//                         {item.stage === "stage" ? "On Stage" : "Off Stage"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
//                       {item.name}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       {item.category.replace(/\(.*\)/, "").replace(/([a-z])([A-Z])/g, "$1 $2")} • Type {item.type}
//                     </p>
//                   </div>

//                   <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                     <button
//                       onClick={() => router.push(`/admin/items/${item._id}`)}
//                       className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
//                     >
//                       <Eye className="w-4 h-4" />
//                       VIEW
//                     </button>

//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleShare(item._id)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
//                         title="Share with Jury"
//                       >
//                         <Share2 className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item._id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
//                         title="Delete Competition"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Jury Selection Modal */}
//       {showJuryModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
//             <h3 className="text-xl font-bold text-gray-800 mb-6">Assign to Jury Member</h3>

//             {juries.length === 0 ? (
//               <p className="text-gray-600 text-center py-8">No jury members available.</p>
//             ) : (
//               <div className="space-y-3 max-h-64 overflow-auto mb-6">
//                 {juries.map((jury) => (
//                   <div
//                     key={jury._id}
//                     onClick={() => shareWithJury(selectedItemId, jury._id)}
//                     className="p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
//                         {jury.username ? jury.username.split(" ").map((n) => n[0]).join("") : "N/A"}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
//                           {jury.username || "Unknown"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex gap-3 pt-4 border-t border-gray-200">
//               <button
//                 onClick={() => setShowJuryModal(false)}
//                 className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Share2, Edit3, Users, Award, Calendar, Tag, Eye, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/adminSidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function AddItem() {
  const [formItems, setFormItems] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [juries, setJuries] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showJuryModal, setShowJuryModal] = useState(false);
  const [itemSchedules, setItemSchedules] = useState({}); // Store schedules per item
  const router = useRouter();

  const validDays = ['തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി', 'ഞായർ'];

  useEffect(() => {
    const fetchCreatedItems = async () => {
      try {
        const res = await fetch('/api/admin/items/list');
        const data = await res.json();
        if (data.success) {
          setCreatedItems(data.items);
          // Initialize schedules
          const schedules = data.items.reduce((acc, item) => {
            acc[item._id] = {
              date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
              day: item.day || '',
              startTime: item.timeRange?.start || '',
              endTime: item.timeRange?.end || '',
            };
            return acc;
          }, {});
          setItemSchedules(schedules);
        } else {
          toast.error('Failed to fetch items.');
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
        toast.error('Server error fetching items.');
      }
    };

    fetchCreatedItems();
    addForm();
  }, []);

  const addForm = () => {
    setFormItems((prev) => [
      ...prev,
      { id: Date.now(), name: '', category: '', type: '', stage: '' },
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
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      const response = await axios.post('/api/admin/items/add', item);
      if (response.data.success) {
        toast.success('Item added successfully!');
        setCreatedItems((prev) => [
          ...prev,
          { ...item, _id: response.data.itemId || Date.now().toString() },
        ]);
        setFormItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        toast.error(response.data.message || 'Failed to add item.');
      }
    } catch (error) {
      console.error('Axios error:', error);
      toast.error('Server error. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await axios.post(`/api/admin/items/${id}/delete`);
      if (response.data.success) {
        setCreatedItems((prev) => prev.filter((item) => item._id !== id));
        setItemSchedules((prev) => {
          const newSchedules = { ...prev };
          delete newSchedules[id];
          return newSchedules;
        });
        toast.success('Item deleted successfully.');
      } else {
        toast.error(response.data.message || 'Failed to delete item.');
      }
    } catch (error) {
      console.error('Axios error:', error);
      toast.error('Server error. Try again.');
    }
  };

  const handleShare = async (itemId) => {
    try {
      const res = await axios.get('/api/admin/juries/list');
      if (res.data.success) {
        setJuries(res.data.juries);
        setSelectedItemId(itemId);
        setShowJuryModal(true);
      } else {
        toast.error(res.data.message || 'Failed to fetch juries.');
      }
    } catch (error) {
      console.error('Error fetching juries:', error);
      toast.error('Server error fetching juries.');
    }
  };

  const shareWithJury = async (itemId, juryId) => {
    try {
      const res = await axios.post('/api/admin/juries/assign', { itemId, juryId });
      if (res.data.success) {
        toast.success('Item successfully assigned to jury!');
        setShowJuryModal(false);
      } else {
        toast.error(res.data.message || 'Failed to assign item.');
      }
    } catch (error) {
      console.error('Error assigning jury:', error);
      toast.error('Server error while assigning jury.');
    }
  };

  const handleScheduleChange = (itemId, field, value) => {
    console.log('Updating schedule for itemId:', itemId, 'field:', field, 'value:', value);
    if (field === 'day' && value && !validDays.includes(value)) {
      toast.error('Invalid day. Please select a valid weekday.');
      return;
    }
    setItemSchedules((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleSaveSchedule = async (itemId) => {
    console.log('Saving schedule for itemId:', itemId, 'schedule:', itemSchedules[itemId]);
    const schedule = itemSchedules[itemId];
    if (!schedule?.date || !schedule?.day || !schedule?.startTime || !schedule?.endTime) {
      toast.error('All schedule fields are required.');
      return;
    }

    if (!validDays.includes(schedule.day)) {
      toast.error('Invalid day. Please select a valid weekday (e.g., Monday).');
      return;
    }

    try {
      const response = await axios.put(`/api/admin/items/${itemId}/schedule`, {
        date: schedule.date,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
      if (response.data.success) {
        toast.success('Schedule saved successfully!');
      } else {
        toast.error(response.data.message || 'Failed to save schedule.');
      }
    } catch (error) {
      console.error('Save schedule error:', error);
      toast.error('Server error. Please try again.');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'senior':
        return <Award className="w-4 h-4" />;
      case 'junior':
        return <Users className="w-4 h-4" />;
      case 'subjunior':
        return <Tag className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'senior':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600';
      case 'junior':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'subjunior':
        return 'bg-gradient-to-r from-green-500 to-teal-600';
      case 'general(individual)':
        return 'bg-gradient-to-r from-orange-500 to-red-600';
      case 'general(group)':
        return 'bg-gradient-to-r from-pink-500 to-rose-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Competition Manager
                </h1>
                <p className="text-gray-600 mt-1">Create and manage fest competitions</p>
              </div>
              <button
                onClick={addForm}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add New Item
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Form Section */}
          {formItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Competition</h2>
              <div className="space-y-6">
                {formItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Competition Name</label>
                        <input
                          type="text"
                          placeholder="Enter competition name"
                          value={item.name}
                          onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
                        >
                          <option value="">Select Category</option>
                          <option value="subjunior">Sub Junior</option>
                          <option value="junior">Junior</option>
                          <option value="senior">Senior</option>
                          <option value="general(individual)">General (Individual)</option>
                          <option value="general(group)">General (Group)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => handleChange(item.id, 'type', e.target.value)}
                          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
                        >
                          <option value="">Select Type</option>
                          <option value="A">Type A</option>
                          <option value="B">Type B</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Stage</label>
                        <select
                          value={item.stage}
                          onChange={(e) => handleChange(item.id, 'stage', e.target.value)}
                          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm text-gray-700"
                        >
                          <option value="">Select Stage</option>
                          <option value="stage">On Stage</option>
                          <option value="offstage">Off Stage</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave(item)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        Save Competition
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Created Items Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Active Competitions</h2>
                <p className="text-gray-600 mt-1">{createdItems.length} competitions created</p>
              </div>
            </div>

            {createdItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No competitions yet</h3>
                <p className="text-gray-600">Create your first competition to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdItems.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex"
                  >

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${getCategoryColor(item.category)} shadow-lg`}>
                          {getCategoryIcon(item.category)}
                          <div className="text-white text-xs font-semibold mt-1">
                            {item.category.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {item.type}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.stage === 'stage' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}
                          >
                            {item.stage === 'stage' ? 'On Stage' : 'Off Stage'}
                          </span>
                        </div>
                      </div>





                      <div className="flex flex-col md:flex-row gap-6 p-4 rounded-xl bg-white/50 shadow-sm border border-gray-200 capitalize">
                        {/* Left Column: Item Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.category.replace(/\(.*\)/, '').replace(/([a-z])([A-Z])/g, '$1 $2')} • Type {item.type}
                          </p>
                        </div>

                        {/* Right Column: Schedule Form */}
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                            <input
                              type="date"
                              value={itemSchedules[item._id]?.date || ''}
                              onChange={(e) => handleScheduleChange(item._id, 'date', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 bg-white/10 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all text-sm"
                              aria-label={`Select date for item ${item.name}`}
                            />
                          </div>

                          <div className="relative">
                            <select
                              value={itemSchedules[item._id]?.day || ''}
                              onChange={(e) => handleScheduleChange(item._id, 'day', e.target.value)}
                              className="w-full pl-3 pr-3 py-2 bg-white/10 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all text-sm"
                              aria-label={`Select day for item ${item.name}`}
                            >
                              <option value="">Select Day</option>
                              {validDays.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                              <input
                                type="time"
                                value={itemSchedules[item._id]?.startTime || ''}
                                onChange={(e) => handleScheduleChange(item._id, 'startTime', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all text-sm"
                                aria-label={`Select start time for item ${item.name}`}
                              />
                            </div>
                            <div className="relative flex-1">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                              <input
                                type="time"
                                value={itemSchedules[item._id]?.endTime || ''}
                                onChange={(e) => handleScheduleChange(item._id, 'endTime', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all text-sm"
                                aria-label={`Select end time for item ${item.name}`}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleSaveSchedule(item._id)}

                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                          >
                            {itemSchedules[item._id]?.date ? 'Update' : 'Save'} Schedule
                          </button>
                        </div>
                      </div>






                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={() => router.push(`/admin/items/${item._id}`)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          VIEW
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShare(item._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Share with Jury"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Competition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>



                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Jury Selection Modal */}
        {showJuryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Assign to Jury Member</h3>

              {juries.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No jury members available.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-auto mb-6">
                  {juries.map((jury) => (
                    <div
                      key={jury._id}
                      onClick={() => shareWithJury(selectedItemId, jury._id)}
                      className="p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {jury.username ? jury.username.split(' ').map((n) => n[0]).join('') : 'N/A'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {jury.username || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowJuryModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}