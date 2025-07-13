// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// export default function ContestantResultTable() {
//   const searchParams = useSearchParams();
//   const contestantNumber = searchParams.get("contestantNumber");
//   const [results, setResults] = useState({ stage: [], offstage: [] });
//   const [contestant, setContestant] = useState(null);
//   const [totalScore, setTotalScore] = useState(0);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!contestantNumber || isNaN(contestantNumber)) {
//         setError("Invalid or missing contestant number");
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         // Fetch contestant by contestantNumber
//         const contestantRes = await fetch(
//           `/api/contestant?contestantNumber=${contestantNumber}`
//         );
//         const contestantData = await contestantRes.json();
//         if (contestantData.success && contestantData.contestant) {
//           setContestant(contestantData.contestant);
//         } else {
//           setError("Contestant not found");
//         }

//         // Fetch and calculate scores
//         const scoreRes = await fetch(
//           `/api/contestant?contestantNumber=${contestantNumber}`
//         );
//         const scoreData = await scoreRes.json();
//         if (scoreData.success) {
//           const calculatedScores = scoreData.scores.map((score) => {
//             let calculatedScore = 0;
//             if (score.rank && score.category) {
//               if (score.rank === "1st" && score.category === "general(individual)")
//                 calculatedScore = 8;
//               else if (score.rank === "2nd" && score.category === "general(individual)")
//                 calculatedScore = 5;
//               else if (score.rank === "3rd" && score.category === "general(individual)")
//                 calculatedScore = 2;
//               else if (score.rank === "1st" && score.category === "general(group)")
//                 calculatedScore = 15;
//               else if (score.rank === "2nd" && score.category === "general(group)")
//                 calculatedScore = 10;
//               else if (score.rank === "3rd" && score.category === "general(group)")
//                 calculatedScore = 5;
//               else if (score.rank === "1st") calculatedScore = 5;
//               else if (score.rank === "2nd") calculatedScore = 3;
//               else if (score.rank === "3rd") calculatedScore = 1;
//             }
//             return { ...score, calculatedScore };
//           });

//           const stageResults = calculatedScores.filter((s) => s.stage === "stage");
//           const offstageResults = calculatedScores.filter((s) => s.stage === "offstage");
//           setResults({ stage: stageResults, offstage: offstageResults });

//           const total = calculatedScores.reduce((sum, s) => sum + (s.calculatedScore || 0), 0);
//           setTotalScore(total);
//         } else {
//           setError("No scores found for this contestant");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Server error fetching data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [contestantNumber]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contestant Results</h2>
//       {error ? (
//         <p className="text-center text-red-500 mb-4">{error}</p>
//       ) : isLoading ? (
//         <p className="text-center text-gray-500 mb-4">Loading...</p>
//       ) : contestant ? (
//         <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-xl font-semibold mb-4 text-gray-700">
//             {contestant.name} (#{contestant.contestantNumber}, {contestant.groupName}, {contestant.category})
//           </h3>
//           <p className="mb-4 text-lg font-bold text-gray-700">Total Score: {totalScore}</p>

//           {results.stage.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-lg font-medium mb-2 text-gray-700">Stage Results</h4>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="border p-2 text-left">Item Name</th>
//                       <th className="border p-2 text-left">Rank</th>
//                       <th className="border p-2 text-left">Score</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {results.stage.map((score) => (
//                       <tr key={score._id} className="border-t">
//                         <td className="border p-2">{score.itemName}</td>
//                         <td className="border p-2">{score.rank || "N/A"}</td>
//                         <td className="border p-2 font-bold text-blue-600">{score.calculatedScore}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {results.offstage.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-lg font-medium mb-2 text-gray-700">Offstage Results</h4>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="border p-2 text-left">Item Name</th>
//                       <th className="border p-2 text-left">Rank</th>
//                       <th className="border p-2 text-left">Score</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {results.offstage.map((score) => (
//                       <tr key={score._id} className="border-t">
//                         <td className="border p-2">{score.itemName}</td>
//                         <td className="border p-2">{score.rank || "N/A"}</td>
//                         <td className="border p-2 font-bold text-blue-600">{score.calculatedScore}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {results.stage.length === 0 && results.offstage.length === 0 && (
//             <p className="text-center text-gray-500">No results found for this contestant.</p>
//           )}
//         </div>
//       ) : null}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Download, ChevronRight, Star } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ContestantResultTable() {
  const searchParams = useSearchParams();
  const contestantNumber = searchParams.get('contestantNumber');
  const [results, setResults] = useState({ stage: [], offstage: [] });
  const [contestant, setContestant] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      if (!contestantNumber || isNaN(contestantNumber)) {
        setError('Invalid or missing contestant number');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch contestant
        const contestantRes = await fetch(`/api/contestant?contestantNumber=${contestantNumber}`);
        if (!contestantRes.ok) {
          const errData = await contestantRes.json();
          throw new Error(errData.message || `HTTP error: ${contestantRes.status}`);
        }
        const contestantData = await contestantRes.json();
        if (!contestantData.success || !contestantData.contestant) {
          setError('Contestant not found');
          setIsLoading(false);
          return;
        }
        setContestant(contestantData.contestant);

        // Fetch scores
        const scoreRes = await fetch(`/api/jury/results/scores?contestantId=${contestantData.contestant._id}`);
        if (!scoreRes.ok) {
          const errData = await scoreRes.json();
          throw new Error(errData.message || `HTTP error: ${scoreRes.status}`);
        }
        const scoreData = await scoreRes.json();
        if (!scoreData.success) {
          setError(scoreData.message || 'No scores found for this contestant');
          setIsLoading(false);
          return;
        }

        const calculatedScores = scoreData.scores.map((score) => ({
          ...score,
          calculatedScore: score.calculatedScore || 0, // Use API-calculated score
        }));

        const stageResults = calculatedScores.filter((s) => s.stage === 'stage');
        const offstageResults = calculatedScores.filter((s) => s.stage === 'offstage');
        setResults({ stage: stageResults, offstage: offstageResults });

        const total = calculatedScores.reduce((sum, s) => sum + (s.calculatedScore || 0), 0);
        setTotalScore(total);
      } catch (error) {
        console.error('Error fetching data:', {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        setError(error.message || 'Server error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contestantNumber]);

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Alathurpadi Dars Fest 2025 - Contestant Results', 15, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 15, 22);
    if (contestant) {
      doc.text(`${contestant.name} (ID: ${contestant.contestantNumber}, ${contestant.groupName}, ${contestant.category})`, 15, 29);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Score: ${totalScore}`, 15, 36);
    }

    // Stage Results
    if (results.stage.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Stage Results', 15, doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 10 : 45);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 15 : 50,
        head: [['Item Name', 'Rank', 'Points']],
        body: results.stage.map((s) => [s.itemName, s.rank || 'N/A', s.calculatedScore || 0]),
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 2, textColor: [33, 33, 33], lineColor: [200, 200, 200], lineWidth: 0.2 },
        headStyles: { fillColor: [240, 240, 240], textColor: [33, 33, 33], fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 } },
      });
    }

    // Offstage Results
    if (results.offstage.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Offstage Results', 15, doc.lastAutoTable.finalY + 10);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Item Name', 'Rank', 'Points']],
        body: results.offstage.map((s) => [s.itemName, s.rank || 'N/A', s.calculatedScore || 0]),
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 2, textColor: [33, 33, 33], lineColor: [200, 200, 200], lineWidth: 0.2 },
        headStyles: { fillColor: [240, 240, 240], textColor: [33, 33, 33], fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 } },
      });
    }

    doc.save(`Contestant_${contestantNumber}_Results.pdf`);
  };

  if (!mounted) return null;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-600 font-geist-sans">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-geist-sans">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
        .font-geist-mono { font-family: 'JetBrains Mono', monospace; }
        
        .text-outline {
          -webkit-text-stroke: 1px black;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        
        .animate-bounce { animation: bounce 2s ease-in-out infinite; }
      `}</style>

      {/* Floating Navigation */}
      <div className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
          <div className="flex items-center gap-4 sm:gap-6 text-white text-xs sm:text-sm font-medium font-geist-sans">
            <a href="/results" className="hover:text-gray-300 transition-colors">Rankings</a>
            <a href="/results" className="hover:text-gray-300 transition-colors">Performers</a>
            <a href="/results" className="hover:text-gray-300 transition-colors">Search</a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium font-geist-sans mb-4 sm:mb-6">
              <Star className="w-4 h-4" />
              Contestant Results
            </div>
            <div className="text-lg sm:text-xl font-light tracking-wide mb-6 sm:mb-8 font-geist-mono">
              Alathurpadi Dars Fest 2025
            </div>
            {contestant && (
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed font-geist-mono">
                Results for {contestant.name} (#{contestant.contestantNumber}, {contestant.groupName}, {contestant.category})
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16">
            <button
              onClick={downloadPDF}
              className="group bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium font-geist-sans hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
              Download Results
            </button>
            <a
              href="/results"
              className="border-2 border-black text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium font-geist-sans hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2 sm:gap-3"
            >
              Back to Results
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </a>
          </div>

          {contestant && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold font-geist-sans mb-2">{totalScore}</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Total Score</div>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold font-geist-sans mb-2">{results.stage.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Stage Events</div>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold font-geist-sans mb-2">{results.offstage.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Offstage Events</div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-black rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-black rounded-full mt-1 sm:mt-2"></div>
          </div>
        </div>
      </div>

      {/* Stage Results */}
      {results.stage.length > 0 && (
        <div className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-geist-sans mb-2 sm:mb-4">Stage Results</h2>
              <p className="text-gray-600 text-sm sm:text-base font-geist-mono">Performance in stage events</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {results.stage.map((score) => (
                <div
                  key={score._id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:border-black transition-all duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-black" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Event</div>
                      <div className="text-base sm:text-lg font-bold font-geist-sans">{score.itemName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Rank</div>
                      <div className="text-sm sm:text-lg font-semibold font-geist-sans">{score.rank || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold font-geist-sans text-blue-600">{score.calculatedScore}</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">Points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Offstage Results */}
      {results.offstage.length > 0 && (
        <div className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-geist-sans mb-2 sm:mb-4">Offstage Results</h2>
              <p className="text-gray-600 text-sm sm:text-base font-geist-mono">Performance in offstage events</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {results.offstage.map((score) => (
                <div
                  key={score._id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 hover:border-black transition-all duration-300"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-black" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Event</div>
                      <div className="text-base sm:text-lg font-bold font-geist-sans">{score.itemName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Rank</div>
                      <div className="text-sm sm:text-lg font-semibold font-geist-sans">{score.rank || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold font-geist-sans text-blue-600">{score.calculatedScore}</div>
                      <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">Points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {results.stage.length === 0 && results.offstage.length === 0 && contestant && (
        <div className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base font-geist-mono">No results found for this contestant.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="py-12 sm:py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold font-geist-sans mb-4">Alathurpadi Dars Fest 2025</h3>
          <p className="text-gray-400 text-sm sm:text-base font-geist-mono mb-6 sm:mb-8">
            Congratulations to all participants for their outstanding performance and dedication to academic excellence.
          </p>
          <div className="text-xs sm:text-sm text-gray-500 font-geist-mono">
            Results generated on {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Trophy, Download, ChevronRight, Star } from 'lucide-react';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export default function ContestantResultTable() {
//   const searchParams = useSearchParams();
//   const contestantNumber = searchParams.get('contestantNumber');
//   const [results, setResults] = useState({ stage: [], offstage: [] });
//   const [contestant, setContestant] = useState(null);
//   const [totalScore, setTotalScore] = useState(0);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const fetchData = async () => {
//       if (!contestantNumber || isNaN(contestantNumber)) {
//         setError('Invalid or missing contestant number');
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(`/api/contestant?contestantNumber=${contestantNumber}`);
//         if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
//         const data = await res.json();

//         if (data.success && data.contestant) {
//           setContestant(data.contestant);

//           // Assume scores are in contestant.scores; update if separate endpoint
//           const scores = data.contestant.scores || [];
//           const calculatedScores = scores.map((score) => {
//             let calculatedScore = 0;
//             if (score.rank && score.category) {
//               if (score.rank === '1st' && score.category === 'general(individual)') calculatedScore = 8;
//               else if (score.rank === '2nd' && score.category === 'general(individual)') calculatedScore = 5;
//               else if (score.rank === '3rd' && score.category === 'general(individual)') calculatedScore = 2;
//               else if (score.rank === '1st' && score.category === 'general(group)') calculatedScore = 15;
//               else if (score.rank === '2nd' && score.category === 'general(group)') calculatedScore = 10;
//               else if (score.rank === '3rd' && score.category === 'general(group)') calculatedScore = 5;
//               else if (score.rank === '1st') calculatedScore = 5;
//               else if (score.rank === '2nd') calculatedScore = 3;
//               else if (score.rank === '3rd') calculatedScore = 1;
//             }
//             return { ...score, calculatedScore };
//           });

//           const stageResults = calculatedScores.filter((s) => s.stage === 'stage');
//           const offstageResults = calculatedScores.filter((s) => s.stage === 'offstage');
//           setResults({ stage: stageResults, offstage: offstageResults });

//           const total = calculatedScores.reduce((sum, s) => sum + (s.calculatedScore || 0), 0);
//           setTotalScore(total);
//         } else {
//           setError('Contestant not found');
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Server error fetching data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [contestantNumber]);

//   const downloadPDF = () => {
//     const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

//     // Header
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(18);
//     doc.text(`Alathurpadi Dars Fest 2025 - Contestant Results`, 15, 15);
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 15, 25);
//     if (contestant) {
//       doc.text(`${contestant.name} (ID: ${contestant.contestantNumber}, ${contestant.groupName}, ${contestant.category})`, 15, 35);
//       doc.text(`Total Score: ${totalScore}`, 15, 45);
//     }

//     // Stage Results
//     if (results.stage.length > 0) {
//       autoTable(doc, {
//         startY: 55,
//         head: [['Item Name', 'Rank', 'Score']],
//         body: results.stage.map((s) => [s.itemName, s.rank || 'N/A', s.calculatedScore || 0]),
//         theme: 'grid',
//         styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, textColor: [33, 33, 33], lineColor: [229, 231, 235], lineWidth: 0.2 },
//         headStyles: { fillColor: [229, 231, 235], textColor: [55, 65, 81], fontStyle: 'bold' },
//         columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 50 }, 2: { cellWidth: 50 } },
//       });
//     }

//     // Offstage Results
//     if (results.offstage.length > 0) {
//       autoTable(doc, {
//         startY: doc.lastAutoTable.finalY + 10,
//         head: [['Item Name', 'Rank', 'Score']],
//         body: results.offstage.map((s) => [s.itemName, s.rank || 'N/A', s.calculatedScore || 0]),
//         theme: 'grid',
//         styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, textColor: [33, 33, 33], lineColor: [229, 231, 235], lineWidth: 0.2 },
//         headStyles: { fillColor: [229, 231, 235], textColor: [55, 65, 81], fontStyle: 'bold' },
//         columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 50 }, 2: { cellWidth: 50 } },
//       });
//     }

//     doc.save(`Contestant_${contestantNumber}_Results.pdf`);
//   };

//   if (!mounted) return null;
//   if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-600 font-geist-sans">Loading...</div>;
//   if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 font-geist-sans">{error}</div>;

//   return (
//     <div className="min-h-screen bg-white text-black">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
//         .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
//         .font-geist-mono { font-family: 'JetBrains Mono', monospace; }
        
//         .text-outline {
//           -webkit-text-stroke: 2px black;
//           -webkit-text-fill-color: transparent;
//         }
        
//         @keyframes pulse { 0%, 100% { opacity: 0.02; } 50% { opacity: 0.04; } }
//         @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
//         .animate-pulse { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
//         .animate-bounce { animation: bounce 2s ease-in-out infinite; }
//       `}</style>

//       {/* Floating Navigation */}
//       <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
//         <div className="bg-black/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl">
//           <div className="flex items-center gap-6 text-white text-sm font-medium font-geist-sans">
//             <a href="/results" className="hover:text-gray-300 transition-colors">Rankings</a>
//             <a href="/results" className="hover:text-gray-300 transition-colors">Performers</a>
//             <a href="/results" className="hover:text-gray-300 transition-colors">Search</a>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 opacity-[0.02]">
//           <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-transparent"></div>
//           <div className="grid grid-cols-12 gap-4 h-full animate-pulse">{Array.from({ length: 144 }).map((_, i) => (
//             <div key={i} className="bg-black/10 rounded-sm"></div>
//           ))}</div>
//         </div>

//         <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
//           <div className="mb-8">
//             <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium font-geist-sans mb-6">
//               <Star className="w-4 h-4" />
//               Contestant Results
//             </div>
//             <h1 className="text-7xl md:text-9xl font-black leading-none mb-6 tracking-tighter font-geist-sans">
//               DARS
//               <br />
//               <span className="text-outline">FEST</span>
//             </h1>
//             <div className="text-2xl md:text-3xl font-light tracking-wide mb-8 font-geist-mono">
//               Alathurpadi • 2025
//             </div>
//             {contestant && (
//               <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-geist-mono">
//                 Results for {contestant.name} (#{contestant.contestantNumber}, {contestant.groupName}, {contestant.category})
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
//             <button
//               onClick={downloadPDF}
//               className="group bg-black text-white px-8 py-4 rounded-full font-medium font-geist-sans hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
//             >
//               <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
//               Download Results
//             </button>
//             <a
//               href="/results"
//               className="border-2 border-black text-black px-8 py-4 rounded-full font-medium font-geist-sans hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3"
//             >
//               Back to Rankings
//               <ChevronRight className="w-5 h-5" />
//             </a>
//           </div>

//           {contestant && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//               <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
//                 <div className="text-3xl font-bold font-geist-sans mb-2">{totalScore}</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Total Score</div>
//               </div>
//               <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
//                 <div className="text-3xl font-bold font-geist-sans mb-2">{results.stage.length}</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Stage Events</div>
//               </div>
//               <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
//                 <div className="text-3xl font-bold font-geist-sans mb-2">{results.offstage.length}</div>
//                 <div className="text-sm text-gray-600 uppercase tracking-wide font-geist-mono">Offstage Events</div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-black rounded-full mt-2"></div>
//           </div>
//         </div>
//       </div>

//       {/* Stage Results */}
//       {results.stage.length > 0 && (
//         <div className="py-24 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold font-geist-sans mb-4">Stage Results</h2>
//               <p className="text-gray-600 text-lg font-geist-mono">Performance in stage events</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {results.stage.map((score) => (
//                 <div
//                   key={score._id}
//                   className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-black transition-all duration-300"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     <Trophy className="w-8 h-8 text-black" />
//                     <div>
//                       <div className="text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Event</div>
//                       <div className="text-xl font-bold font-geist-sans">{score.itemName}</div>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <div className="text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Rank</div>
//                       <div className="text-lg font-semibold font-geist-sans">{score.rank || 'N/A'}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold font-geist-sans text-blue-600">{score.calculatedScore}</div>
//                       <div className="text-sm text-gray-500 font-geist-mono">Points</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Offstage Results */}
//       {results.offstage.length > 0 && (
//         <div className="py-24 bg-white">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold font-geist-sans mb-4">Offstage Results</h2>
//               <p className="text-gray-600 text-lg font-geist-mono">Performance in offstage events</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {results.offstage.map((score) => (
//                 <div
//                   key={score._id}
//                   className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-black transition-all duration-300"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     <Trophy className="w-8 h-8 text-black" />
//                     <div>
//                       <div className="text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Event</div>
//                       <div className="text-xl font-bold font-geist-sans">{score.itemName}</div>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <div className="text-sm text-gray-500 uppercase tracking-wide font-geist-mono">Rank</div>
//                       <div className="text-lg font-semibold font-geist-sans">{score.rank || 'N/A'}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold font-geist-sans text-blue-600">{score.calculatedScore}</div>
//                       <div className="text-sm text-gray-500 font-geist-mono">Points</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* No Results */}
//       {results.stage.length === 0 && results.offstage.length === 0 && contestant && (
//         <div className="py-24 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 text-center">
//             <p className="text-gray-600 text-lg font-geist-mono">No results found for this contestant.</p>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <div className="py-16 bg-black text-white">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h3 className="text-2xl font-bold font-geist-sans mb-4">Alathurpadi Dars Fest 2025</h3>
//           <p className="text-gray-400 font-geist-mono mb-8">
//             Congratulations to all participants for their outstanding performance and dedication to academic excellence.
//           </p>
//           <div className="text-sm text-gray-500 font-geist-mono">
//             Results generated on {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }