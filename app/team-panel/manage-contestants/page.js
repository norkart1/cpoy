// "use client";
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { 
//     ArrowRightCircle, 
//     Loader2, 
//     Users, 
//     Trophy, 
//     Search,
//     Filter,
//     Download,
//     CheckCircle2,
//     Clock,
//     BarChart2
// } from 'lucide-react';
// import UserSidebar from '@/components/userSidebar';
// import { useSession } from 'next-auth/react';

// export default function ContestantsPage() {
//     const { data: session, status } = useSession();
//     const router = useRouter();
//     const [contestants, setContestants] = useState([]);
//     const [filteredContestants, setFilteredContestants] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');

//     const groupName = session?.user?.name;

//     useEffect(() => {
//         async function fetchContestants() {
//             try {
//                 const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);
//                 const result = await response.json();

//                 if (result.success) {
//                     setContestants(result.data);
//                     setFilteredContestants(result.data);
//                 } else {
//                     setError(result.error || 'Failed to load contestants');
//                 }
//             } catch (err) {
//                 setError('An error occurred while fetching contestants');
//             } finally {
//                 setLoading(false);
//             }
//         }

//         if (groupName) {
//             fetchContestants();
//         }
//     }, [groupName]);

//     useEffect(() => {
//         let filtered = contestants;

//         if (searchTerm) {
//             filtered = filtered.filter(contestant =>
//                 contestant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 contestant.contestantNumber?.toString().includes(searchTerm)
//             );
//         }

//         if (statusFilter !== 'all') {
//             filtered = filtered.filter(contestant => {
//                 switch (statusFilter) {
//                     case 'offstage-completed':
//                         return contestant.offstage >= 10;
//                     case 'offstage-in-progress':
//                         return contestant.offstage > 0 && contestant.offstage < 10;
//                     case 'offstage-pending':
//                         return contestant.offstage === 0;
//                     case 'onstage-completed':
//                         return contestant.stage >= 10;
//                     case 'onstage-in-progress':
//                         return contestant.stage > 0 && contestant.stage < 10;
//                     case 'onstage-pending':
//                         return contestant.stage === 0;
//                     default:
//                         return true;
//                 }
//             });
//         }

//         setFilteredContestants(filtered);
//     }, [contestants, searchTerm, statusFilter]);

//     const getStatusBadge = (contestant, type) => {
//         const value = type === 'offstage' ? contestant.offstage : contestant.stage;
//         let status, color, label;

//         if (value >= 10) {
//             status = 'completed';
//             color = 'emerald';
//             label = type === 'offstage' ? 'Offstage Completed' : 'Onstage Completed';
//         } else if (value > 0) {
//             status = 'in-progress';
//             color = 'amber';
//             label = type === 'offstage' ? 'Offstage In Progress' : 'Onstage In Progress';
//         } else {
//             status = 'pending';
//             color = 'gray';
//             label = type === 'offstage' ? 'Offstage Pending' : 'Onstage Pending';
//         }

//         return (
//             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
//                 {status === 'completed' ? (
//                     <CheckCircle2 className="w-3.5 h-3.5" />
//                 ) : (
//                     <Clock className="w-3.5 h-3.5" />
//                 )}
//                 {label}
//             </span>
//         );
//     };

//     const getCompletionStats = () => {
//         const offstageCompleted = contestants.filter(c => c.offstage >= 10).length;
//         const offstageInProgress = contestants.filter(c => c.offstage > 0 && c.offstage < 10).length;
//         const offstagePending = contestants.filter(c => c.offstage === 0).length;
//         const onstageCompleted = contestants.filter(c => c.stage >= 10).length;
//         const onstageInProgress = contestants.filter(c => c.stage > 0 && c.stage < 10).length;
//         const onstagePending = contestants.filter(c => c.stage === 0).length;

//         return {
//             offstageCompleted,
//             offstageInProgress,
//             offstagePending,
//             onstageCompleted,
//             onstageInProgress,
//             onstagePending,
//             total: contestants.length
//         };
//     };

//     const handleRowClick = (id) => {
//         router.push(`/team-panel/contestant/${id}`);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/30 animate-pulse">
//                     <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
//                     <p className="text-lg font-semibold text-gray-800">Loading contestants for {groupName}...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
//                 <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-red-100 max-w-md w-full">
//                     <div className="text-center">
//                         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
//                         <p className="text-red-600 mb-6">{error}</p>
//                         <Link
//                             href="/"
//                             className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
//                         >
//                             Back to Dashboard
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const stats = getCompletionStats();

//     return (
//         <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
//             <UserSidebar />
//             <main className="flex-1 p-6 lg:p-8">
//                 {/* Header */}
//                 <header className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-lg border border-white/30 sticky top-4 z-20">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="flex items-center gap-4">
//                             <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
//                                 <Users className="w-6 h-6 text-white" />
//                             </div>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900">Contestants Management</h1>
//                                 <p className="text-sm text-gray-600">Group: <span className="font-medium text-indigo-600">{groupName}</span></p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
//                                 <Download className="w-4 h-4" />
//                                 Export CSV
//                             </button>
//                             <Link
//                                 href="/"
//                                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
//                             >
//                                 Dashboard
//                             </Link>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Stats Overview */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
//   {[
//     { label: 'Total', value: stats.total, color: 'indigo' },
//     { label: 'Offstage Completed', value: stats.offstageCompleted, color: 'emerald' },
//     { label: 'Offstage In Progress', value: stats.offstageInProgress, color: 'amber' },
//     { label: 'Offstage Pending', value: stats.offstagePending, color: 'gray' },
//     { label: 'Onstage Completed', value: stats.onstageCompleted, color: 'emerald' },
//     { label: 'Onstage In Progress', value: stats.onstageInProgress, color: 'amber' },
//     { label: 'Onstage Pending', value: stats.onstagePending, color: 'gray' },
//   ].map((stat, index) => (
//     <div
//       key={index}
//       className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
//       role="region"
//       aria-label={`Statistic: ${stat.label}`}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-2xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}>
//           <BarChart2 className="w-6 h-6 text-white" />
//         </div>
//         <span className={`px-3 py-1 bg-${stat.color}-100 text-${stat.color}-700 rounded-full text-xs font-semibold`}>
//           {stat.value}/{stats.total}
//         </span>
//       </div>
//       <div>
//         <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
//         <p className="text-gray-600 text-sm">{stat.label}</p>
//       </div>
//     </div>
//   ))}
// </div>

//                 {/* Filters */}
//                 <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
//   <div className="relative flex-1">
//     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 transition-colors duration-200" />
//     <input
//       type="text"
//       placeholder="Search by name or number..."
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="w-full pl-10 pr-4 py-3 bg-white/5 border border-indigo-200/30 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all duration-300 hover:bg-white/10"
//       aria-label="Search contestants by name or number"
//     />
//   </div>
//   <div className="relative">
//     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 transition-colors duration-200" />
//     <select
//       value={statusFilter}
//       onChange={(e) => setStatusFilter(e.target.value)}
//       className="pl-10 pr-10 py-3 bg-white/5 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all duration-300 appearance-none cursor-pointer min-w-[200px] hover:bg-white/10"
//       aria-label="Filter contestants by status"
//     >
//       <option value="all" className="text-gray-800 bg-white">All Status</option>
//       <option value="offstage-completed" className="text-gray-800 bg-white">Offstage Completed</option>
//       <option value="offstage-in-progress" className="text-gray-800 bg-white">Offstage In Progress</option>
//       <option value="offstage-pending" className="text-gray-800 bg-white">Offstage Pending</option>
//       <option value="onstage-completed" className="text-gray-800 bg-white">Onstage Completed</option>
//       <option value="onstage-in-progress" className="text-gray-800 bg-white">Onstage In Progress</option>
//       <option value="onstage-pending" className="text-gray-800 bg-white">Onstage Pending</option>
//     </select>
//     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//       <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>
//   </div>
// </div>

//                 {/* Contestants List */}
//                 {filteredContestants.length === 0 ? (
//                     <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg border border-white/30">
//                         <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contestants Found</h3>
//                         <p className="text-gray-600 mb-6">
//                             {contestants.length === 0 
//                                 ? `No contestants registered for ${groupName}.`
//                                 : 'Adjust your search or filter criteria to find contestants.'
//                             }
//                         </p>
//                         {(searchTerm || statusFilter !== 'all') && (
//                             <button
//                                 onClick={() => {
//                                     setSearchTerm('');
//                                     setStatusFilter('all');
//                                 }}
//                                 className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md"
//                             >
//                                 Reset Filters
//                             </button>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredContestants.map((contestant, index) => (
//                             <div
//                                 key={contestant._id || index}
//                                 className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
//                                 onClick={() => handleRowClick(contestant._id)}
//                             >
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="w-auto px-3 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                                         ID: {contestant.contestantNumber || 'N/A'}
//                                     </div>
//                                     <div className="flex gap-2">
//                                         {getStatusBadge(contestant, 'offstage')}
//                                         {getStatusBadge(contestant, 'onstage')}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xl">
//                                         {contestant.name ? contestant.name.charAt(0).toUpperCase() : 'N'}
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
//                                             {contestant.name || 'N/A'}
//                                         </h3>
//                                         <p className="text-sm text-gray-600">
//                                             {contestant.category ? 
//                                                 contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1) : 
//                                                 'N/A'}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase">Off Stage</p>
//                                         <p className="text-sm font-medium text-gray-900">{contestant.offstage || 0}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase">On Stage</p>
//                                         <p className="text-sm font-medium text-gray-900">{contestant.stage || 0}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase">Individual Score</p>
//                                         <p className="text-sm font-medium text-gray-900">{contestant.generalIndividual || 0}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase">Group Score</p>
//                                         <p className="text-sm font-medium text-gray-900">{contestant.generalGroup || 0}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {filteredContestants.length > 0 && (
//                     <div className="mt-6 text-center text-sm text-gray-600">
//                         Showing <span className="font-medium text-indigo-600">{filteredContestants.length}</span> of{' '}
//                         <span className="font-medium">{contestants.length}</span> contestants
//                         {searchTerm && (
//                             <span> matching <span className="font-medium text-indigo-600">{searchTerm}</span></span>
//                         )}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowRightCircle,
    Loader2,
    Users,
    Trophy,
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    BarChart2,
    Trash2,
    X,
} from 'lucide-react';
import UserSidebar from '@/components/userSidebar';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function ContestantsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contestants, setContestants] = useState([]);
    const [filteredContestants, setFilteredContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedContestants, setSelectedContestants] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const groupName = session?.user?.name;

    useEffect(() => {
        async function fetchContestants() {
            try {
                const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);
                const result = await response.json();

                if (result.success) {
                    setContestants(result.data);
                    setFilteredContestants(result.data);
                } else {
                    setError(result.error || 'Failed to load contestants');
                }
            } catch (err) {
                setError('An error occurred while fetching contestants');
            } finally {
                setLoading(false);
            }
        }

        if (groupName) {
            fetchContestants();
        }
    }, [groupName]);

    useEffect(() => {
        let filtered = contestants;

        if (searchTerm) {
            filtered = filtered.filter((contestant) =>
                contestant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contestant.contestantNumber?.toString().includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((contestant) => {
                switch (statusFilter) {
                    case 'offstage-completed':
                        return contestant.offstage >= 10;
                    case 'offstage-in-progress':
                        return contestant.offstage > 0 && contestant.offstage < 10;
                    case 'offstage-pending':
                        return contestant.offstage === 0;
                    case 'onstage-completed':
                        return contestant.stage >= 10;
                    case 'onstage-in-progress':
                        return contestant.stage > 0 && contestant.stage < 10;
                    case 'onstage-pending':
                        return contestant.stage === 0;
                    default:
                        return true;
                }
            });
        }

        setFilteredContestants(filtered);
    }, [contestants, searchTerm, statusFilter]);

    const getStatusBadge = (contestant, type) => {
        const value = type === 'offstage' ? contestant.offstage : contestant.stage;
        let status, color, label;

        if (value >= 10) {
            status = 'completed';
            color = 'emerald';
            label = type === 'offstage' ? 'Offstage Completed' : 'Onstage Completed';
        } else if (value > 0) {
            status = 'in-progress';
            color = 'amber';
            label = type === 'offstage' ? 'Offstage In Progress' : 'Onstage In Progress';
        } else {
            status = 'pending';
            color = 'gray';
            label = type === 'offstage' ? 'Offstage Pending' : 'Onstage Pending';
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
                {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                    <Clock className="w-3.5 h-3.5" />
                )}
                {label}
            </span>
        );
    };

    const getCompletionStats = () => {
        const offstageCompleted = contestants.filter((c) => c.offstage >= 10).length;
        const offstageInProgress = contestants.filter((c) => c.offstage > 0 && c.offstage < 10).length;
        const offstagePending = contestants.filter((c) => c.offstage === 0).length;
        const onstageCompleted = contestants.filter((c) => c.stage >= 10).length;
        const onstageInProgress = contestants.filter((c) => c.stage > 0 && c.stage < 10).length;
        const onstagePending = contestants.filter((c) => c.stage === 0).length;

        return {
            offstageCompleted,
            offstageInProgress,
            offstagePending,
            onstageCompleted,
            onstageInProgress,
            onstagePending,
            total: contestants.length,
        };
    };

    const handleRowClick = (id) => {
        if (!isDeleteModalOpen) {
            router.push(`/team-panel/contestant/${id}`);
        }
    };

    const toggleContestantSelection = (id) => {
        setSelectedContestants((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (password1 !== password2) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!password1) {
            toast.error('Please enter your password.');
            return;
        }

        try {
            const response = await fetch('/api/contestants/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contestantIds: selectedContestants,
                    password: password1,
                    teamName: session.user.name,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setContestants((prev) =>
                    prev.filter((c) => !selectedContestants.includes(c._id))
                );
                setFilteredContestants((prev) =>
                    prev.filter((c) => !selectedContestants.includes(c._id))
                );
                setSelectedContestants([]);
                setIsDeleteModalOpen(false);
                setPassword1('');
                setPassword2('');
                toast.success('Contestants deleted successfully!');
            } else {
                toast.error(data.message || 'Failed to delete contestants.');
            }
        } catch (error) {
            console.error('Bulk delete error:', error);
            toast.error('Server error. Please try again.');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/30 animate-pulse">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-800">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || status === 'unauthenticated') {
        router.push('/api/auth/signin');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/30 animate-pulse">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-800">Loading contestants for {groupName}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-red-100 max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
                        <p className="text-red-600 mb-6">{error}</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getCompletionStats();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
            <Toaster position="top-right" />
            <UserSidebar />
            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-lg border border-white/30 sticky top-4 z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Contestants Management</h1>
                                <p className="text-sm text-gray-600">
                                    Group: <span className="font-medium text-indigo-600">{groupName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {selectedContestants.length > 0 && (
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all shadow-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Selected ({selectedContestants.length})
                                </button>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total', value: stats.total, color: 'indigo' },
                        { label: 'Offstage Completed', value: stats.offstageCompleted, color: 'emerald' },
                        { label: 'Offstage In Progress', value: stats.offstageInProgress, color: 'amber' },
                        { label: 'Offstage Pending', value: stats.offstagePending, color: 'gray' },
                        { label: 'Onstage Completed', value: stats.onstageCompleted, color: 'emerald' },
                        { label: 'Onstage In Progress', value: stats.onstageInProgress, color: 'amber' },
                        { label: 'Onstage Pending', value: stats.onstagePending, color: 'gray' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            role="region"
                            aria-label={`Statistic: ${stat.label}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 shadow-lg`}>
                                    <BarChart2 className="w-6 h-6 text-white" />
                                </div>
                                <span className={`px-3 py-1 bg-${stat.color}-100 text-${stat.color}-700 rounded-full text-xs font-semibold`}>
                                    {stat.value}/{stats.total}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 transition-colors duration-200" />
                        <input
                            type="text"
                            placeholder="Search by name or number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-indigo-200/30 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all duration-300 hover:bg-white/10"
                            aria-label="Search contestants by name or number"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 transition-colors duration-200" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-10 py-3 bg-white/5 border border-indigo-200/30 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all duration-300 appearance-none cursor-pointer min-w-[200px] hover:bg-white/10"
                            aria-label="Filter contestants by status"
                        >
                            <option value="all" className="text-gray-800 bg-white">All Status</option>
                            <option value="offstage-completed" className="text-gray-800 bg-white">Offstage Completed</option>
                            <option value="offstage-in-progress" className="text-gray-800 bg-white">Offstage In Progress</option>
                            <option value="offstage-pending" className="text-gray-800 bg-white">Offstage Pending</option>
                            <option value="onstage-completed" className="text-gray-800 bg-white">Onstage Completed</option>
                            <option value="onstage-in-progress" className="text-gray-800 bg-white">Onstage In Progress</option>
                            <option value="onstage-pending" className="text-gray-800 bg-white">Onstage Pending</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Delete Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-indigo-200/30">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Delete Contestants</h2>
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setPassword1('');
                                        setPassword2('');
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete {selectedContestants.length} contestant(s)? Please enter your password twice to confirm.
                            </p>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password1}
                                        onChange={(e) => setPassword1(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Re-enter your password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setPassword1('');
                                        setPassword2('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contestants List */}
                {filteredContestants.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg border border-white/30">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contestants Found</h3>
                        <p className="text-gray-600 mb-6">
                            {contestants.length === 0
                                ? `No contestants registered for ${groupName}.`
                                : 'Adjust your search or filter criteria to find contestants.'}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContestants.map((contestant, index) => (
                            <div
                                key={contestant._id || index}
                                className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30 hover:shadow-xl hover:-translate-y-1 transition-all relative group"
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id={`contestant-${contestant._id}`}
                                        checked={selectedContestants.includes(contestant._id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleContestantSelection(contestant._id);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute bottom-3 right-3 h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white/80 checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:border-indigo-400 group-hover:shadow-sm peer"
                                        aria-label={`Select contestant ${contestant.name || 'Contestant'}`}
                                    />
                                    <span className="absolute bottom-3 right-3 h-5 w-5 flex justify-center items-center pointer-events-none hidden peer-checked:flex">
                                        <svg
                                            className="w-3 h-3 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                </div>
                                <div
                                    onClick={() => handleRowClick(contestant._id)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-auto px-3 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            ID: {contestant.contestantNumber || 'N/A'}
                                        </div>
                                        <div className="flex gap-2">
                                            {getStatusBadge(contestant, 'offstage')}
                                            {getStatusBadge(contestant, 'onstage')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xl">
                                            {contestant.name ? contestant.name.charAt(0).toUpperCase() : 'N'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {contestant.name || 'N/A'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {contestant.category
                                                    ? contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1)
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Off Stage</p>
                                            <p className="text-sm font-medium text-gray-900">{contestant.offstage || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">On Stage</p>
                                            <p className="text-sm font-medium text-gray-900">{contestant.stage || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Individual Score</p>
                                            <p className="text-sm font-medium text-gray-900">{contestant.generalIndividual || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Group Score</p>
                                            <p className="text-sm font-medium text-gray-900">{contestant.generalGroup || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredContestants.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Showing <span className="font-medium text-indigo-600">{filteredContestants.length}</span> of{' '}
                        <span className="font-medium">{contestants.length}</span> contestants
                        {searchTerm && (
                            <span> matching <span className="font-medium text-indigo-600">{searchTerm}</span></span>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}