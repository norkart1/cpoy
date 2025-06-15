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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    categoryFilter === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-white/20'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)} 
                  <span className="ml-2 text-xs opacity-75">({categoryCounts[category] || 0})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
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
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === 'stage'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                On Stage ({programCounts.stage})
              </button>
              <button
                onClick={() => setFilter('offstage')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === 'offstage'
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
          </div>
        </div>
      </main>
    </div>
  );
}