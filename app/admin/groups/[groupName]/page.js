'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Award, ArrowLeft, Loader2, Search, Table } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function GroupDetailsPage() {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { groupName } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchGroupData() {
      if (!groupName) {
        setError('Group name is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/admin/groups/${encodeURIComponent(groupName)}/details`);
        if (!res.ok) {
          const text = await res.text();
          console.error('Group API response:', text);
          throw new Error(`Failed to fetch group data: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch group data');
        }
        setGroupData(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while loading group data');
        toast.error(err.message || 'Failed to load group data');
      } finally {
        setLoading(false);
      }
    }

    fetchGroupData();
  }, [groupName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-100">
          <p className="text-red-600 text-lg font-semibold">{error || 'Group not found'}</p>
          <Link
            href="/admin/groups"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  const { groupName: name, contestants, items } = groupData;

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      <main className="flex-1 p-6 md:p-10">
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Group: {name}
              </h1>
              <p className="text-gray-600 mt-1">
                {contestants.length} Contestants • {items.length} Items Registered
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-indigo-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70"
                  aria-label="Search items"
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
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                  <p className="text-gray-600 text-sm">
                    Total Contestants: {contestants.length}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Total Items Registered: {items.length}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                    <Award className="w-4 h-4 mr-2" />
                    {items.length} Items
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Table className="w-5 h-5" />
              Registered Items and Contestants
            </h3>
            {filteredItems.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600">No items found for this group.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Contestants
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <tr key={item._id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.stage.charAt(0).toUpperCase() + item.stage.slice(1)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <ul className="list-disc pl-5">
                            {item.participants.map((participant) => (
                              <li key={participant._id}>
                                {participant.name} (No: {participant.contestantNumber})
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
