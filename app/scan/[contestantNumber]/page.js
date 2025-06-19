// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import { motion } from "framer-motion";

// export async function generateMetadata({ params }) {
//   const { contestantId } = params;
//   try {
//     const res = await axios.get(`/api/scan/${contestantId}`);
//     const { contestant } = res.data;
//     return {
//       title: `${contestant?.name || "Contestant"}'s Events | Alathurpadi Dars Fest`,
//       description: `View all events registered by contestant ${contestant?.contestantNumber || ""} at Alathurpadi Dars Fest.`,
//       openGraph: {
//         title: `${contestant?.name || "Contestant"}'s Events`,
//         description: `Events for contestant ${contestant?.contestantNumber || ""}.`,
//         url: `https://fest-automation.vercel.app/scan/${contestantId}`,
//         images: [{ url: "https://fest-automation.vercel.app/theme01-01.jpg" }],
//       },
//     };
//   } catch {
//     return {
//       title: "Contestant Events | Alathurpadi Dars Fest",
//       description: "View registered events for a contestant at Alathurpadi Dars Fest.",
//     };
//   }
// }

// export default function ScanContestantPage() {
//   const { contestantId } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!contestantId) return;
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/api/scan/${contestantId}`);
//         setData(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [contestantId]);

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
//             Contestant Number: <span className="font-semibold">{contestant.contestantNumber}</span>
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
//                         {new Date(item.date).toLocaleDateString('en-GB')} ({item.day})
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.timeRange?.start && item.timeRange?.end
//                           ? `${item.timeRange.start} - ${item.timeRange.end}`
//                           : 'TBA'}
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
import { motion } from "framer-motion";

export default function ScanContestantPage() {
  const { contestantNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contestantNumber) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/scan/${contestantNumber}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contestantNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { contestant, items } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Contestant Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            {contestant.name || "Contestant"}
          </h1>
          <p className="text-lg text-gray-600">
            Contestant Number:{" "}
            <span className="font-semibold">{contestant.contestantNumber}</span>
          </p>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-2xl font-semibold text-gray-800 p-6">Registered Events</h2>
          {items.length === 0 ? (
            <p className="text-gray-600 p-6">No events registered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString("en-GB")} ({item.day})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.timeRange?.start && item.timeRange?.end
                          ? `${item.timeRange.start} - ${item.timeRange.end}`
                          : "TBA"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.stage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
