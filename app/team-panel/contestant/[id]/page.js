


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Award, Calendar, Tag, CheckCircle, Circle, Loader2, ArrowLeft, Search, Filter, Star, Trophy, User, Target, Zap, Clock, MapPin } from 'lucide-react';
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
    // Apply stage-specific rules
    if (program.stage === 'stage') {
      // Rule 1: Max 4 category-specific stage programs
      if (program.category?.toLowerCase() !== 'general(individual)' && program.category?.toLowerCase() !== 'general(group)') {
        if (contestant.category?.toLowerCase() !== 'subjunior') {
          const categoryStageItems = allPrograms.filter(p =>
            p.participants.includes(id) &&
            p.stage === 'stage' &&
            p.category?.toLowerCase() !== 'general(individual)' &&
            p.category?.toLowerCase() !== 'general(group)'
          ).length;

          if (categoryStageItems >= 4) {
            toast.error('Maximum 4 category-specific stage programs allowed per contestant.');
            return;
          }
        } else {
          console.log('Skipping max 4 limit check for subjunior contestant');
        }

        // Rule 2: Max 5 contestants from same team in stage item
        const programParticipants = allPrograms.find(p => p._id === programId)?.participants || [];
        const teamParticipants = await fetchTeamParticipants(programParticipants, contestant.groupName);
        if (teamParticipants >= 5) {
          toast.error('Maximum 5 contestants from the same team allowed in this category-specific stage item.');
          return;
        }
      }
    }

    // Rule 3: Max 10 category-specific items per contestant (excluding subjunior)
    if (contestant.category?.toLowerCase() !== 'subjunior') {
      const categorySpecificItems = allPrograms.filter(p =>
        p.participants.includes(id) &&
        p.category?.toLowerCase() !== 'general(individual)' &&
        p.category?.toLowerCase() !== 'general(group)'
      ).length;

      if (categorySpecificItems >= 10) {
        toast.error('Maximum 10 items allowed per contestant for category-specific programs.');
        return;
      }
    } else {
      console.log('Skipping max 10 limit check for subjunior contestant');
    }

    // Rule 4: General (Individual) limits
    if (program.category?.toLowerCase() === 'general(individual)') {
      const generalIndividualItems = allPrograms.filter(p =>
        p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)
      ).length;

      if (generalIndividualItems >= 4) {
        toast.error('Maximum 4 general(individual) items allowed per student.');
        return;
      }

      const programParticipants = allPrograms.find(p => p._id === programId)?.participants || [];
      const teamParticipants = await fetchTeamParticipants(programParticipants, contestant.groupName);
      if (teamParticipants >= 3) {
        toast.error('Maximum 3 contestants from the same team allowed in this general(individual) item.');
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
      return 0;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'senior':
        return <Trophy className="w-4 h-4" />;
      case 'junior':
        return <Star className="w-4 h-4" />;
      case 'subjunior':
        return <Target className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'senior':
        return 'from-amber-400 via-orange-400 to-red-400';
      case 'junior':
        return 'from-blue-400 via-purple-400 to-pink-400';
      case 'subjunior':
        return 'from-emerald-400 via-teal-400 to-cyan-400';
      case 'general(individual)':
        return 'from-violet-400 via-purple-400 to-indigo-400';
      case 'general(group)':
        return 'from-pink-400 via-rose-400 to-red-400';
      default:
        return 'from-gray-400 via-slate-400 to-gray-500';
    }
  };

  const categories = ['all', ...new Set(allPrograms.map(p => p.category?.toLowerCase() || 'general'))];

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Loading contestant details</h3>
            <p className="text-gray-600">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-gray-200 max-w-md">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Contestant Not Found</h3>
            <p className="text-red-500">{error || 'The requested contestant could not be found'}</p>
            <Link
              href="/contestants"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contestants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
        theme="light"
      />
      <UserSidebar />
      
      <main className='flex-1 overflow-hidden'>
        <div className="relative bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 backdrop-blur-xl border-b border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 to-purple-200/10"></div>
          <div className="relative px-6 py-8">
            <div className="mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getCategoryColor(contestant.category)} rounded-2xl flex items-center justify-center shadow-sm`}>
                      <span className="text-2xl font-bold text-white">
                        {contestant.name ? contestant.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 capitalize">
                      {contestant.name || 'Contestant'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>No. {contestant.contestantNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{contestant.groupName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(contestant.category)}
                        <span className="capitalize">{contestant.category || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search programs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                    <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <div className="bg-gradient-to-r from-emerald-100/40 to-teal-100/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">
                        {allPrograms.filter(p => p.participants.includes(id)).length} Programs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {(() => {
                      const categoryCount = allPrograms.filter(p =>
                        p.participants.includes(id) &&
                        p.category?.toLowerCase() !== 'general(individual)' &&
                        p.category?.toLowerCase() !== 'general(group)'
                      ).length;
                      return contestant.category?.toLowerCase() === 'subjunior'
                        ? categoryCount
                        : `${categoryCount}/10`;
                    })()}
                  </p>
                  <p className="text-blue-600 font-semibold">Category Programs</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${contestant.category?.toLowerCase() === 'subjunior' ? 100 : 
                      (allPrograms.filter(p =>
                        p.participants.includes(id) &&
                        p.category?.toLowerCase() !== 'general(individual)' &&
                        p.category?.toLowerCase() !== 'general(group)'
                      ).length / 10) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {allPrograms.filter(p => p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)).length}/4
                  </p>
                  <p className="text-emerald-600 font-semibold">General Individual</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(allPrograms.filter(p => p.category?.toLowerCase() === 'general(individual)' && p.participants.includes(id)).length / 4) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center">
      <Users className="w-6 h-6 text-white" />
    </div>
    <div className="text-right">
      <p className="text-3xl font-bold text-gray-900">
        {
          allPrograms.filter(
            p => p.category?.toLowerCase() === 'general(group)' && p.participants.includes(id)
          ).length
        }
      </p>
      <p className="text-pink-600 font-semibold">General Group</p>
    </div>
  </div>

  {/* Full-width bar (visual only, no limit) */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-500"
      style={{ width: '100%' }}
    ></div>
  </div>f
</div>

          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filter by Stage</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('stage')}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === 'stage'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'bg-white/20 text-gray-600 hover:bg-white/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  On Stage ({programCounts.stage})
                </div>
              </button>
              <button
                onClick={() => setFilter('offstage')}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === 'offstage'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'bg-white/20 text-gray-600 hover:bg-white/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Off Stage ({programCounts.offstage})
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Programs Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your filters or search query to find programs that match your criteria.
                </p>
              </div>
            ) : (
              <>
                {filteredOwnCategoryPrograms.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h4 className="text-xl font-bold text-gray-900">Your Category Programs</h4>
                      <div className="px-3 py-1 bg-purple-100 border border-purple-200 rounded-full">
                        <span className="text-purple-600 text-sm font-semibold">Personal</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredOwnCategoryPrograms.map((program) => {
                        const isRegistered = program.participants.includes(id);
                        return (
                          <div
                            key={program._id}
                            className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
                            onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(program.category)} rounded-xl flex items-center justify-center`}>
                                {getCategoryIcon(program.category)}
                              </div>
                              <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                isRegistered ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}>
                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                                  isRegistered ? 'left-6' : 'left-0.5'
                                }`}></div>
                              </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors capitalize">
                              {program.name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {(program.category || "general").replace(/\(.*\)/, "")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredGeneralPrograms.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                      <h4 className="text-xl font-bold text-gray-900">General Programs</h4>
                      <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="text-blue-600 text-sm font-semibold">Open to All</span>
                      </div>
                    </div>

                    {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === "general(individual)").length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-emerald-600 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Individual Programs
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredGeneralPrograms
                            .filter(p => p.category?.toLowerCase() === "general(individual)")
                            .map((program) => {
                              const isRegistered = program.participants.includes(id);
                              return (
                                <div
                                  key={program._id}
                                  className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-emerald-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
                                  onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                                      <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                      isRegistered ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}>
                                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                                        isRegistered ? 'left-6' : 'left-0.5'
                                      }`}></div>
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors capitalize">
                                    {program.name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="capitalize">{program.stage || 'N/A'}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === "general(group)").length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-pink-600 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Group Programs
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredGeneralPrograms
                            .filter(p => p.category?.toLowerCase() === "general(group)")
                            .map((program) => {
                              const isRegistered = program.participants.includes(id);
                              return (
                                <div
                                  key={program._id}
                                  className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-pink-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
                                  onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                                      <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                      isRegistered ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}>
                                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${
                                        isRegistered ? 'left-6' : 'left-0.5'
                                      }`}></div>
                                    </div>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors capitalize">
                                    {program.name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="capitalize">{program.stage || 'N/A'}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-12">
            <Link
              href="/team-panel"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contestants
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

