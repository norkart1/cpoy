// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { User, Send, LogOut } from "lucide-react";

// export default function JuryDashboard() {
//   const [jury, setJury] = useState(null);
//   const [contestants, setContestants] = useState([]);
//   const [itemName, setItemName] = useState("");
//   const [scores, setScores] = useState({});
//   const [message, setMessage] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const stored = localStorage.getItem("jury");
//     if (!stored) {
//       setMessage({ type: "error", text: "Please log in to access the dashboard." });
//       setTimeout(() => router.push("/jury/login"), 1000);
//       return;
//     }

//     try {
//       const parsed = JSON.parse(stored);
//       console.log("Parsed jury data:", parsed);
//       if (!parsed?._id || !parsed?.username) {
//         console.error("Invalid jury data:", parsed);
//         setMessage({ type: "error", text: "Invalid session. Please log in again." });
//         localStorage.removeItem("jury");
//         setTimeout(() => router.push("/jury/login"), 1000);
//         return;
//       }
//       setJury(parsed);

//       const fetchContestants = async () => {
//         try {
//           console.log("Fetching contestants with juryId:", parsed._id);
//           const res = await axios.get("/api/jury/contestants", {
//             params: { juryId: parsed._id },
//           });
//           console.log("Contestants API response:", res.data);
//           if (res.data.success) {
//             const contestantsData = res.data.contestants || [];
//             setContestants(contestantsData);
//             setItemName(contestantsData.length > 0 ? contestantsData[0].itemName || "Unknown Competition" : "No Item Assigned");
//           } else {
//             setMessage({ type: "error", text: res.data.message || "Failed to load contestants." });
//             setItemName("No Item Assigned");
//           }
//         } catch (err) {
//           console.error("Error fetching contestants:", err.response?.data || err.message);
//           setMessage({ type: "error", text: "Server error fetching contestants." });
//           setItemName("No Item Assigned");
//         }
//       };

//       fetchContestants();
//     } catch (err) {
//       console.error("Error parsing jury data:", err);
//       setMessage({ type: "error", text: "Invalid session data. Please log in again." });
//       localStorage.removeItem("jury");
//       setTimeout(() => router.push("/jury/login"), 1000);
//     }
//   }, [router]);

//   const handleScoreChange = (contestantId, value) => {
//     // Allow empty input to clear the score
//     if (value === "") {
//       setScores((prev) => {
//         const newScores = { ...prev };
//         delete newScores[contestantId];
//         return newScores;
//       });
//       setMessage(null); // Clear any previous error message
//       return;
//     }

//     // Validate score: must be an integer between 1 and 100
//     if (!/^\d+$/.test(value) || +value < 1 || +value > 100) {
//       setMessage({ type: "error", text: "Scores must be integers between 1 and 100." });
//       return;
//     }

//     // Check for duplicate scores
//     const scoreNum = Number(value);
//     const existingScores = Object.values(scores).map(Number);
//     if (existingScores.includes(scoreNum) && scores[contestantId] !== value) {
//       setMessage({ type: "error", text: `Score ${scoreNum} is already assigned to another contestant.` });
//       return;
//     }

//     // Update scores if valid
//     setScores((prev) => ({
//       ...prev,
//       [contestantId]: value,
//     }));
//     setMessage(null); // Clear any previous error message
//   };

//   const handleSubmitScores = async () => {
//     if (Object.keys(scores).length === 0) {
//       setMessage({ type: "error", text: "Please enter scores for at least one contestant." });
//       return;
//     }

//     // Validate all scores
//     for (const [contestantId, score] of Object.entries(scores)) {
//       const scoreNum = Number(score);
//       if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100) {
//         setMessage({ type: "error", text: `Invalid score for contestant ${contestantId}: must be between 1 and 100.` });
//         return;
//       }
//     }

//     // Double-check for duplicates (in case of race conditions)
//     const scoreValues = Object.values(scores).map(Number);
//     const uniqueScores = new Set(scoreValues);
//     if (uniqueScores.size !== scoreValues.length) {
//       setMessage({ type: "error", text: "Duplicate scores detected. Each contestant must have a unique score." });
//       return;
//     }

//     try {
//       console.log("Submitting scores with juryId:", jury._id);
//       const res = await axios.post("/api/jury/submit-scores", {
//         juryId: jury._id,
//         scores,
//       });
//       console.log("Submit scores response:", res.data);
//       if (res.data.success) {
//         setMessage({ type: "success", text: "Scores submitted successfully! Redirecting to rankings..." });
//         setScores({});
//         // Proceed with redirection even if rankings is empty, let RankingsPage handle it
//         const rankings = res.data.rankings || [];
//         const queryParams = new URLSearchParams({
//           rankings: encodeURIComponent(JSON.stringify(rankings)),
//           juryId: jury._id,
//         }).toString();
//         setTimeout(() => router.push(`/jury/rankings?${queryParams}`), 1000);
//       } else {
//         setMessage({ type: "error", text: res.data.message || "Failed to submit scores." });
//       }
//     } catch (err) {
//       console.error("Error submitting scores:", err.response?.data || err.message);
//       setMessage({ type: "error", text: "Server error submitting scores." });
//     }
//   };

//   if (!jury) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
//           <div className="w-8 h-8 rounded-full bg-indigo-500 animate-pulse"></div>
//           <p className="text-indigo-700 text-xl font-semibold">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header Section */}
//       <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 Hey!
//               </h1>
//               <p className="text-gray-600 mt-1">Welcome, {jury.username}</p>
//               <p className="text-gray-800 font-semibold mt-1">Assigned Item: {itemName}</p>
//             </div>
//             <button
//               onClick={() => {
//                 localStorage.removeItem("jury");
//                 router.push("/jury/login");
//               }}
//               className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//             >
//               <LogOut className="w-5 h-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

//         {/* Contestants Section */}
//         <div>
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Assigned Contestants</h2>
//               <p className="text-gray-600 mt-1">{contestants.length} contestants assigned</p>
//             </div>
//           </div>

//           {contestants.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <User className="w-12 h-12 text-indigo-500" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">No contestants assigned</h3>
//               <p className="text-gray-600">You have not been assigned any contestants yet.</p>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               {contestants.map((contestant) => (
//                 <div
//                   key={contestant._id}
//                   className="flex flex-col bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/20 hover:shadow-lg transition-all duration-300"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
//                       <div className="text-white text-xs font-semibold mt-1">
//                         {contestant.contestantNumber || "N/A"}
//                       </div>
//                     </div>
//                     <input
//                       type="number"
//                       min="1"
//                       max="100"
//                       value={scores[contestant._id] || ""}
//                       onChange={(e) => handleScoreChange(contestant._id, e.target.value)}
//                       className="w-24 p-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
//                       placeholder="(1-100)"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button
//           onClick={handleSubmitScores}
//           className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 mt-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//         >
//           <Send className="w-5 h-5" />
//           Submit Scores
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Send, LogOut } from 'lucide-react';

export default function JuryDashboard() {
  const [jury, setJury] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [itemName, setItemName] = useState('');
  const [scores, setScores] = useState({});
  const [ranks, setRanks] = useState({});
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('jury');
    if (!stored) {
      setMessage({ type: 'error', text: 'Please log in to access the dashboard.' });
      setTimeout(() => router.push('/jury/login'), 1000);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?._id || !parsed?.username) {
        console.error('Invalid jury data:', parsed);
        setMessage({ type: 'error', text: 'Invalid session. Please log in again.' });
        localStorage.removeItem('jury');
        setTimeout(() => router.push('/jury/login'), 1000);
        return;
      }
      setJury(parsed);

      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch contestants
          const contestantRes = await axios.get('/api/jury/contestants', {
            params: { juryId: parsed._id },
          });
          console.log('Contestants API response:', contestantRes.data);
          if (contestantRes.data.success) {
            const contestantsData = contestantRes.data.contestants || [];
            setContestants(contestantsData);
            setItemName(contestantsData.length > 0 ? contestantsData[0].itemName || 'Unknown Competition' : 'No Item Assigned');

            // Fetch existing scores and ranks
            const scoreRes = await axios.get('/api/jury/scores', {
              params: { juryId: parsed._id },
            });
            console.log('Scores API response:', scoreRes.data);
            if (scoreRes.data.success) {
              const scoresData = scoreRes.data.scores || [];
              // Filter scores to only include valid contestants
              const validContestantIds = contestantsData.map(c => c._id);
              const initialScores = scoresData
                .filter(s => validContestantIds.includes(s.contestant))
                .reduce((acc, { contestant, score }) => ({
                  ...acc,
                  [contestant]: score.toString(),
                }), {});
              const initialRanks = scoresData
                .filter(s => validContestantIds.includes(s.contestant))
                .reduce((acc, { contestant, rank }) => ({
                  ...acc,
                  [contestant]: rank,
                }), {});
              setScores(initialScores);
              setRanks(initialRanks);
            } else {
              setMessage({ type: 'error', text: scoreRes.data.message || 'Failed to load scores.' });
            }
          } else {
            setMessage({ type: 'error', text: contestantRes.data.message || 'Failed to load contestants.' });
            setItemName('No Item Assigned');
          }
        } catch (err) {
          console.error('Error fetching data:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            code: err.code,
            config: err.config,
          });
          setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Server error fetching data.' });
          setItemName('No Item Assigned');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } catch (err) {
      console.error('Error parsing jury data:', err);
      setMessage({ type: 'error', text: 'Invalid session data. Please log in again.' });
      localStorage.removeItem('jury');
      setTimeout(() => router.push('/jury/login'), 1000);
    }
  }, [router]);

  const handleScoreChange = (contestantId, value) => {
    if (value === '') {
      setScores((prev) => {
        const newScores = { ...prev };
        delete newScores[contestantId];
        return newScores;
      });
      setMessage(null);
      return;
    }

    if (!/^\d+$/.test(value) || +value < 1 || +value > 100) {
      setMessage({ type: 'error', text: 'Scores must be integers between 1 and 100.' });
      return;
    }

    const scoreNum = Number(value);
    const existingScores = Object.values(scores).map(Number);
    if (existingScores.includes(scoreNum) && scores[contestantId] !== value) {
      setMessage({ type: 'error', text: `Score ${scoreNum} is already assigned to another contestant.` });
      return;
    }

    setScores((prev) => ({
      ...prev,
      [contestantId]: value,
    }));
    setMessage(null);
  };

  const handleSubmitScores = async () => {
    if (Object.keys(scores).length === 0) {
      setMessage({ type: 'error', text: 'Please enter scores for at least one contestant.' });
      return;
    }

    for (const [contestantId, score] of Object.entries(scores)) {
      const scoreNum = Number(score);
      if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100) {
        setMessage({ type: 'error', text: `Invalid score for contestant ${contestantId}: must be between 1 and 100.` });
        return;
      }
    }

    const scoreValues = Object.values(scores).map(Number);
    const uniqueScores = new Set(scoreValues);
    if (uniqueScores.size !== scoreValues.length) {
      setMessage({ type: 'error', text: 'Duplicate scores detected. Each contestant must have a unique score.' });
      return;
    }

    try {
      const res = await axios.post('/api/jury/submit-scores', {
        juryId: jury._id,
        scores,
      });
      console.log('Submit scores response:', res.data);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Scores submitted successfully!' });
        // Fetch updated scores and ranks
        try {
          const scoreRes = await axios.get('/api/jury/scores', {
            params: { juryId: jury._id },
          });
          console.log('Refreshed scores API response:', scoreRes.data);
          if (scoreRes.data.success) {
            const scoresData = scoreRes.data.scores || [];
            const validContestantIds = contestants.map(c => c._id);
            const updatedScores = scoresData
              .filter(s => validContestantIds.includes(s.contestant))
              .reduce((acc, { contestant, score }) => ({
                ...acc,
                [contestant]: score.toString(),
              }), {});
            const updatedRanks = scoresData
              .filter(s => validContestantIds.includes(s.contestant))
              .reduce((acc, { contestant, rank }) => ({
                ...acc,
                [contestant]: rank,
              }), {});
            setScores(updatedScores);
            setRanks(updatedRanks);
          } else {
            setMessage({ type: 'error', text: scoreRes.data.message || 'Failed to refresh scores.' });
          }
        } catch (refreshErr) {
          console.error('Error refreshing scores:', {
            message: refreshErr.message,
            response: refreshErr.response?.data,
            status: refreshErr.response?.status,
            code: refreshErr.code,
            config: refreshErr.config,
          });
          setMessage({ type: 'error', text: refreshErr.response?.data?.message || 'Failed to refresh scores after submission.' });
        }
      } else {
        const errorText = res.data.errors?.length > 0
          ? `Failed to submit scores: ${res.data.errors.join(', ')}`
          : res.data.message || 'Failed to submit scores.';
        setMessage({ type: 'error', text: errorText });
      }
    } catch (err) {
      console.error('Error submitting scores:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code,
        config: err.config,
      });
      const errorText = err.response?.data?.errors?.length > 0
        ? `Failed to submit scores: ${err.response.data.errors.join(', ')}`
        : err.response?.data?.message || err.message || 'Server error submitting scores. Please try again.';
      setMessage({ type: 'error', text: errorText });
    }
  };

  if (!mounted) return null;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-black font-geist-sans">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
        .font-geist-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-geist-sans text-black">Jury Dashboard</h1>
              <p className="text-gray-600 font-geist-mono mt-1">Welcome, {jury.username}</p>
              <p className="text-black font-semibold font-geist-mono mt-1">Assigned Item: {itemName}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('jury');
                router.push('/jury/login');
              }}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold font-geist-sans hover:bg-gray-800 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}></div>
              <span className="font-medium font-geist-sans">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto font-geist-mono">Click to dismiss</span>
            </div>
          </div>
        )}

        {/* Contestants Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold font-geist-sans text-black">Assigned Contestants</h2>
            <p className="text-gray-600 font-geist-mono mt-1">{contestants.length} contestants assigned</p>
          </div>

          {contestants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold font-geist-sans text-black mb-2">No contestants assigned</h3>
              <p className="text-gray-600 font-geist-mono">You have not been assigned any contestants yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contestants.map((contestant) => (
                <div
                  key={contestant._id}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                  
                      <div>
                        <div className="text-sm text-gray-500 font-geist-mono uppercase">code letter</div>
                        <div className="text-base font-semibold font-geist-sans text-black">{(contestant.codeLetter || 'N/A').toUpperCase()}</div>
                      </div>
                      {ranks[contestant._id] && ['First', 'Second', 'Third'].includes(ranks[contestant._id]) && (
                        <span className="px-2 py-1 bg-black text-white text-xs font-semibold font-geist-sans rounded">
                          {ranks[contestant._id]}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={scores[contestant._id] || ''}
                      onChange={(e) => handleScoreChange(contestant._id, e.target.value)}
                      className="w-20 p-2 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white font-geist-mono text-right"
                      placeholder="(1-100)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmitScores}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 mt-4 rounded-lg font-semibold font-geist-sans hover:bg-gray-800 transition-all duration-300"
        >
          <Send className="w-4 h-4" />
          Submit Scores
        </button>
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { User, Send, LogOut } from 'lucide-react';

// export default function JuryDashboard() {
//   const [jury, setJury] = useState(null);
//   const [contestants, setContestants] = useState([]);
//   const [itemName, setItemName] = useState('');
//   const [scores, setScores] = useState({});
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setMounted(true);
//     const stored = localStorage.getItem('jury');
//     if (!stored) {
//       setMessage({ type: 'error', text: 'Please log in to access the dashboard.' });
//       setTimeout(() => router.push('/jury/login'), 1000);
//       return;
//     }

//     try {
//       const parsed = JSON.parse(stored);
//       if (!parsed?._id || !parsed?.username) {
//         setMessage({ type: 'error', text: 'Invalid session. Please log in again.' });
//         localStorage.removeItem('jury');
//         setTimeout(() => router.push('/jury/login'), 1000);
//         return;
//       }
//       setJury(parsed);

//       const fetchData = async () => {
//         setIsLoading(true);
//         try {
//           // Fetch contestants
//           const contestantRes = await axios.get('/api/jury/contestants', {
//             params: { juryId: parsed._id },
//           });
//           if (contestantRes.data.success) {
//             const contestantsData = contestantRes.data.contestants || [];
//             setContestants(contestantsData);
//             setItemName(contestantsData.length > 0 ? contestantsData[0].itemName || 'Unknown Competition' : 'No Item Assigned');

//             // Fetch existing scores (assumed endpoint)
//             const scoreRes = await axios.get('/api/jury/scores', {
//               params: { juryId: parsed._id },
//             });
//             if (scoreRes.data.success) {
//               const scoresData = scoreRes.data.scores || [];
//               const initialScores = scoresData.reduce((acc, { contestantId, score }) => ({
//                 ...acc,
//                 [contestantId]: score.toString(),
//               }), {});
//               setScores(initialScores);
//             }
//           } else {
//             setMessage({ type: 'error', text: contestantRes.data.message || 'Failed to load contestants.' });
//             setItemName('No Item Assigned');
//           }
//         } catch (err) {
//           console.error('Error fetching data:', err.response?.data || err.message);
//           setMessage({ type: 'error', text: 'Server error fetching data.' });
//           setItemName('No Item Assigned');
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchData();
//     } catch (err) {
//       console.error('Error parsing jury data:', err);
//       setMessage({ type: 'error', text: 'Invalid session data. Please log in again.' });
//       localStorage.removeItem('jury');
//       setTimeout(() => router.push('/jury/login'), 1000);
//     }
//   }, [router]);

//   const handleScoreChange = (contestantId, value) => {
//     if (value === '') {
//       setScores((prev) => {
//         const newScores = { ...prev };
//         delete newScores[contestantId];
//         return newScores;
//       });
//       setMessage(null);
//       return;
//     }

//     if (!/^\d+$/.test(value) || +value < 1 || +value > 100) {
//       setMessage({ type: 'error', text: 'Scores must be integers between 1 and 100.' });
//       return;
//     }

//     const scoreNum = Number(value);
//     const existingScores = Object.values(scores).map(Number);
//     if (existingScores.includes(scoreNum) && scores[contestantId] !== value) {
//       setMessage({ type: 'error', text: `Score ${scoreNum} is already assigned to another contestant.` });
//       return;
//     }

//     setScores((prev) => ({
//       ...prev,
//       [contestantId]: value,
//     }));
//     setMessage(null);
//   };

//   const handleSubmitScores = async () => {
//     if (Object.keys(scores).length === 0) {
//       setMessage({ type: 'error', text: 'Please enter scores for at least one contestant.' });
//       return;
//     }

//     for (const [contestantId, score] of Object.entries(scores)) {
//       const scoreNum = Number(score);
//       if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 100) {
//         setMessage({ type: 'error', text: `Invalid score for contestant ${contestantId}: must be between 1 and 100.` });
//         return;
//       }
//     }

//     const scoreValues = Object.values(scores).map(Number);
//     const uniqueScores = new Set(scoreValues);
//     if (uniqueScores.size !== scoreValues.length) {
//       setMessage({ type: 'error', text: 'Duplicate scores detected. Each contestant must have a unique score.' });
//       return;
//     }

//     try {
//       const res = await axios.post('/api/jury/submit-scores', {
//         juryId: jury._id,
//         scores,
//       });
//       if (res.data.success) {
//         setMessage({ type: 'success', text: 'Scores submitted successfully! Redirecting to rankings...' });
//         setScores({});
//         const rankings = res.data.rankings || [];
//         const queryParams = new URLSearchParams({
//           rankings: encodeURIComponent(JSON.stringify(rankings)),
//           juryId: jury._id,
//         }).toString();
//         setTimeout(() => router.push(`/jury/rankings?${queryParams}`), 1000);
//       } else {
//         setMessage({ type: 'error', text: res.data.message || 'Failed to submit scores.' });
//       }
//     } catch (err) {
//       console.error('Error submitting scores:', err.response?.data || err.message);
//       setMessage({ type: 'error', text: 'Server error submitting scores.' });
//     }
//   };

//   if (!mounted) return null;
//   if (isLoading) return <div className="min-h-screen flex items-center justify-center text-black font-geist-sans">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-white text-black">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
//         .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
//         .font-geist-mono { font-family: 'JetBrains Mono', monospace; }
//       `}</style>

//       {/* Header Section */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold font-geist-sans text-black">Jury Dashboard</h1>
//               <p className="text-gray-600 font-geist-mono mt-1">Welcome, {jury.username}</p>
//               <p className="text-black font-semibold font-geist-mono mt-1">Assigned Item: {itemName}</p>
//             </div>
//             <button
//               onClick={() => {
//                 localStorage.removeItem('jury');
//                 router.push('/jury/login');
//               }}
//               className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold font-geist-sans hover:bg-gray-800 transition-all duration-300"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-6">
//         {/* Alert Message */}
//         {message && (
//           <div
//             className={`mb-6 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 ${
//               message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}
//             onClick={() => setMessage(null)}
//           >
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}></div>
//               <span className="font-medium font-geist-sans">{message.text}</span>
//               <span className="text-sm opacity-70 ml-auto font-geist-mono">Click to dismiss</span>
//             </div>
//           </div>
//         )}

//         {/* Contestants Section */}
//         <div>
//           <div className="mb-6">
//             <h2 className="text-xl font-bold font-geist-sans text-black">Assigned Contestants</h2>
//             <p className="text-gray-600 font-geist-mono mt-1">{contestants.length} contestants assigned</p>
//           </div>

//           {contestants.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <User className="w-8 h-8 text-black" />
//               </div>
//               <h3 className="text-lg font-semibold font-geist-sans text-black mb-2">No contestants assigned</h3>
//               <p className="text-gray-600 font-geist-mono">You have not been assigned any contestants yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {contestants.map((contestant) => (
//                 <div
//                   key={contestant._id}
//                   className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-sm text-gray-500 font-geist-mono uppercase">Contestant</div>
//                       <div className="text-base font-semibold font-geist-sans text-black">#{contestant.contestantNumber || 'N/A'}</div>
//                     </div>
//                     <input
//                       type="number"
//                       min="1"
//                       max="100"
//                       value={scores[contestant._id] || ''}
//                       onChange={(e) => handleScoreChange(contestant._id, e.target.value)}
//                       className="w-20 p-2 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white font-geist-mono text-right"
//                       placeholder="(1-100)"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleSubmitScores}
//           className="flex items-center gap-2 bg-black text-white px-4 py-2 mt-4 rounded-lg font-semibold font-geist-sans hover:bg-gray-800 transition-all duration-300"
//         >
//           <Send className="w-4 h-4" />
//           Submit Scores
//         </button>
//       </div>
//     </div>
//   );
// }