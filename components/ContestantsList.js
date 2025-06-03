async function fetchContestants(groupName) {
  const url = groupName
    ? `/api/contestants?groupName=${encodeURIComponent("Fakhriyah")}`
    : "/api/contestants";

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch contestants: ${res.statusText}`);
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
}

export default async function ContestantsPage({ searchParams }) {
  const groupName = searchParams.groupName || ""; // Extract groupName from query parameters

  let contestants = [];
  let error = null;

  try {
    contestants = await fetchContestants(groupName);
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Contestants {groupName ? `in ${groupName}` : "List"}
      </h1>

      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : contestants.length === 0 ? (
        <p className="text-gray-500">No contestants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Contestant Number</th>
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Group Name</th>
                <th className="border border-gray-300 p-2 text-left">Scratch Code</th>
              </tr>
            </thead>
            <tbody>
              {contestants.map((contestant) => (
                <tr key={contestant._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{contestant.contestantNumber || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{contestant.name}</td>
                  <td className="border border-gray-300 p-2">{contestant.groupName}</td>
                  <td className="border border-gray-300 p-2">{contestant.scratchCode || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}