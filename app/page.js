// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth.js";
// import { redirect } from "next";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Award, 
  Calendar,
  BookOpen,
  Star,
  ChevronRight,
  GraduationCap,
  Target
} from "lucide-react";

// Sample team data (replace with MongoDB query if needed)
const teams = [
  { name: "QUDWATHULULAMA", score: 450 },
  { name: "SUHBATHUSSADATH", score: 380 },
  { name: "NUSRATHULUMARA", score: 320 },
];

const achievements = [
  { count: "23", label: "Ranks from Jamia Nooriyya", highlight: true },
  { count: "12", label: "First Ranks", highlight: false },
  { count: "200+", label: "Current Students", highlight: false },
  { count: "100+", label: "Years of Excellence", highlight: true },
];

const features = [
  {
    icon: BookOpen,
    title: "Traditional Values",
    description: "Preserving Islamic educational traditions while embracing modern advancements",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description: "Seven-year comprehensive program combining religious and secular education",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Star,
    title: "Proven Success",
    description: "Consistently producing rank holders and distinguished scholars since 2001",
    color: "from-purple-500 to-indigo-600"
  },
  {
    icon: Target,
    title: "Modern Integration",
    description: "Government certified Arabic and Urdu courses with contemporary curriculum",
    color: "from-orange-500 to-red-600"
  }
];

export default async function HomePage() {
  // Check session
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     redirect("/team-login");
//   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200/50 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Est. 1924 • 100+ Years of Excellence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Alathurpadi Dars
              </span>
              <br />
              <span className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-normal">
                Fest 2025
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Celebrating a century of Islamic educational excellence in Kerala, India
              <br />
              <span className="text-lg text-gray-500">Where tradition meets innovation</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-14">
              <Link
                href="/team-panel"
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-6 h-6" />
                Team Panel
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <Link
                href="/team-panel"
                className="group flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-6 h-6" />
                Team Panel
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Legacy of Excellence</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Under the leadership of Dr. C.K. Muhammad Abdurahman Faizy, our institution continues to produce distinguished scholars
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-3xl border transition-all duration-300 hover:scale-105 ${
                  achievement.highlight
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl"
                    : "bg-white/60 backdrop-blur-sm border-gray-200 hover:shadow-xl"
                }`}
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  achievement.highlight ? "text-white" : "text-indigo-600"
                }`}>
                  {achievement.count}
                </div>
                <div className={`text-sm font-medium ${
                  achievement.highlight ? "text-indigo-100" : "text-gray-600"
                }`}>
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Scoreboard Preview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Live Competition Results</h2>
            <p className="text-gray-600 text-lg">Current standings in the fest competitions</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="grid grid-cols-1 gap-4">
                {teams.map((team, index) => (
                  <div
                    key={team.name}
                    className={`flex justify-between items-center p-6 rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                        : index === 2
                        ? "bg-gradient-to-r from-amber-600 to-yellow-700 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                        index === 0 ? "bg-white/20" : index === 1 ? "bg-white/20" : index === 2 ? "bg-white/20" : "bg-indigo-100 text-indigo-600"
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-xl font-semibold">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{team.score}</span>
                      <span className="text-sm opacity-80">pts</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/scoreboard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Trophy className="w-5 h-5" />
                  View Full Scoreboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Makes Us Distinguished</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the pillars of excellence that have shaped our institution for over a century
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Celebration
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Be part of our vibrant fest celebrating knowledge, tradition, and academic excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/team-panel"
                className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Award className="w-5 h-5" />
                Access Team Panel
              </Link>
              <Link
                href="/admin-login"
                className="flex items-center justify-center gap-2 bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}