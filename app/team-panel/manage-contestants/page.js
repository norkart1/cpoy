'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Add useRouter
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
import { useSession } from 'next-auth/react';

export default function ContestantsPage() {
    const { data: session, status } = useSession();
    const router = useRouter(); // Initialize router
    const [contestants, setContestants] = useState([]);
    const [filteredContestants, setFilteredContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const groupName = session?.user?.name;

    useEffect(() => {
        console.log(session);
        
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
                        return contestant.offstage && contestant.stage;
                    case 'partial':
                        return (contestant.offstage && !contestant.stage) || (!contestant.offstage && contestant.stage);
                    case 'pending':
                        return !contestant.offstage && !contestant.stage;
                    default:
                        return true;
                }
            });
        }

        setFilteredContestants(filtered);
    }, [contestants, searchTerm, statusFilter]);

    const getStatusBadge = (contestant) => {
        if (contestant.offstage && contestant.stage) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                </span>
            );
        } else if (contestant.offstage || contestant.stage) {
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
        const completed = contestants.filter(c => c.offstage && c.stage).length;
        const inProgress = contestants.filter(c => (c.offstage && !c.stage) || (!c.offstage && c.stage)).length;
        const pending = contestants.filter(c => !c.offstage && c.stage).length;
        
        return { completed, inProgress, pending, total: contestants.length };
    };

    const handleRowClick = (id) => {
        router.push(`/team-panel/contestant/${id}`); // Redirect to contestant details
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
                    </div>
                </header>

                <div className="px-6 lg:px-8 py-8">
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-black divide-gray-100/50">
                                        {filteredContestants.map((contestant, index) => (
                                            <tr
                                                key={contestant._id || index}
                                                className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all duration-300 group cursor-pointer"
                                                onClick={() => handleRowClick(contestant._id)} // Add click handler
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
                                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                            {contestant.name ? contestant.name.charAt(0).toUpperCase() : 'N'}
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {contestant.name || 'N/A'}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {contestant.category ? 
                                                                    contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1) : 
                                                                    'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.offstage || 0}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.stage || 0}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.generalIndividual || 0}
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    {contestant.generalGroup || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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