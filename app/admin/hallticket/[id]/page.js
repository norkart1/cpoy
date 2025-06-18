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

// Enhanced QR Code component with better styling
const QrCodePlaceholder = () => (
  <svg
    className="w-32 h-32 border border-gray-300 rounded-sm"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="black"
  >
    <path d="M0 0h30v30H0z M10 10h10v10H10z M70 0h30v30H70z M80 10h10v10H80z M0 70h30v30H0z M10 80h10v10H10z M70 70h30v30H70z M40 40h20v20H40z M90 45h10v10H90z M45 90h10v10H45z M90 90h10v10H90z M70 40h10v10H70z M40 70h10v10H40z M30 45h10v10H30z M45 30h10v10H45z" />
    <path d="M40,0 L40,10 L50,10 L50,20 L60,20 L60,10 L70,10 L70,0 L60,0 L60,10 L50,10 L50,0 L40,0 Z" />
    <path d="M0,40 L10,40 L10,50 L20,50 L20,60 L10,60 L10,70 L0,70 L0,60 L10,60 L10,50 L0,50 L0,40 Z" />
    <path d="M90,40 L100,40 L100,50 L90,50 L90,60 L80,60 L80,70 L70,70 L70,80 L80,80 L80,90 L90,90 L90,100 L100,100 L100,90 L90,90 L90,80 L100,80 L100,70 L90,70 L90,60 L100,60 L100,50 L90,50 L90,40 Z" />
    <path d="M60,60 L70,60 L70,70 L60,70 L60,60 Z" />
    <path d="M40,60 L50,60 L50,70 L40,70 L40,60 Z" />
  </svg>
);

// Enhanced Program Section with better spacing and typography
const ProgramSection = ({ contestant, programs }) => (
  <div className="border-2 border-black shadow-sm">
    {/* Enhanced Competitions Table */}
    <div className="flex flex-col min-h-[18rem]">
      {/* Table Body with improved spacing and hover effects */}
      <div className="flex-grow text-black bg-white">
        {programs && programs.length > 0 ? (
          programs.map((p, i) => (
            <div
              key={i}
              className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 print:page-break-inside-avoid"
            >
              <div className="w-1/3 p-4 border-r border-gray-200 text-center text-gray-600 font-medium">
                TBA
              </div>
              <div className="w-1/3 p-4 border-r border-gray-200 text-center text-gray-600 font-medium">
                Non-Stage
              </div>
              <div className="w-1/3 p-4 text-center font-medium text-black">
                {p.name}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 p-8">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">No competitions assigned</div>
              <div className="text-sm text-gray-400">Programs will appear here when available</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function HallTicket() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/admin/hallticket/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching hall ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Enhanced loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-black mb-2">Loading Hall Ticket</div>
          <div className="text-gray-600">Please wait...</div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white border-2 border-black shadow-lg max-w-md">
          <div className="text-xl font-semibold text-black mb-2">Hall Ticket Not Found</div>
          <div className="text-gray-600">Please check your ticket ID and try again</div>
        </div>
      </div>
    );
  }

  const { contestant, programs } = data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 print:bg-white print:p-0">
      <div className="w-full max-w-4xl bg-white shadow-lg print:shadow-none border border-gray-200 print:border-none">
        {/* First Page with enhanced styling */}
        <div className="p-12 print:page">
          {/* Header Section with better spacing */}
          <div className="p-4 mb-6">
            <img
              src="/hallTicket-01.png"
              alt="Alathurpadi Dars Fest Header"
              className="w-full h-auto rounded-sm"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div
              style={{
                display: "none",
                border: "2px dashed #9CA3AF",
                padding: "2rem",
                textAlign: "center",
                fontSize: "1rem",
                color: "#6B7280",
                backgroundColor: "#F9FAFB",
                borderRadius: "4px",
              }}
            >
              Header image placeholder
            </div>
          </div>

          {/* Enhanced Title Banner */}
          <div className="border-2 border-black shadow-sm">
            <div className="bg-black text-white text-center py-3 text-xl font-bold tracking-wider">
              HALL TICKET FOR NON STAGE
            </div>

            {/* Main Details Section with improved layout */}
            <div className="flex border-b-2 border-black bg-white">
              <div className="w-2/3 flex items-center justify-center border-r-2 border-black py-8">
                <span className="text-8xl md:text-9xl font-black text-black tracking-tighter leading-none">
                  {contestant.contestantNumber}
                </span>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-black mb-1">Fest Updates Here</p>
                  <p className="text-xs text-gray-600 mb-4">Scan Me!</p>
                </div>
                <QrCodePlaceholder />
              </div>
            </div>
          </div>

          {/* Programs Section */}
          {programs && (
            <div className="mt-6">
              <ProgramSection contestant={contestant} programs={programs} />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Print Button */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-10 py-4 font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
        >
          🖨️ PRINT HALL TICKET
        </button>
      </div>

      {/* Enhanced Print-specific styles for exact web-to-PDF matching */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background: white !important;
            font-family: system-ui, -apple-system, sans-serif !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:border-none {
            border: none !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:page {
            page-break-after: always;
          }

          .print\\:page-break-inside-avoid {
            page-break-inside: avoid !important;
          }

          /* Force exact colors for PDF */
          .bg-black {
            background-color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
          }

          .text-white {
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
          }

          .text-black {
            color: #000000 !important;
          }

          .border-black {
            border-color: #000000 !important;
          }

          .bg-gray-100 {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact !important;
          }

          .bg-white {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
          }

          .border-gray-200 {
            border-color: #e5e7eb !important;
          }

          .border-gray-300 {
            border-color: #d1d5db !important;
          }

          .border-gray-400 {
            border-color: #9ca3af !important;
          }

          .text-gray-600 {
            color: #4b5563 !important;
          }

          .text-gray-500 {
            color: #6b7280 !important;
          }

          .text-gray-400 {
            color: #9ca3af !important;
          }

          /* Ensure shadows are removed in print */
          .shadow-sm,
          .shadow-lg {
            box-shadow: none !important;
          }

          /* Fix font sizes for print */
          .text-8xl {
            font-size: 6rem !important;
            line-height: 1 !important;
          }

          .text-9xl {
            font-size: 8rem !important;
            line-height: 1 !important;
          }

          /* Ensure proper spacing in print */
          .min-h-screen {
            min-height: auto !important;
          }

          /* Force table borders to show */
          .border-2 {
            border-width: 2px !important;
            border-style: solid !important;
          }

          .border {
            border-width: 1px !important;
            border-style: solid !important;
          }

          .border-r {
            border-right-width: 1px !important;
            border-right-style: solid !important;
          }

          .border-b {
            border-bottom-width: 1px !important;
            border-bottom-style: solid !important;
          }

          .border-b-2 {
            border-bottom-width: 2px !important;
            border-bottom-style: solid !important;
          }

          .border-r-2 {
            border-right-width: 2px !important;
            border-right-style: solid !important;
          }
        }

        /* Better responsive font sizing */
        @media (max-width: 768px) {
          .text-8xl {
            font-size: 4rem;
          }
          .text-9xl {
            font-size: 5rem;
          }
        }

        @media (max-width: 640px) {
          .text-8xl {
            font-size: 3rem;
          }
          .text-9xl {
            font-size: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";

// // Modern QR Code Component
// const QrCodeComponent = () => (
//   <div className="relative">
//     <svg
//       className="w-24 h-24 rounded-lg border-2 border-gray-200 bg-white p-1"
//       viewBox="0 0 100 100"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="currentColor"
//     >
//       <path d="M0 0h30v30H0z M10 10h10v10H10z M70 0h30v30H70z M80 10h10v10H80z M0 70h30v30H0z M10 80h10v10H10z M70 70h30v30H70z M40 40h20v20H40z M90 45h10v10H90z M45 90h10v10H45z M90 90h10v10H90z M70 40h10v10H70z M40 70h10v10H40z M30 45h10v10H30z M45 30h10v10H45z" />
//       <path d="M40,0 L40,10 L50,10 L50,20 L60,20 L60,10 L70,10 L70,0 L60,0 L60,10 L50,10 L50,0 L40,0 Z" />
//       <path d="M0,40 L10,40 L10,50 L20,50 L20,60 L10,60 L10,70 L0,70 L0,60 L10,60 L10,50 L0,50 L0,40 Z" />
//       <path d="M90,40 L100,40 L100,50 L90,50 L90,60 L80,60 L80,70 L70,70 L70,80 L80,80 L80,90 L90,90 L90,100 L100,100 L100,90 L90,90 L90,80 L100,80 L100,70 L90,70 L90,60 L100,60 L100,50 L90,50 L90,40 Z" />
//       <path d="M60,60 L70,60 L70,70 L60,70 L60,60 Z" />
//       <path d="M40,60 L50,60 L50,70 L40,70 L40,60 Z" />
//     </svg>
//   </div>
// );

// // Modern Program Card Component
// const ProgramCard = ({ program, index }) => (
//   <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//     <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//       {index + 1}
//     </div>
//     <div className="ml-4 flex-grow">
//       <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
//       <p className="text-sm text-gray-600 mt-1">Non-Stage Competition</p>
//     </div>
//     <div className="flex-shrink-0 text-right">
//       <div className="text-sm text-gray-500">Time</div>
//       <div className="text-lg font-semibold text-gray-700">TBA</div>
//     </div>
//   </div>
// );

// // Contestant Info Section
// const ContestantInfo = ({ contestant }) => (
//   <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="text-center md:text-left">
//         <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Group</div>
//         <div className="text-xl font-bold text-gray-900 mt-1">{contestant.groupName || "Not Assigned"}</div>
//       </div>
//       <div className="text-center">
//         <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category</div>
//         <div className="text-xl font-bold text-gray-900 mt-1">{contestant.category || "Not Assigned"}</div>
//       </div>
//       <div className="text-center md:text-right">
//         <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Participant</div>
//         <div className="text-xl font-bold text-gray-900 mt-1">{contestant.name || "Not Assigned"}</div>
//       </div>
//     </div>
//   </div>
// );

// // Programs Section Component
// const ProgramsSection = ({ programs, startIndex = 0, maxPrograms = 8 }) => {
//   const displayPrograms = programs?.slice(startIndex, startIndex + maxPrograms) || [];

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">Competitions</h2>
//         <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
//           {programs?.length || 0} Total
//         </div>
//       </div>
      
//       {displayPrograms.length > 0 ? (
//         <div className="space-y-4">
//           {displayPrograms.map((program, index) => (
//             <ProgramCard 
//               key={startIndex + index} 
//               program={program} 
//               index={startIndex + index} 
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//           </div>
//           <p className="text-gray-500 text-lg">No competitions assigned</p>
//           <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function HallTicket() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`/api/admin/hallticket/${id}`);
//         setData(res.data);
//       } catch (error) {
//         console.error("Error fetching hall ticket:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl font-semibold text-gray-700">Loading Hall Ticket...</p>
//           <p className="text-gray-500 mt-2">Please wait while we fetch your details</p>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
//         <div className="text-center p-8">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//           </div>
//           <p className="text-xl font-semibold text-gray-700">Hall Ticket Not Found</p>
//           <p className="text-gray-500 mt-2">Please check your ticket ID and try again</p>
//         </div>
//       </div>
//     );
//   }

//   const { contestant, programs } = data;
//   const programsPerPage = 8;
//   const totalPages = Math.ceil((programs?.length || 0) / programsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Header Section */}
//       <div className="bg-white shadow-sm border-b border-gray-200 print:shadow-none print:border-none">
//         <div className="max-w-6xl mx-auto px-6 py-8">
//           <div className="text-center mb-8">
//             <img
//               src="/hallTicket-01.png"
//               alt="Alathurpadi Dars Fest Header"
//               className="w-full max-w-4xl mx-auto h-auto"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.nextSibling.style.display = "flex";
//               }}
//             />
//             <div
//               className="hidden items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
//             >
//               <p className="text-gray-500 font-medium">Festival Header</p>
//             </div>
//           </div>

//           {/* Title and Contestant Number */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg mb-6">
//               <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <span className="font-bold text-lg tracking-wide">HALL TICKET - NON STAGE</span>
//             </div>
            
//             <div className="flex items-center justify-center space-x-8">
//               <div className="text-center">
//                 <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contestant Number</div>
//                 <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
//                   {contestant.contestantNumber}
//                 </div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-sm font-medium text-gray-500 mb-3">Scan for Updates</div>
//                 <QrCodeComponent />
//                 <div className="text-xs text-gray-400 mt-2">Festival Information</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-6 py-8">
//         {/* Contestant Information */}
//         <ContestantInfo contestant={contestant} />

//         {/* Programs Section - First Page */}
//         <div className="print:page">
//           <ProgramsSection 
//             programs={programs} 
//             startIndex={0} 
//             maxPrograms={programsPerPage} 
//           />
//         </div>

//         {/* Additional Pages for Overflow Programs */}
//         {Array.from({ length: totalPages - 1 }, (_, index) => (
//           <div key={index + 1} className="print:page print:page-break-before mt-8">
//             <ProgramsSection 
//               programs={programs} 
//               startIndex={(index + 1) * programsPerPage} 
//               maxPrograms={programsPerPage} 
//             />
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="flex justify-center space-x-4 mt-12 print:hidden">
//           <button
//             onClick={() => window.print()}
//             className="flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//             </svg>
//             Print Hall Ticket
//           </button>
          
//           <button
//             onClick={() => window.history.back()}
//             className="flex items-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//           >
//             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Go Back
//           </button>
//         </div>
//       </div>

//       {/* Enhanced Print Styles */}
//       <style jsx>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 15mm;
//           }
          
//           body {
//             background: white !important;
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//             print-color-adjust: exact;
//           }
          
//           .print\\:hidden {
//             display: none !important;
//           }
          
//           .print\\:page {
//             page-break-after: always;
//           }
          
//           .print\\:page-break-before {
//             page-break-before: always;
//           }
          
//           .print\\:shadow-none {
//             box-shadow: none !important;
//           }
          
//           .print\\:border-none {
//             border: none !important;
//           }
          
//           /* Ensure gradients print correctly */
//           .bg-gradient-to-r,
//           .bg-gradient-to-br,
//           .bg-clip-text {
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//             print-color-adjust: exact;
//           }
          
//           /* Fix text gradient for print */
//           .text-transparent.bg-clip-text {
//             color: #4f46e5 !important;
//             background: none !important;
//             -webkit-background-clip: unset !important;
//             -webkit-text-fill-color: unset !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";

// // A placeholder component for the QR Code to match the design
// const QrCodePlaceholder = () => (
//   <svg
//     className="w-32 h-32"
//     viewBox="0 0 100 100"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="black"
//   >
//     <path d="M0 0h30v30H0z M10 10h10v10H10z M70 0h30v30H70z M80 10h10v10H80z M0 70h30v30H0z M10 80h10v10H10z M70 70h30v30H70z M40 40h20v20H40z M90 45h10v10H90z M45 90h10v10H45z M90 90h10v10H90z M70 40h10v10H70z M40 70h10v10H40z M30 45h10v10H30z M45 30h10v10H45z" />
//     <path d="M40,0 L40,10 L50,10 L50,20 L60,20 L60,10 L70,10 L70,0 L60,0 L60,10 L50,10 L50,0 L40,0 Z" />
//     <path d="M0,40 L10,40 L10,50 L20,50 L20,60 L10,60 L10,70 L0,70 L0,60 L10,60 L10,50 L0,50 L0,40 Z" />
//     <path d="M90,40 L100,40 L100,50 L90,50 L90,60 L80,60 L80,70 L70,70 L70,80 L80,80 L80,90 L90,90 L90,100 L100,100 L100,90 L90,90 L90,80 L100,80 L100,70 L90,70 L90,60 L100,60 L100,50 L90,50 L90,40 Z" />
//     <path d="M60,60 L70,60 L70,70 L60,70 L60,60 Z" />
//     <path d="M40,60 L50,60 L50,70 L40,70 L40,60 Z" />
//   </svg>
// );

// export default function HallTicket() {
//   const { id } = useParams();
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
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-lg font-medium text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   const { contestant, programs } = data;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
//       <div className="w-full max-w-3xl bg-white shadow-2xl print:shadow-none">
//         {/* Start of Hall Ticket Design */}
//         <div className="p-12">
//           {/* Header Section */}
//           <div className="p-4">
//             <img
//               src="/hallTicket-01.png"
//               alt="Alathurpadi Dars Fest Header"
//               className="w-full h-auto"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.nextSibling.style.display = "block";
//               }}
//             />
//             <div
//               style={{
//                 display: "none",
//                 border: "1px dashed gray",
//                 padding: "0.5rem",
//                 textAlign: "center",
//                 fontSize: "0.8rem",
//                 color: "gray",
//               }}
//             >
//               Header image not found
//             </div>
//           </div>

//           {/* Title Banner */}
//           <div className="border-2 border-black">
//             <div className="bg-black text-white text-center py-2 text-xl font-bold tracking-wider">
//               HALL TICKET FOR NON STAGE
//             </div>

//             {/* Main Details Section */}
//             <div className="flex border-b-[3px] border-black">
//               <div className="w-2/3 flex items-center justify-center border-r-[3px] border-black">
//                 <span className="text-[3rem] md:text-[10rem] font-extrabold tracking-tighter text-black">
//                   {contestant.contestantNumber}
//                 </span>
//               </div>
//               <div className="w-1/3 flex flex-col items-center justify-center p-4 space-y-2">
//                 <p className="text-xs text-center font-semibold text-gray-600">
//                   Fest Updates Here. <span className="block">Scan Me!</span>
//                 </p>

//                 <QrCodePlaceholder />
//               </div>
//             </div>

//             {/* Contestant Info Banner */}
//             <div className="bg-gray-200 flex justify-between items-center py-3 px-6 border-b-[3px] border-black text-black font-bold text-base md:text-lg">
//               <span className="flex-1 text-left">{contestant.groupName || "GROUP"}</span>
//               <span className="flex-1 text-center">{contestant.category || "CATEGORY"}</span>
//               <span className="flex-1 text-right">{contestant.name || "NAME"}</span>
//             </div>

//             {/* Competitions Table */}
//             <div className="flex flex-col min-h-[16rem]">
//               <div className="flex bg-black text-white font-bold text-x">
//                 <div className="w-1/3 text-center py-2 border-r-2 border-gray-600">Time</div>
//                 <div className="w-1/3 text-center py-2 border-r-2 border-gray-600">Mode</div>
//                 <div className="w-1/3 text-center py-2">Competition</div>
//               </div>
//               <div className="flex-grow text-black">
//                 {programs && programs.length > 0 ? (
//                   programs.map((p, i) => (
//                     <div key={i} className="flex border-b border-gray-300 text-base">
//                       <div className="w-1/3 p-2 border-r border-gray-300">&nbsp;</div>
//                       <div className="w-1/3 p-2 border-r border-gray-300">&nbsp;</div>
//                       <div className="w-1/3 p-2 text-center self-center">{p.name}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-500 italic p-4">
//                     No non-stage programs assigned.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Print Button */}
//       <div className="mt-8 text-center print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-200"
//         >
//           Print Hall Ticket
//         </button>
//       </div>

//       {/* Print-specific styles */}
//       <style jsx>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 1cm;
//           }
//           body {
//             background: white !important;
//             -webkit-print-color-adjust: exact;
//             color-adjust: exact;
//           }
//           .print\\:bg-white {
//             background-color: white !important;
//           }
//           .print\\:p-0 {
//             padding: 0 !important;
//           }
//           .shadow-2xl {
//             box-shadow: none !important;
//           }
//           .print\\:hidden {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

