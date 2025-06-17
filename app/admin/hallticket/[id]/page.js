// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function HallTicket() {
//   const { id } = useParams(); // ✅ useParams for App Router
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (!id) return;
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/api/admin/hallticket/${id}`);
//         setData(res.data);
//       } catch (error) {
//         console.error("Error fetching hall ticket:", error);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (!data) {
//     return <div className="text-center py-20 text-gray-600">Loading...</div>;
//   }

//   const { contestant, programs } = data;

//   return (
//     <div className="max-w-3xl mx-auto my-12 p-8 bg-white shadow-xl rounded-3xl border border-gray-200 print:border-0">
//       <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">Fest Hall Ticket</h1>
      
//       <div className="text-gray-700 space-y-2 mb-6">
//         <p><strong>Name:</strong> {contestant.name}</p>
//         <p><strong>Contestant Number:</strong> #{contestant.contestantNumber}</p>
//         <p><strong>Group:</strong> {contestant.groupName}</p>
//         <p><strong>Category:</strong> {contestant.category}</p>
//       </div>

//       <h2 className="text-xl font-semibold text-purple-700 mb-2">Participated Programs</h2>
//       <ul className="list-disc list-inside space-y-1">
//         {programs && programs.length > 0 ? (
//           programs.map((p, i) => (
//             <li key={i}>
//               <span className="font-medium">{p.name}</span> – {p.category}
//             </li>
//           ))
//         ) : (
//           <li className="text-gray-500">No programs assigned</li>
//         )}
//       </ul>

//       <div className="mt-8 text-center">
//         <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
//           Print Hall Ticket
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HallTicket() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/admin/hallticket/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching hall ticket:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  const { contestant, programs } = data;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 print:bg-white">
      <div className="max-w-lg w-full mx-4 my-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 print:shadow-none print:border-none print:m-0">
        {/* Header with subtle gradient accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl"></div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mt-4 mb-6">
            Fest Hall Ticket
          </h1>
        </div>

        {/* Participant Details */}
        <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{contestant.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Contestant Number:</span>
            <span className="text-gray-900">#{contestant.contestantNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Group:</span>
            <span className="text-gray-900">{contestant.groupName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Category:</span>
            <span className="text-gray-900">{contestant.category}</span>
          </div>
        </div>

        {/* Programs List */}
        <h2 className="text-xl font-bold text-indigo-600 mb-3">Participated Programs</h2>
        <ul className="space-y-3">
          {programs && programs.length > 0 ? (
            programs.map((p, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <span className="font-medium text-gray-800">{p.name}</span>
                <span className="text-sm text-gray-600">{p.category}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No programs assigned</li>
          )}
        </ul>

        {/* Print Button */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Print Hall Ticket
          </button>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 1cm !important;
          }
          .shadow-2xl {
            box-shadow: none !important;
          }
          .border {
            border: none !important;
          }
          .rounded-2xl {
            border-radius: 0 !important;
          }
          .bg-gray-100 {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}