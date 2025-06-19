"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/adminSidebar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ManageItemPage() {
  const params = useParams();
  const itemId = params.id;

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [itemName, setItemName] = useState("");
  const [message, setMessage] = useState(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/items/${itemId}/participants`);
      if (!res.ok) {
        setParticipants([]);
        setMessage({ type: "error", text: "Failed to fetch participants." });
        setLoading(false);
        return;
      }
      const data = await res.json();
      setParticipants(data.participants || []);
      setItemName(data.itemName || "Unknown Item");
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setParticipants([]);
      setMessage({ type: "error", text: "Server error fetching participants." });
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId) fetchParticipants();
  }, [itemId, fetchParticipants]);

  const filtered = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.groupName?.toLowerCase().includes(search.toLowerCase()) ||
      p.contestantNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Alathurpadi Dars Fest", 15, 15);
    doc.setFontSize(14);
    doc.text(`Participants for ${itemName}`, 15, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 15, 32);

    // Table
    autoTable(doc, {
      startY: 40,
      head: [["#", "Contestant Number", "Name", "Group", "Category"]],
      body: filtered.map((p, index) => [
        index + 1,
        p.contestantNumber || "N/A",
        p.name || "Unknown",
        p.groupName || "N/A",
        p.category || "Unknown",
      ]),
      margin: { top: 40, left: 15, right: 15, bottom: 20 },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 2,
        textColor: [33, 33, 33], // #212121
      },
      headStyles: {
        fillColor: [229, 231, 235], // #e5e7eb
        textColor: [55, 65, 81], // #374151
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // #f9fafb
      },
      columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 40 }, // Contestant Number
        2: { cellWidth: 50 }, // Name
        3: { cellWidth: 50 }, // Group
        4: { cellWidth: 40 }, // Category
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: "right" });
    }

    // Save PDF
    doc.save(`${itemName}_participants.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Participants</h1>
            <p className="text-sm text-gray-600">Item: {itemName}</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search number, name, or group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <button
              onClick={downloadPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Download PDF
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600">No matching participants found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border-b">#</th>
                  <th className="px-4 py-3 border-b">Contestant Number</th>
                  <th className="px-4 py-3 border-b">Name</th>
                  <th className="px-4 py-3 border-b">Group</th>
                  <th className="px-4 py-3 border-b">Category</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filtered.map((p, index) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border-b">{index + 1}</td>
                    <td className="px-4 py-3 border-b">{p.contestantNumber || "N/A"}</td>
                    <td className="px-4 py-3 border-b font-medium">{p.name}</td>
                    <td className="px-4 py-3 border-b">{p.groupName || "N/A"}</td>
                    <td className="px-4 py-3 border-b capitalize">{p.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}