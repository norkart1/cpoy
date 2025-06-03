// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { ArrowRightCircle, Loader2 } from 'lucide-react';
// import UserSidebar from '@/components/userSidebar';

// export default function ContestantsPage() {
//     const [contestants, setContestants] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const groupName = 'Fakhriyah';

//     useEffect(() => {
//         async function fetchContestants() {
//             try {
//                 const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);
//                 const result = await response.json();

//                 if (result.success) {
//                     setContestants(result.data);
//                 } else {
//                     setError(result.error || 'Failed to load contestants');
//                 }
//             } catch (err) {
//                 setError('An error occurred while fetching contestants');
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchContestants();
//     }, []);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-4">
//                     <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
//                     <p className="text-lg font-medium text-gray-700">Loading contestants...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//                 <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
//                     <p className="text-red-600 text-lg font-semibold">{error}</p>
//                     <Link
//                         href="/"
//                         className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
//                     >
//                         Back to Home
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             <UserSidebar />
//             <main className="flex-1 p-6 md:p-10">
//                 {/* Header */}
//                 <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Contestants</h1>
//                             <p className="text-sm text-gray-500">Group: {groupName}</p>
//                         </div>
//                         <Link
//                             href="/"
//                             className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
//                         >
//                             Back to Home
//                         </Link>
//                     </div>
//                 </header>

//                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {contestants.length === 0 ? (
//                         <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
//                             <p className="text-gray-500 text-sm font-medium">No contestants found for this group.</p>
//                         </div>
//                     ) : (
//                         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 No.
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 Name
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 Off Stage
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 On Stage
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 General Ind.
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 General Group
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                                             >
//                                                 Details
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {contestants.map((contestant, index) => (
//                                             <tr
//                                                 key={contestant._id || index}
//                                                 className="hover:bg-gray-50 transition-colors duration-200"
//                                             >
//                                                 <td className="px-6 py-4 text-sm text-gray-900">
//                                                     {contestant.contestantNumber || 'N/A'}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                                                     {contestant.name || 'N/A'}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-center text-sm text-gray-700">
//                                                     {contestant.offStage ? (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
//                                                             ✓
//                                                         </span>
//                                                     ) : (
//                                                         '—'
//                                                     )}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-center text-sm text-gray-700">
//                                                     {contestant.onStage ? (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
//                                                             ✓
//                                                         </span>
//                                                     ) : (
//                                                         '—'
//                                                     )}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-center text-sm text-gray-700">
//                                                     {contestant.generalIndividual ? (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
//                                                             {contestant.generalIndividual}
//                                                         </span>
//                                                     ) : (
//                                                         '—'
//                                                     )}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-center text-sm text-gray-700">
//                                                     {contestant.generalGroup ? (
//                                                         <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
//                                                             {contestant.generalGroup}
//                                                         </span>
//                                                     ) : (
//                                                         '—'
//                                                     )}
//                                                 </td>
//                                                 <td className="px-6 py-4 text-right">
//                                                     <Link
//                                                         href={`/team-panel/contestant/${contestant._id}`}
//                                                         className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                                         aria-label={`View details for contestant ${contestant.name}`}
//                                                     >
//                                                         <ArrowRightCircle className="w-5 h-5" />
//                                                     </Link>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </main>
//             </main>
//         </div>

//     );
// }


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowRightCircle, 
    Loader2, 
    Users, 
    Trophy, 
    Eye,
    Search,
    Filter,
    Download,
    MoreVertical,
    CheckCircle2,
    Clock
} from 'lucide-react';
import UserSidebar from '@/components/userSidebar';

export default function ContestantsPage() {
    const [contestants, setContestants] = useState([]);
    const [filteredContestants, setFilteredContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const groupName = 'Fakhriyah';

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

        fetchContestants();
    }, []);

    // Filter contestants based on search and status
    useEffect(() => {
        let filtered = contestants;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(contestant =>
                contestant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contestant.contestantNumber?.toString().includes(searchTerm)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(contestant => {
                switch (statusFilter) {
                    case 'completed':
                        return contestant.offStage && contestant.onStage;
                    case 'partial':
                        return (contestant.offStage && !contestant.onStage) || (!contestant.offStage && contestant.onStage);
                    case 'pending':
                        return !contestant.offStage && !contestant.onStage;
                    default:
                        return true;
                }
            });
        }

        setFilteredContestants(filtered);
    }, [contestants, searchTerm, statusFilter]);

    const getStatusBadge = (contestant) => {
        if (contestant.offStage && contestant.onStage) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                </span>
            );
        } else if (contestant.offStage || contestant.onStage) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    In Progress
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            );
        }
    };

    const getCompletionStats = () => {
        const completed = contestants.filter(c => c.offStage && c.onStage).length;
        const inProgress = contestants.filter(c => (c.offStage && !c.onStage) || (!c.offStage && c.onStage)).length;
        const pending = contestants.filter(c => !c.offStage && !c.onStage).length;
        
        return { completed, inProgress, pending, total: contestants.length };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold text-gray-800 mb-2">Loading contestants...</p>
                        <p className="text-sm text-gray-500">Fetching latest data from {groupName}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-red-100 max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
                        <p className="text-red-600 text-sm mb-6">{error}</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getCompletionStats();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <UserSidebar />
            <main className="flex-1 overflow-hidden">
                {/* Modern Header with Glass Effect */}
                <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-30 border-b border-white/20 shadow-lg shadow-indigo-500/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                                        Contestants Management
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-500">Group:</span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                            {groupName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button className="inline-flex items-center gap-2 bg-white/80 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white transition-all duration-200 border border-gray-200 shadow-sm">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">In Progress</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-6 lg:px-8 py-8">
                    {/* Search and Filter Bar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search contestants by name or number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-12 pr-8 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer min-w-[160px]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="partial">In Progress</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contestants Table */}
                    {filteredContestants.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center shadow-lg border border-white/20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No contestants found</h3>
                            <p className="text-gray-500 mb-6">
                                {contestants.length === 0 
                                    ? `No contestants registered for ${groupName} group yet.`
                                    : 'Try adjusting your search or filter criteria.'
                                }
                            </p>
                            {searchTerm || statusFilter !== 'all' ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200"
                                >
                                    Clear Filters
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                                            <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                No.
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Contestant
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Off Stage
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                On Stage
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Individual Score
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Group Score
                                            </th>
                                            <th className="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/50">
                                        {filteredContestants.map((contestant, index) => (
                                            <tr
                                                key={contestant._id || index}
                                                className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {contestant.contestantNumber || 'N/A'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg shadow-sm">
                                                            {contestant.name ? contestant.name.charAt(0).toUpperCase() : 'N'}
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {contestant.name || 'N/A'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Contestant #{contestant.contestantNumber || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {getStatusBadge(contestant)}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.offStage ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                                            <Clock className="w-4 h-4" />
                                                            Pending
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.onStage ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                                            <Clock className="w-4 h-4" />
                                                            Pending
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.generalIndividual ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                                                            <Trophy className="w-4 h-4" />
                                                            {contestant.generalIndividual}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Not scored</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.generalGroup ? (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200">
                                                            <Trophy className="w-4 h-4" />
                                                            {contestant.generalGroup}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Not scored</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/team-panel/contestant/${contestant._id}`}
                                                            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 hover:shadow-xl transform group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                            aria-label={`View details for contestant ${contestant.name}`}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Link>
                                                        <button className="inline-flex items-center justify-center w-12 h-12 bg-white text-gray-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    {filteredContestants.length > 0 && (
                        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <p className="text-sm text-gray-600 text-center">
                                Showing <span className="font-semibold text-indigo-600">{filteredContestants.length}</span> of{' '}
                                <span className="font-semibold">{contestants.length}</span> contestants
                                {searchTerm && (
                                    <span> matching "<span className="font-medium text-indigo-600">{searchTerm}</span>"</span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}