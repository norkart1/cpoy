'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Award, Calendar, Tag, CheckCircle, Circle, Loader2, ArrowLeft, Search, Filter } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserSidebar from '@/components/userSidebar';

export default function ContestantDetailsPage() {
  const [contestant, setContestant] = useState(null);
  const [allPrograms, setAllPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('stage'); // 'all', 'stage', 'offstage'
  const [categoryFilter, setCategoryFilter] = useState('all'); // Category filter
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch contestant details
        const contestantRes = await fetch(`/api/contestants/${id}`);
        if (!contestantRes.ok) {
          const text = await contestantRes.text();
          console.error('Contestant API response:', text);
          throw new Error(`Failed to fetch contestant: ${contestantRes.status} ${contestantRes.statusText}`);
        }
        if (contestantRes.headers.get('content-type')?.includes('text/html')) {
          const text = await contestantRes.text();
          console.error('Contestant API returned HTML:', text.slice(0, 100));
          throw new Error('Invalid response format from contestant API');
        }
        const contestantData = await contestantRes.json();
        if (!contestantData.success) {
          throw new Error(contestantData.message || 'Failed to fetch contestant');
        }

        // Fetch all programs
        const programsRes = await fetch('/api/admin/items/list');
        if (!programsRes.ok) {
          const text = await programsRes.text();
          console.error('Programs API response:', text);
          throw new Error(`Failed to fetch programs: ${programsRes.status} ${programsRes.statusText}`);
        }
        if (programsRes.headers.get('content-type')?.includes('text/html')) {
          const text = await programsRes.text();
          console.error('Programs API returned HTML:', text.slice(0, 100));
          throw new Error('Invalid response format from programs API');
        }
        const programsData = await programsRes.json();
        if (!programsData.success) {
          throw new Error(programsData.message || 'Failed to fetch programs');
        }

        setContestant(contestantData.data);
        setAllPrograms(programsData.items);
        setCategoryFilter(contestantData.data.category || 'all');
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleToggleProgram = async (programId, isRegistered, program) => {
    if (!confirm(`Are you sure you want to ${isRegistered ? 'remove' : 'add'} "${program.name}" for this contestant?`)) {
      return;
    }

    if (!isRegistered) {
      // Check total items limit (max 10)
      const totalItems = allPrograms.filter(p => p.participants.includes(id)).length;
      if (totalItems >= 10) {
        toast.error('Maximum 10 items allowed per contestant.');
        return;
      }

      // Check general(individual) participants limit (max 4 per student)
      if (program.category?.toLowerCase() === 'general(individual)') {
        const generalIndividualItems = allPrograms.filter(p =>
          p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)
        ).length;
        if (generalIndividualItems >= 4) {
          toast.error('Maximum 4 general(individual) items allowed per student.');
          return;
        }

        // New restriction: max 3 contestants from the same team in a general(individual) item
        const programParticipants = allPrograms.find(p => p._id === programId)?.participants || [];
        const teamParticipants = await fetchTeamParticipants(programParticipants, contestant.groupName);
        if (teamParticipants >= 3) {
          toast.error('Maximum 3 contestants from the same team allowed in this general(individual) item.');
          return;
        }
      }

      // Check general(group) participants limit (max 3 per group)
      if (program.category?.toLowerCase() === 'general(group)') {
        const groupParticipants = allPrograms.filter(p =>
          p.category?.toLowerCase() === 'general(group)' && p.participants.includes(id)
        ).length;
        if (groupParticipants >= 3) {
          toast.error('Maximum 3 participants allowed per group for general(group) items.');
          return;
        }
      }
    }

    try {
      const res = await fetch(`/api/contestants/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId, action: isRegistered ? 'remove' : 'add' }),
      });
      const data = await res.json();

      if (data.success) {
        setAllPrograms((prev) =>
          prev.map((p) =>
            p._id === programId
              ? {
                ...p,
                participants: isRegistered
                  ? p.participants.filter((pid) => pid.toString() !== id)
                  : [...p.participants, id],
              }
              : p
          )
        );
        toast.success(`Program ${isRegistered ? 'removed' : 'added'} successfully!`);
      } else {
        toast.error(data.message || 'Failed to update program.');
      }
    } catch (error) {
      console.error('Toggle program error:', error);
      toast.error('Server error. Try again.');
    }
  };

  // Helper function to fetch team participants for a specific program
  const fetchTeamParticipants = async (participantIds, groupName) => {
    try {
      const res = await fetch(`/api/contestants/team-count?groupName=${encodeURIComponent(groupName)}&participantIds=${participantIds.join(',')}`);
      const data = await res.json();
      if (data.success) {
        return data.count;
      } else {
        throw new Error(data.message || 'Failed to fetch team participants');
      }
    } catch (error) {
      console.error('Fetch team participants error:', error);
      toast.error('Error checking team participants.');
      return 0; // Fallback to allow registration if check fails
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'senior':
        return <Award className="w-4 h-4" />;
      case 'junior':
        return <Users className="w-4 h-4" />;
      case 'subjunior':
        return <Tag className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'senior':
        return 'from-purple-500 to-indigo-600';
      case 'junior':
        return 'from-blue-500 to-cyan-600';
      case 'subjunior':
        return 'from-green-500 to-teal-600';
      case 'general(individual)':
        return 'from-orange-500 to-red-600';
      case 'general(group)':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  // Get unique categories from programs
  const categories = ['all', ...new Set(allPrograms.map(p => p.category?.toLowerCase() || 'general'))];

  // Filter programs for display: own category + general programs
  const ownCategoryPrograms = allPrograms.filter(
    (item) =>
      contestant?.category &&
      item.category?.toLowerCase() === contestant.category.toLowerCase()
  );
  const generalPrograms = allPrograms.filter(
    (item) =>
      item.category?.toLowerCase() === 'general(individual)' ||
      item.category?.toLowerCase() === 'general(group)'
  );

  const matchesSearchAndStage = (item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filter === 'all' || item.stage === filter;
    return matchesSearch && matchesStage;
  };

  const filteredOwnCategoryPrograms = ownCategoryPrograms.filter(matchesSearchAndStage);
  const filteredGeneralPrograms = generalPrograms.filter(matchesSearchAndStage);

  // Calculate program counts based on category-filtered programs
  const programCounts = {
    all: allPrograms.length,
    stage: allPrograms.filter((p) => p.stage === 'stage').length,
    offstage: allPrograms.filter((p) => p.stage === 'offstage').length,
  };

  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'all') {
      acc[cat] = allPrograms.length;
    } else {
      acc[cat] = allPrograms.filter(p => p.category?.toLowerCase() === cat).length;
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading contestant details...</p>
        </div>
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-100">
          <p className="text-red-600 text-lg font-semibold">{error || 'Contestant not found'}</p>
          <Link
            href="/contestants"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Contestants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <UserSidebar />
      <main className='flex-1 p-6 md:p-10'>
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {contestant.name || 'Contestant'}
              </h1>
              <p className="text-gray-600 mt-1">
                No. {contestant.contestantNumber || 'N/A'} • Group: {contestant.groupName || 'N/A'} •
                Category: {contestant.category ? contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gradient-to-r from-indigo-200 to-purple-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70"
                  aria-label="Search programs"
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </header>

        <div className="py-8">
          <div className="mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {contestant.name ? contestant.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{contestant.name || 'Unknown'}</h2>
                  <p className="text-gray-600 text-sm">
                    Contestant No: {contestant.contestantNumber || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Group: {contestant.groupName || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Category: {contestant.category ? contestant.category.charAt(0).toUpperCase() + contestant.category.slice(1) : 'N/A'}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold animate-pulse">
                    <Award className="w-4 h-4 mr-2" />
                    {allPrograms.filter(p => p.participants.includes(id)).length} Programs Registered
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Registration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <p className="text-indigo-700 font-medium">Total</p>
                  <p className="text-2xl font-bold text-indigo-900">{allPrograms.filter(p => p.participants.includes(id)).length}/10</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-blue-700 font-medium">General (Individual)</p>
                  <p className="text-2xl font-bold text-blue-900">{allPrograms.filter(p => p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)).length}/4</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl">
                  <p className="text-pink-700 font-medium">General (Group)</p>
                  <p className="text-2xl font-bold text-pink-900">{allPrograms.filter(p => p.category?.toLowerCase() === 'general(group)' && p.participants.includes(id)).length}/3</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${categoryFilter === category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/20'
                    }`}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  <span className="ml-2 text-xs opacity-75">({categoryCounts[category] || 0})</span>
                </button>
              ))}
            </div>
          </div> */}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Stage
            </h3>
            <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              {/* <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Stages ({programCounts.all})
              </button> */}
              <button
                onClick={() => setFilter('stage')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'stage'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                On Stage ({programCounts.stage})
              </button>
              <button
                onClick={() => setFilter('offstage')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === 'offstage'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Off Stage ({programCounts.offstage})
              </button>
            </div>
          </div>
          <div>
            {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
              <div className="text-center py-6 bg-indigo-100/20 backdrop-blur-md rounded-xl border border-indigo-200/50 shadow-md max-w-md mx-auto">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-7 h-7 text-indigo-500" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-1">No Programs Found</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Try adjusting your filters or search query to find programs.
                </p>
              </div>
            ) : (
              <>
                {filteredOwnCategoryPrograms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                      Your Category Programs
                      <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">Personal</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {filteredOwnCategoryPrograms.map((program) => {
                        const isRegistered = program.participants.includes(id);
                        return (
                          <div
                            key={program._id}
                            className="group relative flex items-center gap-2.5 p-2.5 rounded-lg bg-indigo-100/30 backdrop-blur-md border border-indigo-200/50 hover:bg-indigo-200/40 hover:ring-1 hover:ring-indigo-300 hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer"
                            onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                          >
                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                              {getCategoryIcon(program.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                                {program.name}
                              </h3>
                              <p className="text-xs text-gray-500 uppercase tracking-wide truncate">
                                {(program.category || "general").replace(/\(.*\)/, "")}
                              </p>
                            </div>
                            <div
                              className={`w-9 h-4.5 rounded-full flex items-center transition-all duration-300 ${isRegistered ? "bg-emerald-500" : "bg-gray-300"
                                }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isRegistered ? "translate-x-5" : "translate-x-1"
                                  }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {filteredGeneralPrograms.length > 0 && (
                  <div>
                    <h4 className="text-base font-semibold text-blue-600 mb-2 flex items-center gap-2">
                      General Programs
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Common</span>
                    </h4>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-indigo-500 mb-1.5">General (Individual)</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredGeneralPrograms
                          .filter((p) => p.category?.toLowerCase() === "general(individual)")
                          .map((program) => {
                            const isRegistered = program.participants.includes(id);
                            return (
                              <div
                                key={program._id}
                                className="group relative flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-100/30 backdrop-blur-md border border-blue-200/50 hover:bg-blue-200/40 hover:ring-1 hover:ring-blue-300 hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer"
                                onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                              >
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                                  {getCategoryIcon(program.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                                    {program.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">General (Individual)</p>
                                </div>
                                <div
                                  className={`w-9 h-4.5 rounded-full flex items-center transition-all duration-300 ${isRegistered ? "bg-emerald-500" : "bg-gray-300"
                                    }`}
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isRegistered ? "translate-x-5" : "translate-x-1"
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-indigo-500 mb-1.5">General (Group)</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredGeneralPrograms
                          .filter((p) => p.category?.toLowerCase() === "general(group)")
                          .map((program) => {
                            const isRegistered = program.participants.includes(id);
                            return (
                              <div
                                key={program._id}
                                className="group relative flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-100/30 backdrop-blur-md border border-blue-200/50 hover:bg-blue-200/40 hover:ring-1 hover:ring-blue-300 hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer"
                                onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                              >
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                                  {getCategoryIcon(program.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                                    {program.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide truncate">General (Group)</p>
                                </div>
                                <div
                                  className={`w-9 h-4.5 rounded-full flex items-center transition-all duration-300 ${isRegistered ? "bg-emerald-500" : "bg-gray-300"
                                    }`}
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isRegistered ? "translate-x-5" : "translate-x-1"
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* <div>
            {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No programs found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <>
                {filteredOwnCategoryPrograms.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-3 text-indigo-700">Your Category Programs</h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {filteredOwnCategoryPrograms.map((program) => {
                        const isRegistered = program.participants.includes(id);
                        return (
                          <div key={program._id} className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 px-2">
                              {getCategoryIcon(program.category)}
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                {(program.category || 'general').replace(/\(.*\)/, '')}
                              </span>
                            </div>
                            <div
                              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer min-h-[80px] flex items-center justify-center ${
                                isRegistered
                                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                                  : 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg'
                              }`}
                              onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                            >
                              <h3 className="font-semibold text-center text-sm leading-tight text-white">
                                {program.name}
                              </h3>
                              <div className="absolute top-2 right-2">
                                {isRegistered ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <Circle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {filteredGeneralPrograms.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">General Programs <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">Common</span></h4>
                    <div className="mb-6">
                      <h5 className="text-md font-semibold mb-2 text-indigo-600">General (Individual)</h5>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === 'general(individual)').map((program) => {
                          const isRegistered = program.participants.includes(id);
                          return (
                            <div key={program._id} className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 px-2">
                                {getCategoryIcon(program.category)}
                                <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">General (Individual)</span>
                              </div>
                              <div
                                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer min-h-[80px] flex items-center justify-center ${
                                  isRegistered
                                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                                    : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg'
                                }`}
                                onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                              >
                                <h3 className="font-semibold text-center text-sm leading-tight text-white">
                                  {program.name}
                                </h3>
                                <div className="absolute top-2 right-2">
                                  {isRegistered ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-md font-semibold mb-2 text-indigo-600">General (Group)</h5>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === 'general(group)').map((program) => {
                          const isRegistered = program.participants.includes(id);
                          return (
                            <div key={program._id} className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 px-2">
                                {getCategoryIcon(program.category)}
                                <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">General (Group)</span>
                              </div>
                              <div
                                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 cursor-pointer min-h-[80px] flex items-center justify-center ${
                                  isRegistered
                                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                                    : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg'
                                }`}
                                onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                              >
                                <h3 className="font-semibold text-center text-sm leading-tight text-white">
                                  {program.name}
                                </h3>
                                <div className="absolute top-2 right-2">
                                  {isRegistered ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div> */}
        </div>
      </main>
    </div>
  );
}

//////////////////// next //////////////////


// 'use client';

// import { useState, useEffect } from 'react';
// import { Users, Award, Calendar, Tag, CheckCircle, Circle, Loader2, ArrowLeft, Search, Filter, Trophy, Star, Target, Sparkles } from 'lucide-react';

// export default function ContestantDetailsPage() {
//   // Mock data for demonstration
//   const [contestant, setContestant] = useState({
//     name: 'Sarah Johnson',
//     contestantNumber: '001',
//     groupName: 'Phoenix Arts Academy',
//     category: 'senior',
//   });

//   const [allPrograms, setAllPrograms] = useState([
//     { _id: '1', name: 'Classical Dance', category: 'senior', stage: 'stage', participants: ['mock-id'] },
//     { _id: '2', name: 'Vocal Performance', category: 'senior', stage: 'stage', participants: [] },
//     { _id: '3', name: 'Instrumental Music', category: 'senior', stage: 'offstage', participants: ['mock-id'] },
//     { _id: '4', name: 'Poetry Recitation', category: 'general(individual)', stage: 'stage', participants: [] },
//     { _id: '5', name: 'Group Singing', category: 'general(group)', stage: 'stage', participants: ['mock-id'] },
//     { _id: '6', name: 'Drawing Competition', category: 'general(individual)', stage: 'offstage', participants: [] },
//     { _id: '7', name: 'Drama Performance', category: 'general(group)', stage: 'stage', participants: [] },
//     { _id: '8', name: 'Creative Writing', category: 'general(individual)', stage: 'offstage', participants: ['mock-id'] },
//   ]);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [hoveredProgram, setHoveredProgram] = useState(null);

//   const id = 'mock-id'; // Mock ID for demonstration

//   const handleToggleProgram = async (programId, isRegistered, program) => {
//     if (!confirm(`Are you sure you want to ${isRegistered ? 'remove' : 'add'} "${program.name}" for this contestant?`)) {
//       return;
//     }

//     setAllPrograms((prev) =>
//       prev.map((p) =>
//         p._id === programId
//           ? {
//               ...p,
//               participants: isRegistered
//                 ? p.participants.filter((pid) => pid !== id)
//                 : [...p.participants, id],
//             }
//           : p
//       )
//     );
//   };

//   const getCategoryIcon = (category) => {
//     switch (category?.toLowerCase()) {
//       case 'senior':
//         return <Award className="w-4 h-4" />;
//       case 'junior':
//         return <Users className="w-4 h-4" />;
//       case 'subjunior':
//         return <Tag className="w-4 h-4" />;
//       default:
//         return <Calendar className="w-4 h-4" />;
//     }
//   };

//   const getStageIcon = (stage) => {
//     return stage === 'stage' ? <Trophy className="w-3 h-3" /> : <Target className="w-3 h-3" />;
//   };

//   // Get unique categories for filter
//   const categories = ['all', ...new Set(allPrograms.map((p) => p.category?.toLowerCase() || 'general'))];

//   const ownCategoryPrograms = allPrograms.filter(
//     (item) => item.category?.toLowerCase() === contestant?.category?.toLowerCase()
//   );

//   const generalPrograms = allPrograms.filter(
//     (item) =>
//       item.category?.toLowerCase() === 'general(individual)' ||
//       item.category?.toLowerCase() === 'general(group)'
//   );

//   const matchesSearchAndStage = (item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStage = filter === 'all' || item.stage === filter;
//     const matchesCategory = categoryFilter === 'all' || item.category?.toLowerCase() === categoryFilter.toLowerCase();
//     return matchesSearch && matchesStage && matchesCategory;
//   };

//   const filteredOwnCategoryPrograms = ownCategoryPrograms.filter(matchesSearchAndStage);
//   const filteredGeneralPrograms = generalPrograms.filter(matchesSearchAndStage);

//   const programCounts = {
//     all: allPrograms.length,
//     stage: allPrograms.filter((p) => p.stage === 'stage').length,
//     offstage: allPrograms.filter((p) => p.stage === 'offstage').length,
//   };

//   const categoryCounts = categories.reduce((acc, cat) => {
//     if (cat === 'all') {
//       acc[cat] = allPrograms.length;
//     } else {
//       acc[cat] = allPrograms.filter((p) => p.category?.toLowerCase() === cat).length;
//     }
//     return acc;
//   }, {});

//   const registeredCount = allPrograms.filter((p) => p.participants.includes(id)).length;
//   const generalIndividualCount = allPrograms.filter(
//     (p) => p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)
//   ).length;
//   const generalGroupCount = allPrograms.filter(
//     (p) => p.category?.toLowerCase() === 'general(group)' && p.participants.includes(id)
//   ).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-6">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
//             <div className="absolute inset-0 w-20 h-20 border-4 border-sky-200 rounded-full animate-ping"></div>
//           </div>
//           <div className="text-center">
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading contestant details</h3>
//             <p className="text-gray-500">Please wait while we fetch the information...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
//       {/* Floating Header */}
//       <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => window.history.back()}
//                 className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 group"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                   {contestant.name}
//                 </h1>
//                 <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
//                   <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-lg font-medium">
//                     #{contestant.contestantNumber}
//                   </span>
//                   <span>{contestant.groupName}</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span className="capitalize font-medium text-purple-600">{contestant.category}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Search */}
//             <div className="relative">
//               <div className="relative group">
//                 <input
//                   type="text"
//                   placeholder="Search programs..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-72 pl-12 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
//                   aria-label="Search programs"
//                 />
//                 <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-violet-500 transition-colors" />
//                 {searchQuery && (
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                     <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {/* Enhanced Profile Card */}
//         <div className="mb-8">
//           <div className="bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
//             <div className="flex items-center gap-6">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                   {contestant.name.split(' ').map((n) => n[0]).join('')}
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
//                   <Star className="w-3 h-3 text-white" />
//                 </div>
//               </div>

//               <div className="flex-1">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">{contestant.name}</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
//                     <span className="text-gray-600">
//                       No: <span className="font-semibold text-gray-800">{contestant.contestantNumber}</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
//                     <span className="text-gray-600">
//                       Group: <span className="font-semibold text-gray-800">{contestant.groupName}</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                     <span className="text-gray-600">
//                       Category: <span className="font-semibold text-gray-800 capitalize">{contestant.category}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl">
//                   <Trophy className="w-5 h-5 text-violet-600" />
//                   <span className="font-bold text-violet-800">{registeredCount}</span>
//                   <span className="text-violet-600 text-sm">Programs</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Registration Summary */}
//         <div className="mb-8">
//           <div className="bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
//             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
//                 <Award className="w-4 h-4 text-white" />
//               </div>
//               Registration Summary
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="group hover:scale-105 transition-all duration-300">
//                 <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-2xl border border-violet-100 shadow-lg hover:shadow-xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-violet-700 font-semibold">Total Programs</p>
//                     <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
//                       <Trophy className="w-5 h-5 text-white" />
//                     </div>
//                   </div>
//                   <div className="flex items-baseline gap-1">
//                     <p className="text-3xl font-bold text-violet-900">{registeredCount}</p>
//                     <p className="text-lg text-violet-600">/10</p>
//                   </div>
//                   <div className="mt-3 w-full bg-violet-100 rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${(registeredCount / 10) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="group hover:scale-105 transition-all duration-300">
//                 <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-100 shadow-lg hover:shadow-xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-sky-700 font-semibold">Individual</p>
//                     <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
//                       <Users className="w-5 h-5 text-white" />
//                     </div>
//                   </div>
//                   <div className="flex items-baseline gap-1">
//                     <p className="text-3xl font-bold text-sky-900">{generalIndividualCount}</p>
//                     <p className="text-lg text-sky-600">/4</p>
//                   </div>
//                   <div className="mt-3 w-full bg-sky-100 rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${(generalIndividualCount / 4) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>

//               <div className="group hover:scale-105 transition-all duration-300">
//                 <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-emerald-700 font-semibold">Group</p>
//                     <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
//                       <Users className="w-5 h-5 text-white" />
//                     </div>
//                   </div>
//                   <div className="flex items-baseline gap-1">
//                     <p className="text-3xl font-bold text-emerald-900">{generalGroupCount}</p>
//                     <p className="text-lg text-emerald-600">/3</p>
//                   </div>
//                   <div className="mt-3 w-full bg-emerald-100 rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: `${(generalGroupCount / 3) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Category Filter Controls */}
//         <div className="mb-8">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Filter className="w-5 h-5 text-gray-600" />
//             Filter by Category
//           </h3>
//           <div className="flex flex-wrap gap-2">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setCategoryFilter(category)}
//                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                   categoryFilter === category
//                     ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
//                     : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/20'
//                 }`}
//               >
//                 {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//                 <span className="ml-2 text-xs opacity-75">({categoryCounts[category] || 0})</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Enhanced Stage Filter Controls */}
//         <div className="mb-8">
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
//             <div className="flex gap-2">
//               {[
//                 { key: 'all', label: `All Stages (${programCounts.all})`, icon: <Filter className="w-4 h-4" /> },
//                 { key: 'stage', label: `On Stage (${programCounts.stage})`, icon: <Trophy className="w-4 h-4" /> },
//                 { key: 'offstage', label: `Off Stage (${programCounts.offstage})`, icon: <Target className="w-4 h-4" /> },
//               ].map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => setFilter(item.key)}
//                   className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
//                     filter === item.key
//                       ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
//                       : 'text-gray-700 hover:bg-white/70 hover:shadow-md'
//                   }`}
//                 >
//                   {item.icon}
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Programs Grid */}
//         <div className="space-y-8">
//           {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="w-32 h-32 bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//                 <Search className="w-16 h-16 text-violet-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-3">No programs found</h3>
//               <p className="text-gray-600 text-lg">Try adjusting your filters or search query to find programs.</p>
//             </div>
//           ) : (
//             <>
//               {/* Category Programs */}
//               {filteredOwnCategoryPrograms.length > 0 && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
//                       <Award className="w-5 h-5 text-white" />
//                     </div>
//                     <h4 className="text-2xl font-bold text-violet-700">Your Category Programs</h4>
//                     <div className="h-px bg-gradient-to-r from-violet-200 to-transparent flex-1"></div>
//                   </div>

//                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {filteredOwnCategoryPrograms.map((program) => {
//                       const isRegistered = program.participants.includes(id);
//                       return (
//                         <div
//                           key={program._id}
//                           className="group cursor-pointer"
//                           onMouseEnter={() => setHoveredProgram(program._id)}
//                           onMouseLeave={() => setHoveredProgram(null)}
//                           onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                         >
//                           <div
//                             className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                               isRegistered
//                                 ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                 : 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600'
//                             }`}
//                           >
//                             {/* Background Pattern */}
//                             <div className="absolute inset-0 opacity-10">
//                               <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                               <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                             </div>

//                             {/* Content */}
//                             <div className="relative z-10 h-full flex flex-col">
//                               <div className="flex items-center justify-between mb-3">
//                                 <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                   {getCategoryIcon(program.category)}
//                                   <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                     {program.category?.replace(/\(.*\)/, '') || 'General'}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                   {getStageIcon(program.stage)}
//                                   <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                 </div>
//                               </div>

//                               <div className="flex-1 flex items-center justify-center">
//                                 <h3 className="font-bold text-center text-white text-lg leading-tight">{program.name}</h3>
//                               </div>

//                               <div className="flex items-center justify-between mt-4">
//                                 <div
//                                   className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                     hoveredProgram === program._id ? 'scale-110' : ''
//                                   }`}
//                                 >
//                                   {isRegistered ? (
//                                     <CheckCircle className="w-6 h-6 text-white" />
//                                   ) : (
//                                     <Circle className="w-6 h-6 text-white" />
//                                   )}
//                                 </div>
//                                 <span className="text-sm font-semibold text-white/90">
//                                   {isRegistered ? 'Registered' : 'Available'}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* General Programs */}
//               {filteredGeneralPrograms.length > 0 && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
//                       <Sparkles className="w-5 h-5 text-white" />
//                     </div>
//                     <h4 className="text-2xl font-bold text-sky-700">General Programs</h4>
//                     <div className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold">
//                       Open to All
//                     </div>
//                     <div className="h-px bg-gradient-to-r from-sky-200 to-transparent flex-1"></div>
//                   </div>

//                   {/* Individual Programs */}
//                   <div className="mb-8">
//                     <h5 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
//                       <Users className="w-5 h-5" />
//                       Individual Programs
//                     </h5>
//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                       {filteredGeneralPrograms
//                         .filter((p) => p.category?.toLowerCase() === 'general(individual)')
//                         .map((program) => {
//                           const isRegistered = program.participants.includes(id);
//                           return (
//                             <div
//                               key={program._id}
//                               className="group cursor-pointer"
//                               onMouseEnter={() => setHoveredProgram(program._id)}
//                               onMouseLeave={() => setHoveredProgram(null)}
//                               onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                             >
//                               <div
//                                 className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                                   isRegistered
//                                     ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                     : 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600'
//                                 }`}
//                               >
//                                 <div className="absolute inset-0 opacity-10">
//                                   <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                                 </div>

//                                 <div className="relative z-10 h-full flex flex-col">
//                                   <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                       <Users className="w-3 h-3 text-white" />
//                                       <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                         Individual
//                                       </span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       {getStageIcon(program.stage)}
//                                       <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                     </div>
//                                   </div>

//                                   <div className="flex-1 flex items-center justify-center">
//                                     <h3 className="font-bold text-center text-white text-lg leading-tight">
//                                       {program.name}
//                                     </h3>
//                                   </div>

//                                   <div className="flex items-center justify-between mt-4">
//                                     <div
//                                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                         hoveredProgram === program._id ? 'scale-110' : ''
//                                       }`}
//                                     >
//                                       {isRegistered ? (
//                                         <CheckCircle className="w-6 h-6 text-white" />
//                                       ) : (
//                                         <Circle className="w-6 h-6 text-white" />
//                                       )}
//                                     </div>
//                                     <span className="text-sm font-semibold text-white/90">
//                                       {isRegistered ? 'Registered' : 'Available'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>

//                   {/* Group Programs */}
//                   <div>
//                     <h5 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
//                       <Users className="w-5 h-5" />
//                       Group Programs
//                     </h5>
//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                       {filteredGeneralPrograms
//                         .filter((p) => p.category?.toLowerCase() === 'general(group)')
//                         .map((program) => {
//                           const isRegistered = program.participants.includes(id);
//                           return (
//                             <div
//                               key={program._id}
//                               className="group cursor-pointer"
//                               onMouseEnter={() => setHoveredProgram(program._id)}
//                               onMouseLeave={() => setHoveredProgram(null)}
//                               onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                             >
//                               <div
//                                 className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                                   isRegistered
//                                     ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                     : 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600'
//                                 }`}
//                               >
//                                 <div className="absolute inset-0 opacity-10">
//                                   <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                                 </div>

//                                 <div className="relative z-10 h-full flex flex-col">
//                                   <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                       <Users className="w-3 h-3 text-white" />
//                                       <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                         Group
//                                       </span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       {getStageIcon(program.stage)}
//                                       <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                     </div>
//                                   </div>

//                                   <div className="flex-1 flex items-center justify-center">
//                                     <h3 className="font-bold text-center text-white text-lg leading-tight">
//                                       {program.name}
//                                     </h3>
//                                   </div>

//                                   <div className="flex items-center justify-between mt-4">
//                                     <div
//                                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                         hoveredProgram === program._id ? 'scale-110' : ''
//                                       }`}
//                                     >
//                                       {isRegistered ? (
//                                         <CheckCircle className="w-6 h-6 text-white" />
//                                       ) : (
//                                         <Circle className="w-6 h-6 text-white" />
//                                       )}
//                                     </div>
//                                     <span className="text-sm font-semibold text-white/90">
//                                       {isRegistered ? 'Registered' : 'Available'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

////////////
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { Users, Award, Calendar, Tag, CheckCircle, Circle, Loader2, ArrowLeft, Search, Filter, Trophy, Star, Target, Sparkles } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import UserSidebar from '@/components/userSidebar';

// export default function ContestantDetailsPage() {
//   const [contestant, setContestant] = useState(null);
//   const [allPrograms, setAllPrograms] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all'); // 'all', 'stage', 'offstage'
//   const [categoryFilter, setCategoryFilter] = useState('all'); // Category filter
//   const [hoveredProgram, setHoveredProgram] = useState(null);
//   const router = useRouter();
//   const { id } = useParams();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);

//         // Fetch contestant details
//         const contestantRes = await fetch(`/api/contestants/${id}`);
//         if (!contestantRes.ok) {
//           const text = await contestantRes.text();
//           console.error('Contestant API response:', text);
//           throw new Error(`Failed to fetch contestant: ${contestantRes.status} ${contestantRes.statusText}`);
//         }
//         if (contestantRes.headers.get('content-type')?.includes('text/html')) {
//           const text = await contestantRes.text();
//           console.error('Contestant API returned HTML:', text.slice(0, 100));
//           throw new Error('Invalid response format from contestant API');
//         }
//         const contestantData = await contestantRes.json();
//         if (!contestantData.success) {
//           throw new Error(contestantData.message || 'Failed to fetch contestant');
//         }

//         // Fetch all programs
//         const programsRes = await fetch('/api/admin/items/list');
//         if (!programsRes.ok) {
//           const text = await programsRes.text();
//           console.error('Programs API response:', text);
//           throw new Error(`Failed to fetch programs: ${programsRes.status} ${programsRes.statusText}`);
//         }
//         if (programsRes.headers.get('content-type')?.includes('text/html')) {
//           const text = await programsRes.text();
//           console.error('Programs API returned HTML:', text.slice(0, 100));
//           throw new Error('Invalid response format from programs API');
//         }
//         const programsData = await programsRes.json();
//         if (!programsData.success) {
//           throw new Error(programsData.message || 'Failed to fetch programs');
//         }

//         setContestant(contestantData.data);
//         setAllPrograms(programsData.items);
//         setCategoryFilter(contestantData.data.category || 'all');
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError(err.message || 'An error occurred while loading data');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (id) {
//       fetchData();
//     }
//   }, [id]);

//   const handleToggleProgram = async (programId, isRegistered, programName) => {
//     if (!confirm(`Are you sure you want to ${isRegistered ? 'remove' : 'add'} "${programName}" for this contestant?`)) {
//       return;
//     }

//     // Check total items limit (max 10)
//     const totalItems = allPrograms.filter(p => p.participants.includes(id)).length;
//     if (!isRegistered && totalItems >= 10) {
//       toast.error('Maximum 10 items allowed per contestant.');
//       return;
//     }

//     // Check general(individual) participants limit (max 4 per student)
//     if (!isRegistered && programName.category === 'general(individual)') {
//       const generalIndividualItems = allPrograms.filter(p =>
//         p.category === 'general(individual)' && p.participants.includes(id)
//       ).length;
//       if (generalIndividualItems >= 4) {
//         toast.error('Maximum 4 general(individual) items allowed per student.');
//         return;
//       }
//     }

//     // Check general(group) participants limit (max 3 per group)
//     if (!isRegistered && programName.category === 'general(group)') {
//       const groupParticipants = allPrograms.filter(p =>
//         p.category === 'general(group)' && p.participants.includes(id)
//       ).length;
//       if (groupParticipants >= 3) {
//         toast.error('Maximum 3 participants allowed per group for general(group) items.');
//         return;
//       }
//     }

//     try {
//       const res = await fetch(`/api/contestants/${id}/items`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ programId, action: isRegistered ? 'remove' : 'add' }),
//       });
//       const data = await res.json();

//       if (data.success) {
//         setAllPrograms((prev) =>
//           prev.map((program) =>
//             program._id === programId
//               ? {
//                   ...program,
//                   participants: isRegistered
//                     ? program.participants.filter((pid) => pid.toString() !== id)
//                     : [...program.participants, id],
//                 }
//               : program
//           )
//         );
//         toast.success(`Program ${isRegistered ? 'removed' : 'added'} successfully!`);
//       } else {
//         toast.error(data.message || 'Failed to update program.');
//       }
//     } catch (error) {
//       console.error('Toggle program error:', error);
//       toast.error('Server error. Try again.');
//     }
//   };

//   const getCategoryIcon = (category) => {
//     switch (category?.toLowerCase()) {
//       case 'senior':
//         return <Award className="w-4 h-4" />;
//       case 'junior':
//         return <Users className="w-4 h-4" />;
//       case 'subjunior':
//         return <Tag className="w-4 h-4" />;
//       default:
//         return <Calendar className="w-4 h-4" />;
//     }
//   };

//   const getStageIcon = (stage) => {
//     return stage === 'stage' ? <Trophy className="w-3 h-3" /> : <Target className="w-3 h-3" />;
//   };

//   // Get unique categories from programs
//   const categories = ['all', ...new Set(allPrograms.map(p => p.category?.toLowerCase() || 'general'))];

//   // Filter programs for display: own category + general programs
//   const ownCategoryPrograms = allPrograms.filter(
//     (item) =>
//       contestant?.category &&
//       item.category?.toLowerCase() === contestant.category.toLowerCase()
//   );
//   const generalPrograms = allPrograms.filter(
//     (item) =>
//       item.category?.toLowerCase() === 'general(individual)' ||
//       item.category?.toLowerCase() === 'general(group)'
//   );

//   const matchesSearchAndStage = (item) => {
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStage = filter === 'all' || item.stage === filter;
//     const matchesCategory = categoryFilter === 'all' || item.category?.toLowerCase() === categoryFilter.toLowerCase();
//     return matchesSearch && matchesStage && matchesCategory;
//   };

//   const filteredOwnCategoryPrograms = ownCategoryPrograms.filter(matchesSearchAndStage);
//   const filteredGeneralPrograms = generalPrograms.filter(matchesSearchAndStage);

//   // Calculate program counts based on category-filtered programs
//   const programCounts = {
//     all: allPrograms.length,
//     stage: allPrograms.filter((p) => p.stage === 'stage').length,
//     offstage: allPrograms.filter((p) => p.stage === 'offstage').length,
//   };

//   const categoryCounts = categories.reduce((acc, cat) => {
//     if (cat === 'all') {
//       acc[cat] = allPrograms.length;
//     } else {
//       acc[cat] = allPrograms.filter(p => p.category?.toLowerCase() === cat).length;
//     }
//     return acc;
//   }, {});

//   const registeredCount = allPrograms.filter(p => p.participants.includes(id)).length;
//   const generalIndividualCount = allPrograms.filter(p =>
//     p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)
//   ).length;
//   const generalGroupCount = allPrograms.filter(p =>
//     p.category?.toLowerCase() === 'general(group)' && p.participants.includes(id)
//   ).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-6">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
//             <div className="absolute inset-0 w-20 h-20 border-4 border-sky-200 rounded-full animate-ping"></div>
//           </div>
//           <div className="text-center">
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading contestant details</h3>
//             <p className="text-gray-500">Please wait while we fetch the information...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !contestant) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center">
//         <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-100">
//           <p className="text-red-600 text-lg font-semibold">{error || 'Contestant not found'}</p>
//           <Link
//             href="/contestants"
//             className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Contestants
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//       <UserSidebar />
//       <main className="flex-1 p-6 md:p-10">
//         <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
//           <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Link
//                   href="/contestants"
//                   className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 group"
//                 >
//                   <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-violet-600 transition-colors" />
//                 </Link>
//                 <div>
//                   <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                     {contestant.name || 'Contestant'}
//                   </h1>
//                   <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
//                     <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-lg font-medium">
//                       #{contestant.contestantNumber || 'N/A'}
//                     </span>
//                     <span>{contestant.groupName || 'N/A'}</span>
//                     <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                     <span className="capitalize font-medium text-purple-600">
//                       {contestant.category || 'N/A'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="relative">
//                 <div className="relative group">
//                   <input
//                     type="text"
//                     placeholder="Search programs..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-72 pl-12 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     aria-label="Search programs"
//                   />
//                   <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-violet-500 transition-colors" />
//                   {searchQuery && (
//                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                       <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="mx-auto py-8">
//           <div className="mb-8">
//             <div className="bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500">
//               <div className="flex items-center gap-6">
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                     {contestant.name ? contestant.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
//                     <Star className="w-3 h-3 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-2">{contestant.name || 'Unknown'}</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
//                       <span className="text-gray-600">
//                         No: <span className="font-semibold text-gray-800">{contestant.contestantNumber || 'N/A'}</span>
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
//                       <span className="text-gray-600">
//                         Group: <span className="font-semibold text-gray-800">{contestant.groupName || 'N/A'}</span>
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                       <span className="text-gray-600">
//                         Category: <span className="font-semibold text-gray-800 capitalize">{contestant.category || 'N/A'}</span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl">
//                     <Trophy className="w-5 h-5 text-violet-600" />
//                     <span className="font-bold text-violet-800">{registeredCount}</span>
//                     <span className="text-violet-600 text-sm">Programs</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//   <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-md border border-white/30">
//     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//       <div className="w-6 h-6 bg-gradient-to-r from-violet-600 to-purple-600 rounded-md flex items-center justify-center">
//         <Award className="w-3 h-3 text-white" />
//       </div>
//       Registration Summary
//     </h3>
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//       <div className="group hover:scale-102 transition-all duration-300">
//         <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100 shadow-sm hover:shadow-md">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm font-medium text-violet-700">Total Programs</p>
//             <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <Trophy className="w-4 h-4 text-white" />
//             </div>
//           </div>
//           <div className="flex items-baseline gap-1">
//             <p className="text-2xl font-bold text-violet-900">{registeredCount}</p>
//             <p className="text-sm text-violet-600">/10</p>
//           </div>
//           <div className="mt-2 w-full bg-violet-100 rounded-full h-1.5">
//             <div
//               className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
//               style={{ width: `${(registeredCount / 10) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//       <div className="group hover:scale-102 transition-all duration-300">
//         <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100 shadow-sm hover:shadow-md">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm font-medium text-sky-700">Individual</p>
//             <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center">
//               <Users className="w-4 h-4 text-white" />
//             </div>
//           </div>
//           <div className="flex items-baseline gap-1">
//             <p className="text-2xl font-bold text-sky-900">{generalIndividualCount}</p>
//             <p className="text-sm text-sky-600">/4</p>
//           </div>
//           <div className="mt-2 w-full bg-sky-100 rounded-full h-1.5">
//             <div
//               className="bg-gradient-to-r from-sky-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
//               style={{ width: `${(generalIndividualCount / 4) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//       <div className="group hover:scale-102 transition-all duration-300">
//         <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-sm font-medium text-emerald-700">Group</p>
//             <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
//               <Users className="w-4 h-4 text-white" />
//             </div>
//           </div>
//           <div className="flex items-baseline gap-1">
//             <p className="text-2xl font-bold text-emerald-900">{generalGroupCount}</p>
//             <p className="text-sm text-emerald-600">/3</p>
//           </div>
//           <div className="mt-2 w-full bg-emerald-100 rounded-full h-1.5">
//             <div
//               className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500"
//               style={{ width: `${(generalGroupCount / 3) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//           <div className="mb-8">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <Filter className="w-5 h-5 text-gray-600" />
//               Filter by Category
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => setCategoryFilter(category)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
//                     categoryFilter === category
//                       ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
//                       : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/20'
//                   }`}
//                 >
//                   {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//                   <span className="ml-2 text-xs opacity-75">({categoryCounts[category] || 0})</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mb-8">
//             <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
//               <div className="flex gap-2">
//                 {[
//                   { key: 'all', label: `All Stages (${programCounts.all})`, icon: <Filter className="w-4 h-4" /> },
//                   { key: 'stage', label: `On Stage (${programCounts.stage})`, icon: <Trophy className="w-4 h-4" /> },
//                   { key: 'offstage', label: `Off Stage (${programCounts.offstage})`, icon: <Target className="w-4 h-4" /> }
//                 ].map((item) => (
//                   <button
//                     key={item.key}
//                     onClick={() => setFilter(item.key)}
//                     className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
//                       filter === item.key
//                         ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transform scale-105'
//                         : 'text-gray-700 hover:bg-white/70 hover:shadow-md'
//                     }`}
//                   >
//                     {item.icon}
//                     {item.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-8">
//             {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
//               <div className="text-center py-20">
//                 <div className="w-32 h-32 bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//                   <Search className="w-16 h-16 text-violet-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-3">No programs found</h3>
//                 <p className="text-gray-600 text-lg">
//                   Try adjusting your filters or search query to find programs.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {filteredOwnCategoryPrograms.length > 0 && (
//                   <div>
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
//                         <Award className="w-5 h-5 text-white" />
//                       </div>
//                       <h4 className="text-2xl font-bold text-violet-700">Your Category Programs</h4>
//                       <div className="h-px bg-gradient-to-r from-violet-200 to-transparent flex-1"></div>
//                     </div>
//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                       {filteredOwnCategoryPrograms.map((program) => {
//                         const isRegistered = program.participants.includes(id);
//                         return (
//                           <div
//                             key={program._id}
//                             className="group cursor-pointer"
//                             onMouseEnter={() => setHoveredProgram(program._id)}
//                             onMouseLeave={() => setHoveredProgram(null)}
//                             onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                           >
//                             <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                               isRegistered
//                                 ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                 : 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600'
//                             }`}>
//                               <div className="absolute inset-0 opacity-10">
//                                 <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                                 <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                               </div>
//                               <div className="relative z-10 h-full flex flex-col">
//                                 <div className="flex items-center justify-between mb-3">
//                                   <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                     {getCategoryIcon(program.category)}
//                                     <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                       {(program.category || 'general').replace(/\(.*\)/, '')}
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center gap-1">
//                                     {getStageIcon(program.stage)}
//                                     <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                   </div>
//                                 </div>
//                                 <div className="flex-1 flex items-center justify-center">
//                                   <h3 className="font-bold text-center text-white text-lg leading-tight">
//                                     {program.name}
//                                   </h3>
//                                 </div>
//                                 <div className="flex items-center justify-between mt-4">
//                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                     hoveredProgram === program._id ? 'scale-110' : ''
//                                   }`}>
//                                     {isRegistered ? (
//                                       <CheckCircle className="w-6 h-6 text-white" />
//                                     ) : (
//                                       <Circle className="w-6 h-6 text-white" />
//                                     )}
//                                   </div>
//                                   <span className="text-sm font-semibold text-white/90">
//                                     {isRegistered ? 'Registered' : 'Available'}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//                 {filteredGeneralPrograms.length > 0 && (
//                   <div>
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
//                         <Sparkles className="w-5 h-5 text-white" />
//                       </div>
//                       <h4 className="text-2xl font-bold text-sky-700">General Programs</h4>
//                       <div className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold">
//                         Open to All
//                       </div>
//                       <div className="h-px bg-gradient-to-r from-sky-200 to-transparent flex-1"></div>
//                     </div>
//                     <div className="mb-8">
//                       <h5 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
//                         <Users className="w-5 h-5" />
//                         Individual Programs
//                       </h5>
//                       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                         {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === 'general(individual)').map((program) => {
//                           const isRegistered = program.participants.includes(id);
//                           return (
//                             <div
//                               key={program._id}
//                               className="group cursor-pointer"
//                               onMouseEnter={() => setHoveredProgram(program._id)}
//                               onMouseLeave={() => setHoveredProgram(null)}
//                               onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                             >
//                               <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                                 isRegistered
//                                   ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                   : 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600'
//                               }`}>
//                                 <div className="absolute inset-0 opacity-10">
//                                   <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                                 </div>
//                                 <div className="relative z-10 h-full flex flex-col">
//                                   <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                       <Users className="w-3 h-3 text-white" />
//                                       <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                         Individual
//                                       </span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       {getStageIcon(program.stage)}
//                                       <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex-1 flex items-center justify-center">
//                                     <h3 className="font-bold text-center text-white text-lg leading-tight">
//                                       {program.name}
//                                     </h3>
//                                   </div>
//                                   <div className="flex items-center justify-between mt-4">
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                       hoveredProgram === program._id ? 'scale-110' : ''
//                                     }`}>
//                                       {isRegistered ? (
//                                         <CheckCircle className="w-6 h-6 text-white" />
//                                       ) : (
//                                         <Circle className="w-6 h-6 text-white" />
//                                       )}
//                                     </div>
//                                     <span className="text-sm font-semibold text-white/90">
//                                       {isRegistered ? 'Registered' : 'Available'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                     <div>
//                       <h5 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
//                         <Users className="w-5 h-5" />
//                         Group Programs
//                       </h5>
//                       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                         {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === 'general(group)').map((program) => {
//                           const isRegistered = program.participants.includes(id);
//                           return (
//                             <div
//                               key={program._id}
//                               className="group cursor-pointer"
//                               onMouseEnter={() => setHoveredProgram(program._id)}
//                               onMouseLeave={() => setHoveredProgram(null)}
//                               onClick={() => handleToggleProgram(program._id, isRegistered, program)}
//                             >
//                               <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:rotate-1 min-h-[140px] shadow-lg hover:shadow-2xl ${
//                                 isRegistered
//                                   ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600'
//                                   : 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600'
//                               }`}>
//                                 <div className="absolute inset-0 opacity-10">
//                                   <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-8 translate-x-8"></div>
//                                   <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-6 -translate-x-6"></div>
//                                 </div>
//                                 <div className="relative z-10 h-full flex flex-col">
//                                   <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
//                                       <Users className="w-3 h-3 text-white" />
//                                       <span className="text-xs font-semibold text-white uppercase tracking-wide">
//                                         Group
//                                       </span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       {getStageIcon(program.stage)}
//                                       <span className="text-xs text-white/80 capitalize">{program.stage}</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex-1 flex items-center justify-center">
//                                     <h3 className="font-bold text-center text-white text-lg leading-tight">
//                                       {program.name}
//                                     </h3>
//                                   </div>
//                                   <div className="flex items-center justify-between mt-4">
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
//                                       hoveredProgram === program._id ? 'scale-110' : ''
//                                     }`}>
//                                       {isRegistered ? (
//                                         <CheckCircle className="w-6 h-6 text-white" />
//                                       ) : (
//                                         <Circle className="w-6 h-6 text-white" />
//                                       )}
//                                     </div>
//                                     <span className="text-sm font-semibold text-white/90">
//                                       {isRegistered ? 'Registered' : 'Available'}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }