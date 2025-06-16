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
    BarChart2
} from 'lucide-react';
import UserSidebar from '@/components/userSidebar';
import { useSession } from 'next-auth/react';

export default function ContestantsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [contestants, setContestants] = useState([]);
    const [filteredContestants, setFilteredContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
            filtered = filtered.filter(contestant =>
                contestant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contestant.contestantNumber?.toString().includes(searchTerm)
            );
        }

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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                </span>
            );
        } else if (contestant.offstage || contestant.stage) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    In Progress
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                </span>
            );
        }
    };

    const getCompletionStats = () => {
        const completed = contestants.filter(c => c.offstage && c.stage).length;
        const inProgress = contestants.filter(c => (c.offstage && !c.stage) || (!c.offstage && c.stage)).length;
        const pending = contestants.filter(c => !c.offstage && !c.stage).length;
        
        return { completed, inProgress, pending, total: contestants.length };
    };

    const handleRowClick = (id) => {
        router.push(`/team-panel/contestant/${id}`);
    };

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
                                <p className="text-sm text-gray-600">Group: <span className="font-medium text-indigo-600">{groupName}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', value: stats.total, color: 'indigo' },
                        { label: 'Completed', value: stats.completed, color: 'emerald' },
                        { label: 'In Progress', value: stats.inProgress, color: 'amber' },
                        { label: 'Pending', value: stats.pending, color: 'gray' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-md border border-white/30 hover:scale-105 transition-transform">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                                </div>
                                <BarChart2 className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
                                <div 
                                    className={`h-1.5 rounded-full bg-${stat.color}-500 transition-all duration-500`} 
                                    style={{ width: `${(stat.value / stats.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 mb-6 shadow-md border border-white/30 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 text-gray-800"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 appearance-none cursor-pointer min-w-[150px] text-gray-400"
                        >
                            <option value="all" className="text-gray-600">All Status</option>
                            <option value="completed" className="text-gray-600">Completed</option>
                            <option value="partial" className="text-gray-600">In Progress</option>
                            <option value="pending" className="text-gray-600">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Contestants List */}
                {filteredContestants.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg border border-white/30">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contestants Found</h3>
                        <p className="text-gray-600 mb-6">
                            {contestants.length === 0 
                                ? `No contestants registered for ${groupName}.`
                                : 'Adjust your search or filter criteria to find contestants.'
                            }
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
                                className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                onClick={() => handleRowClick(contestant._id)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-auto px-3 py-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        ID: {contestant.contestantNumber || 'N/A'}
                                    </div>
                                    {getStatusBadge(contestant)}
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
                                            {contestant.category ? 
                                                contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1) : 
                                                'N/A'}
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