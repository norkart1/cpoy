// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import { motion } from "framer-motion";

// export default function ScanContestantPage() {
//   const { contestantNumber } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!contestantNumber) return;
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/api/scan/${contestantNumber}`);
//         setData(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [contestantNumber]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const { contestant, items } = data;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto"
//       >
//         {/* Contestant Card */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//           <h1 className="text-3xl font-bold text-indigo-700 mb-2">
//             {contestant.name || "Contestant"}
//           </h1>
//           <p className="text-lg text-gray-600">
//             Contestant Number:{" "}
//             <span className="font-semibold">{contestant.contestantNumber}</span>
//           </p>
//         </div>

//         {/* Items Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <h2 className="text-2xl font-semibold text-gray-800 p-6">Registered Events</h2>
//           {items.length === 0 ? (
//             <p className="text-gray-600 p-6">No events registered.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {items.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(item.date).toLocaleDateString("en-GB")} ({item.day})
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.timeRange?.start && item.timeRange?.end
//                           ? `${item.timeRange.start} - ${item.timeRange.end}`
//                           : "TBA"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.stage}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { User, Calendar, Clock, MapPin, Tag, QrCode, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function ScanContestantPage() {
  const { contestantNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contestantNumber) {
      setError("Missing contestant number");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/scan/${contestantNumber}`);
        console.log('Scan API Response:', res.data); // Debug
        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to fetch data");
        }
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contestantNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Loading contestant data...</h3>
            <p className="text-sm text-gray-600">Please wait while we fetch the information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No data found</h3>
          <p className="text-sm text-gray-600">Please check the contestant number and try again</p>
        </div>
      </div>
    );
  }

  const { contestant, items } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Contestant Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-indigo-100 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contestant.name || "Contestant"}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <QrCode className="w-4 h-4" />
                Contestant Number: <span className="font-semibold">{contestant.contestantNumber}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Registered Programs</h2>
            </div>
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No programs registered.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4 text-left">Event</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Stage</th>
                      <th className="py-3 px-4 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-indigo-100 hover:bg-indigo-50/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {item.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(item.date).toLocaleDateString('en-GB')} ({item.day})
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {item.timeRange?.start && item.timeRange?.end
                              ? `${item.timeRange.start} - ${item.timeRange.end}`
                              : 'TBA'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{item.stage}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}