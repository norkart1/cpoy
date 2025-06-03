'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContestantsPage() {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let groupName="Fakhriyah"

  useEffect(() => {
    async function fetchContestants() {
      try {
const response = await fetch(`/api/manege-contestants?groupName=${encodeURIComponent(groupName)}`);        const result = await response.json();
        
        if (result.success) {
          setContestants(result.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contestants List</h1>
      <div className="grid gap-4">
        {contestants.length === 0 ? (
          <p className="text-gray-500">No contestants found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Contestant Number</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Group Name</th>
                  <th className="border p-2 text-left">Scratch Code</th>
                </tr>
              </thead>
              <tbody>
                {contestants.map((contestant) => (
                  <tr key={contestant._id} className="hover:bg-gray-50">
                    <td className="border p-2">{contestant.contestantNumber}</td>
                    <td className="border p-2">{contestant.name}</td>
                    <td className="border p-2">{contestant.groupName}</td>
                    <td className="border p-2">{contestant.scratchCode || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Link
        href="/"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Home
      </Link>
    </div>
  );
}