// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function ContestantsPage() {
//   const [contestants, setContestants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   let groupName="Fakhriyah"

//   useEffect(() => {
//     async function fetchContestants() {
//       try {
// const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);        const result = await response.json();
        
//         if (result.success) {
//           setContestants(result.data);
//         } else {
//           setError(result.error || 'Failed to load contestants');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching contestants');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchContestants();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500 text-xl">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Contestants List</h1>
//       <div className="grid gap-4">
//         {contestants.length === 0 ? (
//           <p className="text-gray-500">No contestants found</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse border">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2 text-left">Contestant Number</th>
//                   <th className="border p-2 text-left">Name</th>
//                   <th className="border p-2 text-left">Group Name</th>
//                   <th className="border p-2 text-left">Scratch Code</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contestants.map((contestant) => (
//                   <tr key={contestant._id} className="hover:bg-gray-50">
//                     <td className="border p-2">{contestant.contestantNumber}</td>
//                     <td className="border p-2">{contestant.name}</td>
//                     <td className="border p-2">{contestant.groupName}</td>
//                     <td className="border p-2">{contestant.scratchCode || 'N/A'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <Link
//         href="/"
//         className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Back to Home
//       </Link>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightCircle, Loader2 } from 'lucide-react';

export default function ContestantsPage() {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupName = 'Fakhriyah';

  useEffect(() => {
    async function fetchContestants() {
      
      try {
const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);   
     const result = await response.json();
        
        if (result.success) {
          setContestants(result.data);
        } else {
          setError(result.error || 'Failed to load contestants');
        }
      } catch (err) {
        setError('An error occurred while fetching contestants');
      } finally {
        setLoading(false);
      }
    }

    fetchContestants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading contestants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contestants</h1>
            <p className="text-sm text-gray-500">Group: {groupName}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contestants.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm font-medium">No contestants found for this group.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Off Stage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      On Stage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      General Ind.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      General Group
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contestants.map((contestant, index) => (
                    <tr
                      key={contestant._id || index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contestant.contestantNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {contestant.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {contestant.offStage ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            ✓
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {contestant.onStage ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            ✓
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {contestant.generalIndividual ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                            {contestant.generalIndividual}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {contestant.generalGroup ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                            {contestant.generalGroup}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/contestants/${contestant._id}`}
                          className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          aria-label={`View details for contestant ${contestant.name}`}
                        >
                          <ArrowRightCircle className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
