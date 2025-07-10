'use client';

import { useState, useEffect } from 'react';
import { Trophy, Search, Award, Download, ChevronRight, Star, Users, Target } from 'lucide-react';

// Dummy data
const dummyGroups = [
  { teamName: 'QUDWATHULULAMA', totalPoints: 450 },
  { teamName: 'SUHBATHUSSADATH', totalPoints: 380 },
  { teamName: 'NUSRATHULUMARA', totalPoints: 320 },
];

const dummyCategoryTop = {
  subJunior: [
    { id: 101, name: 'Ahmed R.', group: 'QUDWATHULULAMA', score: 98 },
    { id: 102, name: 'Fahad K.', group: 'SUHBATHUSSADATH', score: 95 },
    { id: 103, name: 'Muneer N.', group: 'NUSRATHULUMARA', score: 93 },
  ],
  junior: [
    { id: 201, name: 'Yusuf A.', group: 'QUDWATHULULAMA', score: 97 },
    { id: 202, name: 'Nashit T.', group: 'SUHBATHUSSADATH', score: 94 },
    { id: 203, name: 'Ibrahim Z.', group: 'NUSRATHULUMARA', score: 92 },
  ],
  senior: [
    { id: 301, name: 'Rashid M.', group: 'QUDWATHULULAMA', score: 96 },
    { id: 302, name: 'Salman N.', group: 'SUHBATHUSSADATH', score: 93 },
    { id: 303, name: 'Hakeem V.', group: 'NUSRATHULUMARA', score: 91 },
  ],
};

const dummyTopPerformers = {
  QUDWATHULULAMA: [
    { id: 1, name: 'Fazil T.', score: 96, category: 'Senior' },
    { id: 2, name: 'Nihal U.', score: 94, category: 'Junior' },
    { id: 3, name: 'Shamil K.', score: 92, category: 'Sub Junior' },
  ],
  SUHBATHUSSADATH: [
    { id: 4, name: 'Saif A.', score: 93, category: 'Senior' },
    { id: 5, name: 'Ziyad H.', score: 91, category: 'Junior' },
    { id: 6, name: 'Rizwan S.', score: 90, category: 'Sub Junior' },
  ],
  NUSRATHULUMARA: [
    { id: 7, name: 'Irfan J.', score: 95, category: 'Senior' },
    { id: 8, name: 'Ajmal V.', score: 92, category: 'Junior' },
    { id: 9, name: 'Basheer M.', score: 89, category: 'Sub Junior' },
  ],
};

const dummyContestants = {
  133: {
    name: 'Haseeb Rahman',
    category: 'Junior',
    group: 'QUDWATHULULAMA',
    score: 91,
    rankCategory: 4,
    rankGroup: 2,
  },
};

export default function DarsFestResults() {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (id) => {
    if (dummyContestants[id]) {
      setSearchResult(dummyContestants[id]);
    } else {
      setSearchResult('not_found');
    }
  };

  const downloadPDF = () => {
    console.log('PDF download functionality would be implemented here');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Floating Navigation */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-6 text-white text-sm font-medium">
            <button className="hover:text-gray-300 transition-colors">Rankings</button>
            <button className="hover:text-gray-300 transition-colors">Performers</button>
            <button className="hover:text-gray-300 transition-colors">Search</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-transparent"></div>
          <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="bg-black/10 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Results Released
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black leading-none mb-6 tracking-tighter">
              DARS
              <br />
              <span className="text-outline">FEST</span>
            </h1>
            
            <div className="text-2xl md:text-3xl font-light tracking-wide mb-8">
              Alathurpadi • 2025
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Celebrating academic excellence and intellectual achievement. 
              Discover the outstanding performers who have excelled in this year's competition.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={downloadPDF}
              className="group bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Download Results
            </button>
            
            <button className="border-2 border-black text-black px-8 py-4 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3">
              View Live Rankings
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Groups</div>
            </div>
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">450</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Highest Score</div>
            </div>
            <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">9</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Categories</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
            <div className="w-1 h-3 bg-black rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Find Your Results</h2>
            <p className="text-gray-600 text-lg">Enter your contestant ID to view your individual performance</p>
          </div>

          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Enter contestant ID (e.g., 133)"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-black transition-colors bg-white"
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>

          {searchResult && searchResult !== 'not_found' && (
            <div className="bg-white rounded-3xl p-8 shadow-xl border max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{searchResult.name}</h3>
                  <p className="text-gray-600">ID: {searchId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Category</div>
                    <div className="text-lg font-semibold">{searchResult.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Group</div>
                    <div className="text-lg font-semibold">{searchResult.group}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Total Score</div>
                    <div className="text-2xl font-bold">{searchResult.score} pts</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide">Category Rank</div>
                      <div className="text-lg font-semibold">#{searchResult.rankCategory}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide">Group Rank</div>
                      <div className="text-lg font-semibold">#{searchResult.rankGroup}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {searchResult === 'not_found' && (
            <div className="text-center text-red-600 font-semibold">
              Contestant not found. Please check your ID and try again.
            </div>
          )}
        </div>
      </div>

      {/* Overall Champion */}
      <div className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-4xl font-bold mb-4">Overall Champion</h2>
            <p className="text-gray-300 text-lg">The highest scoring performer across all categories</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-5xl font-bold mb-2">{dummyTopPerformers['QUDWATHULULAMA'][0].name}</div>
            <div className="text-xl text-gray-300 mb-4">
              ID: {dummyTopPerformers['QUDWATHULULAMA'][0].id} • QUDWATHULULAMA
            </div>
            <div className="text-6xl font-black text-yellow-400 mb-4">
              {dummyTopPerformers['QUDWATHULULAMA'][0].score}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Points</div>
          </div>
        </div>
      </div>

      {/* Group Rankings */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Group Rankings</h2>
            <p className="text-gray-600 text-lg">Final standings based on cumulative performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyGroups.map((group, index) => (
              <div
                key={group.teamName}
                className={`relative rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
                  index === 0
                    ? 'bg-black text-white shadow-2xl'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-black'
                }`}
              >
                {index === 0 && (
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    index === 0 ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm opacity-60 uppercase tracking-wide">Group</div>
                    <div className="text-lg font-bold">{group.teamName}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-black mb-1">{group.totalPoints}</div>
                  <div className="text-sm opacity-60 uppercase tracking-wide">Total Points</div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm opacity-60 uppercase tracking-wide mb-2">Top Performers</div>
                  {dummyTopPerformers[group.teamName].slice(0, 3).map((performer, i) => (
                    <div key={performer.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-current opacity-20 rounded-full flex items-center justify-center text-xs">
                          {i + 1}
                        </div>
                        <span className="font-medium">{performer.name}</span>
                      </div>
                      <span className="font-bold">{performer.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Champions */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Category Champions</h2>
            <p className="text-gray-600 text-lg">Top performers in each age category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(dummyCategoryTop).map(([category, performers]) => (
              <div key={category} className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-black transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-black" />
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Category</div>
                    <div className="text-xl font-bold capitalize">
                      {category.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {performers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-black text-white' : 'bg-gray-200 text-black'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{performer.name}</div>
                        <div className="text-sm text-gray-500">ID: {performer.id} • {performer.group}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{performer.score}</div>
                        <div className="text-sm text-gray-500">pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Alathurpadi Dars Fest 2025</h3>
          <p className="text-gray-400 mb-8">
            Congratulations to all participants for their outstanding performance and dedication to academic excellence.
          </p>
          <div className="text-sm text-gray-500">
            Results generated on {new Date().toLocaleDateString('en-GB', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 2px black;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}