import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  // Check for session and admin privileges
  const session = await getServerSession(authOptions);

  // Redirect to admin-login if no session exists or user is not an admin
  if (!session || session.user.name !== "admin") {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {children}
    </div>
  );
}