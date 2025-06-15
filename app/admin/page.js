import Link from "next/link";
import {
  Award,
  Users,
  User,
  Plus,
  BarChart3,
  Calendar,
  Settings,
  Trophy,
  Target,
  UserPlus,
  FileText,
  Shield
} from "lucide-react";
import AdminSidebar from '@/components/adminSidebar';

export default async function AdminDashboardPage() {
  // Quick stats data (you can fetch this from your API)
  const stats = [
    {
      title: "Total Competitions",
      value: "24",
      change: "+3 this week",
      icon: Award,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Registered Contestants",
      value: "156",
      change: "+12 today",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Active Juries",
      value: "8",
      change: "2 online now",
      icon: Shield,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Completed Events",
      value: "15",
      change: "+5 this week",
      icon: Trophy,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ];

  const quickActions = [
    {
      title: "Add Competition",
      description: "Create new fest competitions",
      href: "/admin/add-item",
      icon: Plus,
      color: "from-indigo-600 to-purple-600",
      hoverColor: "hover:shadow-indigo-500/25"
    },
    {
      title: "Add Students",
      description: "Add new students to the system",
      href: "/admin/contestants",
      icon: UserPlus,
      color: "from-blue-600 to-cyan-600",
      hoverColor: "hover:shadow-blue-500/25"
    },
    {
      title: "Manage Juries",
      description: "Create and manage jury accounts",
      href: "/admin/juries",
      icon: User,
      color: "from-green-600 to-teal-600",
      hoverColor: "hover:shadow-green-500/25"
    },
    {
      title: "View Reports",
      description: "Analytics and competition reports",
      href: "#",
      icon: BarChart3,
      color: "from-purple-600 to-pink-600",
      hoverColor: "hover:shadow-purple-500/25"
    }
  ];

  const recentActivity = [
    {
      action: "New competition created",
      item: "Classical Dance - Senior Category",
      time: "2 hours ago",
      type: "competition"
    },
    {
      action: "Contestant registered",
      item: "John Doe (#123)",
      time: "4 hours ago",
      type: "contestant"
    },
    {
      action: "Jury assigned",
      item: "Folk Dance Competition",
      time: "6 hours ago",
      type: "jury"
    },
    {
      action: "Competition completed",
      item: "Storytelling - Junior Category",
      time: "1 day ago",
      type: "completed"
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "competition":
        return <Award className="w-4 h-4" />;
      case "contestant":
        return <Users className="w-4 h-4" />;
      case "jury":
        return <Shield className="w-4 h-4" />;
      case "completed":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "competition":
        return "bg-purple-100 text-purple-600";
      case "contestant":
        return "bg-blue-100 text-blue-600";
      case "jury":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      <main className='flex-1'>
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Welcome back, {session.user.name}! Manage your fest competitions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last login</p>
                  <p className="text-sm font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {session.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 ${stat.bgColor} ${stat.textColor} rounded-full text-xs font-semibold`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className={`group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 block`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} shadow-lg mb-4 group-hover:shadow-lg ${action.hoverColor} transition-all duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
                  <Link
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-gray-100 hover:bg-white/60 transition-all duration-200"
                    >
                      <div className={`p-2 rounded-xl ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-gray-600 text-sm">{activity.item}</p>
                      </div>
                      <span className="text-gray-500 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="space-y-6">
              {/* Categories Overview */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Competition Categories</h3>
                <div className="space-y-3">
                  {[
                    { name: "Senior", count: 8, color: "bg-purple-500" },
                    { name: "Junior", count: 10, color: "bg-blue-500" },
                    { name: "Sub Junior", count: 6, color: "bg-green-500" }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="text-gray-700 font-medium">{category.name}</span>
                      </div>
                      <span className="text-gray-600 font-semibold">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Server Status</span>
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Database</span>
                    <span className="flex items-center gap-2 text-green-600 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Backup</span>
                    <span className="text-gray-600 text-sm">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}