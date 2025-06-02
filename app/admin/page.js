import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to admin-login if no session exists or user.name is not "admin"
  if (!session || session.user.name !== "admin") {
    redirect("/admin-login");
  }

  return (
    <div className="p-4 text-xl text-blue-50">
      Admin Dashboard Page
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}