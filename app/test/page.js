'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export default function ScoreListing() {
  const [groupedScores, setGroupedScores] = useState({});
  const [filteredScores, setFilteredScores] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchScores = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/scores/list');
        console.log('Scores API response:', res.data);
        if (res.data.success) {
          setGroupedScores(res.data.data);
          setFilteredScores(res.data.data); // Initialize filteredScores with all items
          // Initialize all items as collapsed by default
          const initialItems = Object.keys(res.data.data).reduce((acc, key) => ({
            ...acc,
            [key]: false,
          }), {});
          setExpandedItems(initialItems);
        } else {
          setMessage({ type: 'error', text: res.data.message || 'Failed to load scores.' });
        }
      } catch (err) {
        console.error('Error fetching scores:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setMessage({ type: 'error', text: err.response?.data?.message || 'Server error fetching scores.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  useEffect(() => {
    // Filter scores based on search query
    if (!searchQuery.trim()) {
      setFilteredScores(groupedScores); // Show all scores if query is empty
      return;
    }

    const filtered = Object.keys(groupedScores).reduce((acc, key) => {
      const itemName = groupedScores[key].itemName;
      if (itemName.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[key] = groupedScores[key];
      }
      return acc;
    }, {});

    setFilteredScores(filtered);

    // Update expanded items based on filtered results
    const updatedExpandedItems = Object.keys(filtered).reduce((acc, key) => ({
      ...acc,
      [key]: false, // Keep items collapsed by default
    }), {});
    setExpandedItems(updatedExpandedItems);
  }, [searchQuery, groupedScores]);

  const toggleItem = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-black font-geist-sans">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .font-geist-sans { font-family: 'Geist Sans', system-ui, -apple-system, sans-serif; }
        .font-geist-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold font-geist-sans text-black">Score Listing</h1>
          <p className="text-gray-600 font-geist-mono mt-1">All scores sorted by item name and category</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search items by name..."
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white font-geist-sans text-black placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}></div>
              <span className="font-medium font-geist-sans">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto font-geist-mono">Click to dismiss</span>
            </div>
          </div>
        )}

        {/* Scores Section */}
        <div>
          {Object.keys(filteredScores).length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-geist-sans text-black">!</span>
              </div>
              <h3 className="text-lg font-semibold font-geist-sans text-black mb-2">No matching items found</h3>
              <p className="text-gray-600 font-geist-mono">Try adjusting your search query.</p>
            </div>
          ) : Object.keys(filteredScores).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-geist-sans text-black">!</span>
              </div>
              <h3 className="text-lg font-semibold font-geist-sans text-black mb-2">No items found</h3>
              <p className="text-gray-600 font-geist-mono">No scores have been recorded.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {Object.keys(filteredScores).map((key, index) => (
                <div key={key}>
                  <div
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer"
                    onClick={() => toggleItem(key)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-semibold font-geist-sans text-black">{index + 1}.</span>
                      <div>
                        <h3 className="text-lg font-semibold font-geist-sans text-black">
                          {filteredScores[key].itemName} ({filteredScores[key].category})
                        </h3>
                        <p className="text-sm text-gray-600 font-geist-mono">
                          Category: {filteredScores[key].category}, 
                          Type: {filteredScores[key].type}, 
                          Stage: {filteredScores[key].stage}
                        </p>
                      </div>
                    </div>
                    {expandedItems[key] ? (
                      <ChevronUp className="w-5 h-5 text-black" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-black" />
                    )}
                  </div>
                  {expandedItems[key] && (
                    <div className="mt-2 grid grid-cols-1 gap-4">
                      {filteredScores[key].scores.map((score) => (
                        <div
                          key={score.contestantId}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-sm text-gray-500 font-geist-mono uppercase">Code Letter</div>
                                <div className="text-base font-semibold font-geist-sans text-black">{score.codeLetter.toUpperCase()}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 font-geist-mono uppercase">Contestant Number</div>
                                <div className="text-base font-semibold font-geist-sans text-black">{score.contestantNumber}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 font-geist-mono uppercase">Team Name</div>
                                <div className="text-base font-semibold font-geist-sans text-black">{score.teamName}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 font-geist-mono uppercase">Category</div>
                                <div className="text-base font-semibold font-geist-sans text-black">{score.category}</div>
                              </div>
                              {score.rank !== 'N/A' && (
                                <span className="px-2 py-1 bg-black text-white text-xs font-semibold font-geist-sans rounded">
                                  {score.rank}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 font-geist-mono uppercase">Score</div>
                              <div className="text-base font-semibold font-geist-sans text-black">{score.score}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}