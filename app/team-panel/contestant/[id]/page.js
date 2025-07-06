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
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Load filter states from local storage on client-side
        if (typeof window !== 'undefined') {
          setSearchQuery(localStorage.getItem('itemSearchQuery') || '');
          setFilter(localStorage.getItem('stageFilter') || 'stage');
        }

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

  useEffect(() => {
    // Save filter states to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('itemSearchQuery', searchQuery);
      localStorage.setItem('stageFilter', filter);
    }
  }, [searchQuery, filter]);

  const handleToggleProgram = async (programId, isRegistered, program) => {
    if (!confirm(`Are you sure you want to ${isRegistered ? 'remove' : 'add'} "${program.name}" for this contestant?`)) {
      return;
    }


    if (!isRegistered) {
      const isGeneralIndividual = program.category?.toLowerCase() === 'general(individual)';
      const isGeneralGroup = program.category?.toLowerCase() === 'general(group)';
      const isCategorySpecific = !isGeneralIndividual && !isGeneralGroup;
      const isSubjunior = contestant.category?.toLowerCase() === 'subjunior';

      // ================================
      // 📌 Rule 1: Category-Specific Limits
      // ================================
      if (isCategorySpecific && !isSubjunior) {
        // ✅ Rule 1A: Max 4 stage programs per contestant
        if (program.stage === 'stage') {
          const categoryStageCount = allPrograms.filter(p =>
            p.participants.includes(id) &&
            p.stage === 'stage' &&
            !['general(individual)', 'general(group)'].includes(p.category?.toLowerCase())
          ).length;

          if (categoryStageCount >= 4) {
            toast.error('Maximum 4 category-specific stage programs allowed per contestant.');
            return;
          }
        }

        // ✅ Rule 1B: Max 10 offstage category-specific programs per contestant
        if (program.stage === 'offstage') {
          const categoryOffstageCount = allPrograms.filter(p =>
            p.participants.includes(id) &&
            p.stage === 'offstage' &&
            !['general(individual)', 'general(group)'].includes(p.category?.toLowerCase())
          ).length;

          if (categoryOffstageCount >= 10) {
            toast.error('Maximum 10 category-specific offstage programs allowed per contestant.');
            return;
          }
        }

        // ✅ Rule 1C: Max 5 from same team in stage programs
        if (program.stage === 'stage') {
          const programParticipants = allPrograms.find(p => p._id === programId)?.participants || [];
          const teamParticipants = await fetchTeamParticipants(programParticipants, contestant.groupName);

          if (teamParticipants >= 5) {
            toast.error('Maximum 5 contestants from the same team allowed in this category-specific stage program.');
            return;
          }
        }
      }

      // ================================
      // 📌 Rule 2: General (Individual) Limits
      // ================================
      if (isGeneralIndividual) {
        // ✅ Rule 2A: Max 4 stage programs per contestant
        if (program.stage === 'stage') {
          const generalIndividualStageCount = allPrograms.filter(p =>
            p.participants.includes(id) &&
            p.stage === 'stage' &&
            p.category?.toLowerCase() === 'general(individual)'
          ).length;

          if (generalIndividualStageCount >= 4) {
            toast.error('Maximum 4 general (individual) stage programs allowed per contestant.');
            return;
          }
        }

        // ✅ Rule 2B: Max 4 offstage programs per contestant
        if (program.stage === 'offstage') {
          const generalIndividualOffstageCount = allPrograms.filter(p =>
            p.participants.includes(id) &&
            p.stage === 'offstage' &&
            p.category?.toLowerCase() === 'general(individual)'
          ).length;

          if (generalIndividualOffstageCount >= 4) {
            toast.error('Maximum 4 general (individual) offstage programs allowed per contestant.');
            return;
          }
        }

        // ✅ Rule 2C: Max 3 contestants per team for this program
        const programParticipants = allPrograms.find(p => p._id === programId)?.participants || [];
        const teamParticipants = await fetchTeamParticipants(programParticipants, contestant.groupName);

        if (teamParticipants >= 3) {
          toast.error(`Maximum 3 contestants from the same team allowed in this general (individual) ${program.stage} program.`);
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
      const res = await fetch(`/api/team-count?groupName=${encodeURIComponent(groupName)}&participantIds=${participantIds.join(',')}`);
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
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'junior':
        return <Star className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'subjunior':
        return <Target className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />;
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

  // Calculate stage and offstage category-specific program counts
  const stageCategoryCount = allPrograms.filter(p =>
    p.participants.includes(id) &&
    p.stage === 'stage' &&
    p.category?.toLowerCase() !== 'general(individual)' &&
    p.category?.toLowerCase() !== 'general(group)'
  ).length;

  const offstageCategoryCount = allPrograms.filter(p =>
    p.participants.includes(id) &&
    p.stage === 'offstage' &&
    p.category?.toLowerCase() !== 'general(individual)' &&
    p.category?.toLowerCase() !== 'general(group)'
  ).length;

  // Calculate general individual program counts
  const generalIndividualStageCount = allPrograms.filter(p =>
    p.participants.includes(id) &&
    p.category?.toLowerCase() === 'general(individual)' &&
    p.stage === 'stage'
  ).length;

  const generalIndividualOffstageCount = allPrograms.filter(p =>
    p.participants.includes(id) &&
    p.category?.toLowerCase() === 'general(individual)' &&
    p.stage === 'offstage'
  ).length;

  // Calculate general group program count
  const generalGroupCount = allPrograms.filter(p =>
    p.participants.includes(id) &&
    p.category?.toLowerCase() === 'general(group)'
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 font-geist-sans">Loading contestant details</h3>
            <p className="text-gray-600 font-geist-mono">Please wait while we fetch the information...</p>
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
            <h3 className="text-xl font-semibold text-gray-900 font-geist-sans">Contestant Not Found</h3>
            <p className="text-red-500 font-geist-mono">{error || 'The requested contestant could not be found'}</p>
            <Link
              href="/contestants"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-sm font-geist-sans"
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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .font-geist-sans {
          font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
        }
        .font-geist-mono {
          font-family: 'JetBrains Mono', 'Geist Mono', monospace;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.1);
        }
      `}</style>

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

        <main className="flex-1 overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 backdrop-blur-xl border-b border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 to-purple-200/10"></div>
            <div className="relative px-4 sm:px-6 py-8">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative">
                      <div className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br ${getCategoryColor(contestant.category)} rounded-2xl flex items-center justify-center shadow-sm glass-effect`}>
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          {contestant.name ? contestant.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-4 border-white">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 capitalize font-geist-sans">
                        {contestant.name || 'Contestant'}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm sm:text-base font-geist-mono">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>No. {contestant.contestantNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    <div className="relative flex-1 sm:w-80">
                      <input
                        type="text"
                        placeholder="Search programs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white/40 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base glass-effect"
                        aria-label="Search programs"
                      />
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-100/40 to-pink-100/40 backdrop-blur-sm rounded-2xl px-4 py-2 sm:py-3 border border-purple-200 glass-effect">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold text-sm sm:text-base font-geist-mono">
                          {allPrograms.filter(p => p.participants.includes(id)).length} Programs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {(filter === 'all' || filter === 'stage') && (
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm min-h-[140px] sm:min-h-[160px] glass-effect">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-geist-sans">
                        {contestant.category?.toLowerCase() === 'subjunior'
                          ? stageCategoryCount
                          : `${stageCategoryCount}/4`}
                      </p>
                      <p className="text-blue-600 font-semibold text-sm sm:text-base font-geist-mono">On Stage Category</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${contestant.category?.toLowerCase() === 'subjunior' ? 100 : (stageCategoryCount / 4) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {(filter === 'all' || filter === 'offstage') && (
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm min-h-[140px] sm:min-h-[160px] glass-effect">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-geist-sans">
                        {contestant.category?.toLowerCase() === 'subjunior'
                          ? offstageCategoryCount
                          : `${offstageCategoryCount}/10`}
                      </p>
                      <p className="text-teal-600 font-semibold text-sm sm:text-base font-geist-mono">Off Stage Category</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${contestant.category?.toLowerCase() === 'subjunior' ? 100 : (offstageCategoryCount / 10) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {(filter === 'all' || filter === 'stage') && (
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm min-h-[140px] sm:min-h-[160px] glass-effect">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                      <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-geist-sans">
                        {contestant.category?.toLowerCase() === 'subjunior'
                          ? generalIndividualStageCount
                          : `${generalIndividualStageCount}/4`}
                      </p>
                      <p className="text-emerald-600 font-semibold text-sm sm:text-base font-geist-mono">General Individual (Stage)</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${contestant.category?.toLowerCase() === 'subjunior' ? 100 : (generalIndividualStageCount / 4) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {(filter === 'all' || filter === 'offstage') && (
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm min-h-[140px] sm:min-h-[160px] glass-effect">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                      <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-geist-sans">
                        {contestant.category?.toLowerCase() === 'subjunior'
                          ? generalIndividualOffstageCount
                          : `${generalIndividualOffstageCount}/4`}
                      </p>
                      <p className="text-emerald-600 font-semibold text-sm sm:text-base font-geist-mono">General Individual (Offstage)</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${contestant.category?.toLowerCase() === 'subjunior' ? 100 : (generalIndividualOffstageCount / 4) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 hover:bg-white/50 transition-all duration-300 shadow-sm min-h-[140px] sm:min-h-[160px] glass-effect">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-geist-sans">
                      {generalGroupCount}
                    </p>
                    <p className="text-pink-600 font-semibold text-sm sm:text-base font-geist-mono">General Group</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm glass-effect">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 font-geist-sans">Filters</h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter('stage')}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-geist-sans ${filter === 'stage'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'bg-white/20 text-gray-600 hover:bg-white/30'
                    }`}
                  aria-label="Filter by on stage programs"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    On Stage ({programCounts.stage})
                  </div>
                </button>
                <button
                  onClick={() => setFilter('offstage')}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-geist-sans ${filter === 'offstage'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'bg-white/20 text-gray-600 hover:bg-white/30'
                    }`}
                  aria-label="Filter by off stage programs"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Off Stage ({programCounts.offstage})
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {filteredOwnCategoryPrograms.length === 0 && filteredGeneralPrograms.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 sm:w-12 h-10 sm:h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-geist-sans">No Programs Found</h3>
                  <p className="text-gray-600 text-sm sm:text-base font-geist-mono max-w-md mx-auto">
                    Try adjusting your filters or search query to find programs that match your criteria.
                  </p>
                </div>
              ) : (
                <>
                  {filteredOwnCategoryPrograms.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-geist-sans">Your Category Programs</h4>
                        <div className="px-3 py-1 bg-purple-100 border border-purple-200 rounded-full">
                          <span className="text-purple-600 text-xs sm:text-sm font-semibold font-geist-mono">Personal</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredOwnCategoryPrograms.map((program, index) => {
                          const isRegistered = program.participants.includes(id);
                          return (
                            <div
                              key={program._id}
                              className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-purple-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm animate-fade-in glass-effect"
                              style={{ animationDelay: `${index * 0.1}s` }}
                              onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                              aria-label={`${isRegistered ? 'Remove' : 'Add'} ${program.name} program`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(program.category)} rounded-xl flex items-center justify-center`}>
                                  {getCategoryIcon(program.category)}
                                </div>
                                <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isRegistered ? 'bg-purple-500' : 'bg-gray-400'
                                  }`}>
                                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${isRegistered ? 'left-6' : 'left-0.5'
                                    }`}></div>
                                </div>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors capitalize text-sm sm:text-base font-geist-sans">
                                {program.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 capitalize font-geist-mono">
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
                        <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-geist-sans">General Programs</h4>
                        <div className="px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                          <span className="text-blue-600 text-xs sm:text-sm font-semibold font-geist-mono">Open to All</span>
                        </div>
                      </div>

                      {filteredGeneralPrograms.filter(p => p.category?.toLowerCase() === "general(individual)").length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-base sm:text-lg font-semibold text-emerald-600 flex items-center gap-2 font-geist-sans">
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            Individual Programs
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredGeneralPrograms
                              .filter(p => p.category?.toLowerCase() === "general(individual)")
                              .map((program, index) => {
                                const isRegistered = program.participants.includes(id);
                                return (
                                  <div
                                    key={program._id}
                                    className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-emerald-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm animate-fade-in glass-effect"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                                    aria-label={`${isRegistered ? 'Remove' : 'Add'} ${program.name} program`}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                      </div>
                                      <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isRegistered ? 'bg-purple-500' : 'bg-gray-400'
                                        }`}>
                                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${isRegistered ? 'left-6' : 'left-0.5'
                                          }`}></div>
                                      </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors capitalize text-sm sm:text-base font-geist-sans">
                                      {program.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-geist-mono">
                                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
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
                          <h5 className="text-base sm:text-lg font-semibold text-pink-600 flex items-center gap-2 font-geist-sans">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                            Group Programs
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredGeneralPrograms
                              .filter(p => p.category?.toLowerCase() === "general(group)")
                              .map((program, index) => {
                                const isRegistered = program.participants.includes(id);
                                return (
                                  <div
                                    key={program._id}
                                    className="group bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 hover:bg-white/50 hover:border-pink-400 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm animate-fade-in glass-effect"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => handleToggleProgram(program._id, isRegistered, program)}
                                    aria-label={`${isRegistered ? 'Remove' : 'Add'} ${program.name} program`}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                      </div>
                                      <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isRegistered ? 'bg-purple-500' : 'bg-gray-400'
                                        }`}>
                                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all duration-300 ${isRegistered ? 'left-6' : 'left-0.5'
                                          }`}></div>
                                      </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors capitalize text-sm sm:text-base font-geist-sans">
                                      {program.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-geist-mono">
                                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
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

            <div className="mt-8 sm:mt-12">
              <Link
                href="/team-panel"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-sm text-sm sm:text-base font-geist-sans"
                aria-label="Back to contestants list"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Contestants
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
