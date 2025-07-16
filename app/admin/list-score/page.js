"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/adminSidebar";
import axios from "axios";

export default function ItemListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    // const stored = localStorage.getItem("admin");
    // if (!stored) {
    //   setMessage({ type: "error", text: "Please log in as an admin to access this page." });
    //   setTimeout(() => router.push("/admin/login"), 1000);
    //   return;
    // }

    try {
    //   const parsed = JSON.parse(stored);
    //   if (!parsed?._id) {
    //     setMessage({ type: "error", text: "Invalid admin session. Please log in again." });
    //     setTimeout(() => router.push("/admin/login"), 1000);
    //     return;
    //   }

      // Fetch items
      const fetchItems = async () => {
        try {
          setLoading(true);
          const res = await axios.get("/api/admin/scores/items");
          console.log("Items API response:", res.data);
          if (res.data.success) {
            setItems(res.data.items || []);
          } else {
            setMessage({ type: "error", text: res.data.message || "Failed to load items." });
            setItems([]);
          }
        } catch (err) {
          console.error("Error fetching items:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          setMessage({ type: "error", text: err.response?.data?.message || "Server error fetching items." });
          setItems([]);
        } finally {
          setLoading(false);
        }
      };

      fetchItems();
    } catch (err) {
      console.error("Error parsing admin data:", err);
      setMessage({ type: "error", text: "Invalid session data. Please log in again." });
      setTimeout(() => router.push("/admin/login"), 1000);
    }
  }, [router]);

  const filteredItems = items.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Items and Categories</h1>
            <p className="text-sm text-gray-600">List of all items from scores</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search item name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
            onClick={() => setMessage(null)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}></div>
              <span className="font-medium">{message.text}</span>
              <span className="text-sm opacity-70 ml-auto">Click to dismiss</span>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-600">No items found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border-b">#</th>
                  <th className="px-4 py-3 border-b">Item Name</th>
                  <th className="px-4 py-3 border-b">Category</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filteredItems.map((item, index) => (
                  <tr key={`${item.itemName}-${item.category}`} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border-b">{index + 1}</td>
                    <td className="px-4 py-3 border-b font-medium">{item.itemName || "N/A"}</td>
                    <td className="px-4 py-3 border-b capitalize">{item.category || "N/A"}</td>
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