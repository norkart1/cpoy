// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useQRCode } from "next-qrcode"; // Revert to static import


// // QR Code component
// const QrCode = ({ contestantNumber }) => {
//   const { Canvas } = useQRCode();
//   return (
//     <div className="w-32 h-32 border border-gray-300 rounded-sm p-2 bg-white">
//       <Canvas
//         text={`https://fest-automation.vercel.app/scan/${contestantNumber}`}
//         options={{
//           level: "H",
//           margin: 0,
//           scale: 4,
//           width: 112,
//         }}
//       />
//     </div>
//   );
// };

// // Program Section
// const ProgramSection = ({ date, programs }) => {
//   const formattedDate = new Date(date).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).replace(/\//g, ' - ');

//   const malayalamDays = ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'];
//   const dayIndex = new Date(date).getDay();
//   const malayalamDay = malayalamDays[dayIndex];

//   return (
//     <div className="mx-12 bg-gradient-to-b from-gray-100 to-white rounded-lg">
//       <div className="flex justify-center py-4">
//         <span className="bg-black text-white text-center py-2 px-4 text-base font-medium tracking-wide rounded-full">
//           {formattedDate} {malayalamDay}
//         </span>
//       </div>
//       <div className="flex flex-col min-h-[18rem] p-2">
//         <div className="flex-grow text-black">
//           {programs && programs.length > 0 ? (
//             programs.map((p, i) => (
//               <div
//                 key={i}
//                 className="flex bg-white border border-gray-200 rounded mb-2 hover:bg-gray-50 transition-colors duration-150 print:page-break-inside-avoid"
//               >
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.timeRange?.start && p.timeRange?.end ? `${p.timeRange.start} - ${p.timeRange.end}` : 'TBA'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.stage === 'stage' ? 'Stage' : 'Non-Stage'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.category || 'Unknown'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center font-semibold text-black">
//                   {p.name}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500 p-4">
//               <div className="text-center">
//                 <div className="text-lg font-medium mb-2">No competitions assigned</div>
//                 <div className="text-sm text-gray-400">Programs will appear here when available</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
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
//         console.log('HallTicket API Response:', res.data);
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
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center p-8">
//           <div className="w-12 h-12 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <div className="text-xl font-semibold text-black mb-2">Loading Hall Ticket</div>
//           <div className="text-gray-600">Please wait...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center p-8 bg-white border-2 border-black shadow-lg max-w-md">
//           <div className="text-xl font-semibold text-black mb-2">Hall Ticket Not Found</div>
//           <div className="text-gray-600">Please check your ticket ID and try again</div>
//         </div>
//       </div>
//     );
//   }

//   const { contestant, programs } = data;

//   const programsByDate = programs.reduce((acc, program) => {
//     if (!program.date || isNaN(new Date(program.date).getTime())) {
//       console.warn('Invalid date found in program:', program);
//       return acc;
//     }
//     const programDate = new Date(program.date).toISOString().split('T')[0];
//     if (!acc[programDate]) {
//       acc[programDate] = [];
//     }
//     acc[programDate].push(program);
//     return acc;
//   }, {});

//   const mainDate = '2025-06-21';
//   const mainPrograms = programsByDate[mainDate] || [];
//   const otherDates = Object.keys(programsByDate)
//     .filter((date) => date !== mainDate)
//     .sort();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 print:bg-white print:p-0">
//       <div className="w-full max-w-4xl bg-white shadow-lg print:shadow-none border border-gray-200 print:border-none">
//         <div className="pt-4 print:page mb-6">
//           <div className="mb-2">
//             <img
//               src="/header-01.png"
//               alt="Alathurpadi Dars Fest Header"
//               className="w-full h-auto rounded-sm"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.nextSibling.style.display = "block";
//               }}
//             />
//             <div
//               style={{
//                 display: "none",
//                 border: "2px dashed #9CA3AF",
//                 padding: "2rem",
//                 textAlign: "center",
//                 fontSize: "1rem",
//                 color: "#6B7280",
//                 backgroundColor: "#F9FAFB",
//                 borderRadius: "4px",
//               }}
//             >
//               Header image placeholder
//             </div>
//           </div>

//           <div className="mx-12 border-2 border-black shadow-sm">
//             <div className="bg-black text-white text-center py-3 text-xl font-bold tracking-wider">
//               HALL TICKET FOR NON STAGE
//             </div>
//             <div className="flex bg-white">
//               <div className="w-2/3 flex items-center justify-center border-r-2 border-black py-2">
//                 <span className="text-[200px] md:text-[200px] font-black text-black tracking-tighter leading-none">
//                   {contestant.contestantNumber}
//                 </span>
//               </div>
//               <div className="w-1/3 flex flex-col items-center justify-center space-y-2">
//                 <div className="text-center">
//                   <p className="text-sm font-semibold text-black mb-1">Scan for Events</p>
//                   <p className="text-xs text-gray-600 mb-4">View all registered events</p>
//                 </div>
//                 <QrCode contestantId={id} />
//               </div>
//             </div>
//           </div>

//           <div className="">
//             <ProgramSection date={mainDate} programs={mainPrograms} />
//           </div>

//           {otherDates.map((date) => (
//             <div key={date} className="">
//               <ProgramSection date={date} programs={programsByDate[date]} />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-8 text-center print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="bg-black text-white px-10 py-4 font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
//         >
//           🖨️ PRINT HALL TICKET
//         </button>
//       </div>

//       <style jsx>{`
//         @media print {
//           @page {
//             size: A4;
//             margin: 0.5cm;
//           }

//           * {
//             -webkit-print-color-adjust: exact !important;
//             color-adjust: exact !important;
//             print-color-adjust: exact !important;
//           }

//           body {
//             background: white !important;
//             font-family: system-ui, -apple-system, sans-serif !important;
//           }

//           .print\\:bg-white {
//             background-color: white !important;
//           }

//           .print\\:p-0 {
//             padding: 0 !important;
//           }

//           .print\\:shadow-none {
//             box-shadow: none !important;
//           }

//           .print\\:border-none {
//             border: none !important;
//           }

//           .print\\:hidden {
//             display: none !important;
//           }

//           .print\\:page {
//             page-break-after: always;
//           }

//           .print\\:page-break-inside-avoid {
//             page-break-inside: avoid !important;
//           }

//           .bg-black {
//             background-color: #000000 !important;
//             -webkit-print-color-adjust: exact !important;
//           }

//           .text-white {
//             color: #ffffff !important;
//             -webkit-print-color-adjust: exact !important;
//           }

//           .text-black {
//             color: #000000 !important;
//           }

//           .border-black {
//             border-color: #000000 !important;
//           }

//           .bg-gray-100 {
//             background-color: #f3f4f6 !important;
//             -webkit-print-color-adjust: exact !important;
//           }

//           .bg-white {
//             background-color: #ffffff !important;
//             -webkit-print-color-adjust: exact !important;
//           }

//           .border-gray-200 {
//             border-color: #e5e7eb !important;
//           }

//           .border-gray-300 {
//             border-color: #d1d5db !important;
//           }

//           .border-gray-400 {
//             border-color: #9ca3af !important;
//           }

//           .text-gray-600 {
//             color: #4b5563 !important;
//           }

//           .text-gray-500 {
//             color: #6b7280 !important;
//           }

//           .text-gray-400 {
//             color: #9ca3af !important;
//           }

//           .shadow-sm,
//           .shadow-lg {
//             box-shadow: none !important;
//           }

//           .text-8xl {
//             font-size: 6rem !important;
//             line-height: 1 !important;
//           }

//           .text-9xl {
//             font-size: 8rem !important;
//             line-height: 1 !important;
//           }

//           .min-h-screen {
//             min-height: auto !important;
//           }

//           .border-2 {
//             border-width: 2px !important;
//             border-style: solid !important;
//           }

//           .border {
//             border-width: 1px !important;
//             border-style: solid !important;
//           }

//           .border-r {
//             border-right-width: 1px !important;
//             border-right-style: solid !important;
//           }

//           .border-b {
//             border-bottom-width: 1px !important;
//             border-bottom-style: solid !important;
//           }

//           .border-b-2 {
//             border-bottom-width: 2px !important;
//             border-bottom-style: solid !important;
//           }

//           .border-r-2 {
//             border-right-width: 2px !important;
//             border-right-style: solid !important;
//           }
//         }

//         @media (max-width: 768px) {
//           .text-8xl {
//             font-size: 4rem;
//           }
//           .text-9xl {
//             font-size: 5rem;
//           }
//         }

//         @media (max-width: 640px) {
//           .text-8xl {
//             font-size: 3rem;
//           }
//           .text-9xl {
//             font-size: 4rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQRCode } from "next-qrcode";
// import { useSession } from "next-auth/react"; // Uncomment if using next-auth

// QR Code component
const QrCode = ({ contestantNumber }) => {
  const { Canvas } = useQRCode();
  console.log('QrCode contestantNumber:', contestantNumber); // Debug
  if (!contestantNumber) {
    return (
      <div className="w-32 h-32 border border-gray-300 rounded-sm p-2 bg-white flex items-center justify-center text-red-600 text-xs">
        Invalid Contestant Number
      </div>
    );
  }
  return (
    <div className="w-32 h-32 border border-gray-300 rounded-sm p-2 bg-white">
      <Canvas
        text={`https://fest-automation.vercel.app/scan/${contestantNumber}`}
        options={{
          level: "H",
          margin: 0,
          scale: 4,
          width: 112,
        }}
      />
    </div>
  );
};

// // Program Section
// const ProgramSection = ({ date, programs }) => {
//   const formattedDate = new Date(date).toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).replace(/\//g, ' - ');

//   const malayalamDays = ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'];
//   const dayIndex = new Date(date).getDay();
//   const malayalamDay = malayalamDays[dayIndex];

//   return (
//     <div className="mx-12 bg-gradient-to-b from-gray-100 to-white rounded-lg">
//       <div className="flex justify-center py-4">
//         <span className="bg-black text-white text-center py-2 px-4 text-base font-medium tracking-wide rounded-full">
//           {formattedDate} {malayalamDay}
//         </span>
//       </div>
//       <div className="flex flex-col min-h-[18rem] p-2">
//         <div className="flex-grow text-black">
//           {programs && programs.length > 0 ? (
//             programs.map((p, i) => (
//               <div
//                 key={i}
//                 className="flex bg-white border border-gray-200 rounded mb-2 hover:bg-gray-50 transition-colors duration-150 print:page-break-inside-avoid"
//               >
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.timeRange?.start && p.timeRange?.end ? `${p.timeRange.start} - ${p.timeRange.end}` : 'TBA'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.stage === 'stage' ? 'Stage' : 'Non-Stage'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center text-gray-600 font-medium">
//                   {p.category || 'Unknown'}
//                 </div>
//                 <div className="w-1/4 p-2 text-center font-semibold text-black">
//                   {p.name}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500 p-4">
//               <div className="text-center">
//                 <div className="text-lg font-medium mb-2">No competitions assigned</div>
//                 <div className="text-sm text-gray-400">Programs will appear here when available</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// Program Section
const ProgramSection = ({ date, programs }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, ' - ');

  const malayalamDays = ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധന', 'വ്യാഴം', 'വെള്ളി', 'ശനി'];
  const dayIndex = new Date(date).getDay();
  const malayalamDay = malayalamDays[dayIndex];

  return (
    <div className="mx-12 bg-gradient-to-b from-gray-100 to-white rounded-lg print:page-break-inside-avoid">
      <div className="flex justify-center py-4">
        <span className="bg-black text-white text-center py-2 px-4 text-base font-medium tracking-wide rounded-full">
          {formattedDate} {malayalamDay}
        </span>
      </div>
      <div className="flex flex-col min-h-[18rem] p-2">
        <div className="flex-grow text-black">
          {programs && programs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4 text-center">Event</th>
                    <th className="py-3 px-4 text-center">Date</th>
                    <th className="py-3 px-4 text-center">Time</th>
                    <th className="py-3 px-4 text-center">Stage</th>
                    <th className="py-3 px-4 text-center">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 hover:bg-gray-50 print:page-break-inside-avoid"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          {p.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {new Date(p.date).toLocaleDateString('en-GB')} ({p.day})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {p.timeRange?.start && p.timeRange?.end
                            ? `${p.timeRange.start} - ${p.timeRange.end}`
                            : 'TBA'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="capitalize">{p.stage === 'stage' ? 'Stage' : 'Non-Stage'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="capitalize">{p.category || 'Unknown'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
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
};

export default function HallTicket() {
  const { id } = useParams();
  // const { data: session, status } = useSession(); // Uncomment if using next-auth
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log('Session Data:', session); // Debug session (uncomment if using next-auth)
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/admin/hallticket/${id}`);
        console.log('HallTicket API Response:', res.data); // Debug
        setData(res.data);
      } catch (error) {
        console.error("Error fetching hall ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading /* || status === 'loading' */) { // Uncomment status check if using next-auth
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
  console.log('Contestant Data:', contestant); // Debug
  // Use session contestantNumber if available, else API (uncomment if using next-auth)
  // const contestantNumber = session?.user?.contestantNumber || contestant?.contestantNumber;

  const programsByDate = programs.reduce((acc, program) => {
    if (!program.date || isNaN(new Date(program.date).getTime())) {
      console.warn('Invalid date found in program:', program);
      return acc;
    }
    const programDate = new Date(program.date).toISOString().split('T')[0];
    if (!acc[programDate]) {
      acc[programDate] = [];
    }
    acc[programDate].push(program);
    return acc;
  }, {});

  const mainDate = '2025-06-21';
  const mainPrograms = programsByDate[mainDate] || [];
  const otherDates = Object.keys(programsByDate)
    .filter((date) => date !== mainDate)
    .sort();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 print:bg-white print:p-0">
      <div className="w-full max-w-4xl bg-white shadow-lg print:shadow-none border border-gray-200 print:border-none">
        <div className="pt-4 print:page mb-6">
          <div className="mb-2">
            <img
              src="/header-01.png"
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

          <div className="mx-12 border-2 border-black shadow-sm">
            <div className="bg-black text-white text-center py-3 text-xl font-bold tracking-wider">
              HALL TICKET FOR NON STAGE
            </div>
            <div className="flex bg-white">
              <div className="w-2/3 flex items-center justify-center border-r-2 border-black py-2">
                <span className="text-[200px] md:text-[200px] font-black text-black tracking-tighter leading-none">
                  {contestant.contestantNumber || 'N/A'}
                </span>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center space-y-2">
                <div className="text-center">
                  <p className="text-sm font-semibold text-black mb-1">Scan for Events</p>
                  <p className="text-xs text-gray-600 mb-4">View all registered events</p>
                </div>
                <QrCode contestantNumber={contestant.contestantNumber} />
              </div>
            </div>
          </div>

          <div className="">
            <ProgramSection date={mainDate} programs={mainPrograms} />
          </div>

          {otherDates.map((date) => (
            <div key={date} className="">
              <ProgramSection date={date} programs={programsByDate[date]} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-10 py-4 font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 tracking-wide"
        >
          🖨️ PRINT HALL TICKET
        </button>
      </div>

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

          .shadow-sm,
          .shadow-lg {
            box-shadow: none !important;
          }

          .text-8xl {
            font-size: 6rem !important;
            line-height: 1 !important;
          }

          .text-9xl {
            font-size: 8rem !important;
            line-height: 1 !important;
          }

          .min-h-screen {
            min-height: auto !important;
          }

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
