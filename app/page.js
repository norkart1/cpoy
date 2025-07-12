'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import Sidebar from "@/components/sidebar";

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
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description: "Seven-year comprehensive program combining religious and secular education",
  },
  {
    icon: Star,
    title: "Proven Success",
    description: "Consistently producing rank holders and distinguished scholars since 2001",
  },
  {
    icon: Target,
    title: "Modern Integration",
    description: "Government certified Arabic and Urdu courses with contemporary curriculum",
  }
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [teams,setTeams]=useState([])

  useEffect(() => {
    const fetchTeamScores = async () => {
      try {
        const res = await fetch('/api/team/total-scores');
        const data = await res.json();
        if (data.success) {
          setTeams(data.scores);
        } else {
          console.error("Failed to fetch team scores:", data.message);
        }
      } catch (err) {
        console.error("Error fetching team scores:", err.message);
      }
    };

    fetchTeamScores();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
        .font-geist-sans {
          font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
        }
        .font-geist-mono {
          font-family: 'JetBrains Mono', 'Geist Mono', monospace;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 40px rgba(0, 0, 0, 0.2); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        
        .animate-pulse-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .geometric-bg {
          background-image: 
            linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.02) 60%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.02) 60%, transparent 60%);
          background-size: 30px 30px;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.1);
        }
        
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .sticky-bg {
          background-attachment: fixed;
        }
      `}</style>

      <div className="flex min-h-screen bg-white">
        <Sidebar />
              <main className="flex-1 md:p-10 pb-36">
        {/* Hero Section */}
        <div className="min-h-screen bg-white text-black relative overflow-hidden" role="banner" aria-label="Hero Section">
          {/* Background Image */}
          <div
            className="absolute inset-0 opacity-50 bg-cover bg-center bg-no-repeat sticky-bg"
            style={{
              backgroundImage: "url('/header-01.png')",
            }}
          />

          {/* White Overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-[5]" />

          {/* Geometric Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-20 z-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)`,
              backgroundSize: '15px 15px'
            }}
          />

          {/* Floating Elements */}
          <div className="absolute top-16 left-8 w-16 h-16 border-2 border-gray-500 rounded-full animate-float opacity-20 z-0" />
          <div className="absolute top-32 right-16 w-12 h-12 bg-gray-200 opacity-10 transform rotate-45 animate-float z-0" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-16 w-8 h-8 border border-gray-500 transform rotate-12 animate-float z-0" style={{ animationDelay: '2s' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-center min-h-screen justify-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs uppercase tracking-wide font-medium font-geist-mono ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-2 h-2 bg-black rounded-full animate-pulse-dot" />
              Est. 1924 • 100 Years of Knowledge
            </div>

            {/* Main Heading */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-8xl font-bold mb-4 font-geist-sans text-black text-shadow-sm ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              Alathurpadi Dars
              <span className="block text-2xl sm:text-3xl font-normal font-geist-mono text-gray-600 mt-3">
                Fest 2025
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 opacity-50" />
              </span>
            </h1>

            {/* Subtitle */}
            <div
              className={`max-w-3xl mb-8 font-geist-mono ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <p className="text-lg sm:text-xl text-gray-800 font-medium">
                Celebrating a century of Islamic educational excellence
              </p>
              <p className="text-sm sm:text-base text-gray-600 italic tracking-wide mt-2">
                Tradition meets innovation
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <Link href="/team-panel">
              <button className="group relative inline-flex items-center gap-2 border-2 border-black text-black px-8 py-3 rounded-lg font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
                 <Users className="w-5 h-5" />
                 Team Panel
              </button>
             </Link >
             <Link href="/results">
              <button className="group relative inline-flex items-center gap-2 border-2 border-gray-600 text-gray-800 px-8 py-3 rounded-lg font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
                <Trophy className="w-5 h-5" />
                View Results
              </button>
             </Link>
            </div>

            {/* Scroll indicator */}
            <div
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-700 rounded-full mt-2 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
          <div className="absolute inset-0 geometric-bg opacity-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="w-16 h-1 bg-black mx-auto mb-6" />
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
                  Our Legacy of Excellence
                </h2>
                <div className="w-16 h-1 bg-black mx-auto" />
              </div>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto font-geist-mono leading-relaxed">
                Under the leadership of Dr. C.K. Muhammad Abdurahman Faizy, our institution continues to produce distinguished scholars
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`group text-center p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-110 animate-float glass-effect ${
                    achievement.highlight
                      ? "bg-black text-white shadow-2xl hover:shadow-3xl border-black animate-glow"
                      : "bg-white text-black hover:shadow-2xl border-gray-300 hover:border-gray-600"
                  }`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className={`text-4xl md:text-6xl font-black mb-4 font-geist-sans ${
                    achievement.highlight ? "text-white" : "text-black"
                  }`}>
                    {achievement.count}
                  </div>
                  <div className="w-12 h-0.5 bg-current mx-auto mb-4 opacity-50" />
                  <div className={`text-sm font-bold font-geist-mono tracking-wide ${
                    achievement.highlight ? "text-gray-200" : "text-gray-600"
                  }`}>
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Scoreboard Preview */}
<div className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50 relative">
  <div
    className="absolute inset-0 opacity-5"
    style={{
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
      backgroundSize: '30px 30px',
    }}
  />
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-block mb-4">
        <div className="w-12 h-1 bg-black mx-auto mb-4" />
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 font-geist-sans text-shadow">
          Live Competition Results
        </h2>
        <div className="w-12 h-1 bg-black mx-auto" />
      </div>
      <p className="text-gray-600 text-base sm:text-lg font-geist-mono">Current standings in the fest competitions</p>
    </div>

    <div className="max-w-3xl mx-auto">
      <div className="bg-white glass-effect rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col gap-3 sm:gap-4">
          {teams.map((team, index) => (
            <div
              key={team.teamName}
              className={`group relative flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 rounded-lg transition-all duration-300 hover:scale-102 border ${
                index === 0
                  ? "bg-black text-white border-black shadow-md animate-glow"
                  : index === 1
                  ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                  : index === 2
                  ? "bg-gray-600 text-white border-gray-600 shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-black"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-lg sm:text-xl border-2 ${
                    index < 3 ? "bg-white/10 border-white/20 text-white" : "bg-black text-white border-black"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-base sm:text-xl font-semibold font-geist-sans tracking-wide text-left truncate">{team.teamName}</span>
              </div>
              <div className="absolute top-2 right-2 sm:static sm:ml-auto flex items-center gap-2 bg-white/10 sm:bg-transparent rounded-full px-3 py-1 border border-white/30 sm:border-none">
                <span className="text-base sm:text-2xl font-bold font-geist-mono">{team.totalPoints}</span>
                <span className="text-xs sm:text-base opacity-70 font-geist-mono">pts</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105 font-geist-sans tracking-wide relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
            <span className="relative z-10 text-sm sm:text-base">View Full Scoreboard</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Features Section */}
        <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 geometric-bg opacity-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="w-16 h-1 bg-black mx-auto mb-6" />
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
                  What Makes Us Distinguished
                </h2>
                <div className="w-16 h-1 bg-black mx-auto" />
              </div>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto font-geist-mono leading-relaxed">
                Discover the pillars of excellence that have shaped our institution for over a century
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white glass-effect rounded-3xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float ${
                    mounted ? 'animate-slide-in-left' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="p-6 rounded-2xl bg-black shadow-lg mb-6 group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-black transition-colors font-geist-sans">
                    {feature.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-black mb-4 opacity-30" />
                  <p className="text-gray-600 text-sm leading-relaxed font-geist-mono">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="py-20 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.1) 51%, transparent 52%)`,
            backgroundSize: '20px 20px'
          }} />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="bg-black rounded-3xl p-12 md:p-16 shadow-2xl border-4 border-gray-800 animate-glow relative overflow-hidden">
              <div className="absolute inset-0 geometric-bg opacity-10" />
              
              <div className="relative z-10">
                <div className="w-20 h-1 bg-white mx-auto mb-8" />
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-geist-sans text-shadow">
                  Join the Celebration
                </h2>
                <div className="w-20 h-1 bg-white mx-auto mb-8" />
                <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto font-geist-mono leading-relaxed">
                  Be part of our vibrant fest celebrating knowledge, tradition, and academic excellence
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/team-panel"
                    className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <Award className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Access Team Panel</span>
                  </Link>
                  
                  <Link
                    href="/admin-login"
                    className="group relative flex items-center justify-center gap-3 bg-transparent text-white border-3 border-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <Users className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Admin Access</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </>
  );
}

// "use client";

// import Link from "next/link";
// import { useState, useEffect } from 'react';
// import {
//   Trophy,
//   Users,
//   Award,
//   Calendar,
//   BookOpen,
//   Star,
//   ChevronRight,
//   GraduationCap,
//   Target
// } from "lucide-react";

// // Sample team data (replace with MongoDB query if needed)
// const teams = [
//   { name: "QUDWATHULULAMA", score: 450 },
//   { name: "SUHBATHUSSADATH", score: 380 },
//   { name: "NUSRATHULUMARA", score: 320 },
// ];

// const achievements = [
//   { count: "23", label: "Ranks from Jamia Nooriyya", highlight: true },
//   { count: "12", label: "First Ranks", highlight: false },
//   { count: "200+", label: "Current Students", highlight: false },
//   { count: "100+", label: "Years of Excellence", highlight: true },
// ];

// const features = [
//   {
//     icon: BookOpen,
//     title: "Traditional Values",
//     description: "Preserving Islamic educational traditions while embracing modern advancements",
//   },
//   {
//     icon: GraduationCap,
//     title: "Academic Excellence",
//     description: "Seven-year comprehensive program combining religious and secular education",
//   },
//   {
//     icon: Star,
//     title: "Proven Success",
//     description: "Consistently producing rank holders and distinguished scholars since 2001",
//   },
//   {
//     icon: Target,
//     title: "Modern Integration",
//     description: "Government certified Arabic and Urdu courses with contemporary curriculum",
//   }
// ];

// export default function HomePage() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800;900&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        
//         .font-geist-sans {
//           font-family: 'Geist Sans', system-ui, -apple-system, sans-serif;
//         }
//         .font-geist-mono {
//           font-family: 'JetBrains Mono', 'Geist Mono', monospace;
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes fadeInUp {
//           from { 
//             opacity: 0; 
//             transform: translateY(30px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateY(0); 
//           }
//         }
        
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes slideInRight {
//           from {
//             opacity: 0;
//             transform: translateX(50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); }
//           50% { box-shadow: 0 0 40px rgba(0, 0, 0, 0.2); }
//         }
        
//         .animate-fade-in {
//           animation: fadeIn 1s ease-out forwards;
//         }
        
//         .animate-fade-in-up {
//           animation: fadeInUp 1s ease-out forwards;
//         }
        
//         .animate-slide-in-left {
//           animation: slideInLeft 1s ease-out forwards;
//         }
        
//         .animate-slide-in-right {
//           animation: slideInRight 1s ease-out forwards;
//         }
        
//         .animate-pulse-dot {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
        
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
        
//         .animate-glow {
//           animation: glow 2s ease-in-out infinite;
//         }
        
//         .geometric-bg {
//           background-image: 
//             linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.02) 60%, transparent 60%),
//             linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.02) 60%, transparent 60%);
//           background-size: 30px 30px;
//         }
        
//         .glass-effect {
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(0,0,0,0.1);
//         }
        
//         .text-shadow {
//           text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
//         }
//       `}</style>

//       <div className="min-h-screen bg-white">
//         {/* Hero Section */}
//         <div className="min-h-screen bg-white text-black relative overflow-hidden" role="banner" aria-label="Hero Section">
//           {/* Background Image */}
//           <div
//             className="absolute inset-0 opacity-50 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: "url('/header-01.png')",
//             }}
//           />

//           {/* White Overlay */}
//           <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

//           {/* Geometric Pattern Overlay */}
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)`,
//               backgroundSize: '15px 15px'
//             }}
//           />

//           {/* Floating Elements */}
//           <div className="absolute top-16 left-8 w-16 h-16 border-2 border-gray-500 rounded-full animate-float opacity-20" />
//           <div className="absolute top-32 right-16 w-12 h-12 bg-gray-200 opacity-10 transform rotate-45 animate-float" style={{ animationDelay: '1s' }} />
//           <div className="absolute bottom-32 left-16 w-8 h-8 border border-gray-500 transform rotate-12 animate-float" style={{ animationDelay: '2s' }} />

//           <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-center min-h-screen justify-center">
//             {/* Badge */}
//             <div
//               className={`inline-flex items-center gap-2 border border-gray-300 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs uppercase tracking-wide font-medium font-geist-mono ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
//               style={{ animationDelay: '0.1s' }}
//             >
//               <div className="w-2 h-2 bg-black rounded-full animate-pulse-dot" />
//               Est. 1924 • 100 Years of Knowledge
//             </div>

//             {/* Main Heading */}
//             <h1
//               className={`text-5xl sm:text-6xl lg:text-8xl font-bold mb-4 font-geist-sans text-black text-shadow-sm ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
//               style={{ animationDelay: '0.2s' }}
//             >
//               Alathurpadi Dars
//               <span className="block text-2xl sm:text-3xl font-normal font-geist-mono text-gray-600 mt-3">
//                 Fest 2025
//                 <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 opacity-50" />
//               </span>
//             </h1>

//             {/* Subtitle */}
//             <div
//               className={`max-w-3xl mb-8 font-geist-mono ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
//               style={{ animationDelay: '0.3s' }}
//             >
//               <p className="text-lg sm:text-xl text-gray-800 font-medium">
//                 Celebrating a century of Islamic educational excellence
//               </p>
//               <p className="text-sm sm:text-base text-gray-600 italic tracking-wide mt-2">
//                 Tradition meets innovation
//               </p>
//             </div>

//             {/* CTA Buttons */}
//             <div
//               className={`flex flex-col sm:flex-row gap-4 justify-center ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
//               style={{ animationDelay: '0.4s' }}
//             >
//               <button className="group relative inline-flex items-center gap-2 border-2 border-black text-black px-8 py-3 rounded-lg font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
//                 <Users className="w-5 h-5" />
//                 Team Panel
//               </button>
//               <button className="group relative inline-flex items-center gap-2 border-2 border-gray-600 text-gray-800 px-8 py-3 rounded-lg font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
//                 <Trophy className="w-5 h-5" />
//                 View Results
//               </button>
//             </div>

//             {/* Scroll indicator */}
//             <div
//               className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
//               style={{ animationDelay: '0.5s' }}
//             >
//               <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
//                 <div className="w-1 h-3 bg-gray-700 rounded-full mt-2 animate-bounce" />
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Achievements Section */}
//         <div className="py-20 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
//           <div className="absolute inset-0 geometric-bg opacity-10" />
          
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//             <div className="text-center mb-16">
//               <div className="inline-block mb-4">
//                 <div className="w-16 h-1 bg-black mx-auto mb-6" />
//                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
//                   Our Legacy of Excellence
//                 </h2>
//                 <div className="w-16 h-1 bg-black mx-auto" />
//               </div>
//               <p className="text-gray-600 text-xl max-w-3xl mx-auto font-geist-mono leading-relaxed">
//                 Under the leadership of Dr. C.K. Muhammad Abdurahman Faizy, our institution continues to produce distinguished scholars
//               </p>
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//               {achievements.map((achievement, index) => (
//                 <div
//                   key={index}
//                   className={`group text-center p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-110 animate-float glass-effect ${
//                     achievement.highlight
//                       ? "bg-black text-white shadow-2xl hover:shadow-3xl border-black animate-glow"
//                       : "bg-white text-black hover:shadow-2xl border-gray-300 hover:border-gray-600"
//                   }`}
//                   style={{ animationDelay: `${index * 0.5}s` }}
//                 >
//                   <div className={`text-4xl md:text-6xl font-black mb-4 font-geist-sans ${
//                     achievement.highlight ? "text-white" : "text-black"
//                   }`}>
//                     {achievement.count}
//                   </div>
//                   <div className="w-12 h-0.5 bg-current mx-auto mb-4 opacity-50" />
//                   <div className={`text-sm font-bold font-geist-mono tracking-wide ${
//                     achievement.highlight ? "text-gray-200" : "text-gray-600"
//                   }`}>
//                     {achievement.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Current Scoreboard Preview */}
//         <div className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
//           <div className="absolute inset-0 opacity-5" style={{
//             backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
//             backgroundSize: '50px 50px'
//           }} />
          
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//             <div className="text-center mb-16">
//               <div className="inline-block mb-4">
//                 <div className="w-16 h-1 bg-black mx-auto mb-6" />
//                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
//                   Live Competition Results
//                 </h2>
//                 <div className="w-16 h-1 bg-black mx-auto" />
//               </div>
//               <p className="text-gray-600 text-xl font-geist-mono">Current standings in the fest competitions</p>
//             </div>

//             <div className="max-w-4xl mx-auto">
//               <div className="bg-white glass-effect rounded-3xl p-10 shadow-2xl border-2 border-gray-200 animate-glow">
//                 <div className="grid grid-cols-1 gap-6">
//                   {teams.map((team, index) => (
//                     <div
//                       key={team.name}
//                       className={`group flex justify-between items-center p-8 rounded-2xl transition-all duration-500 hover:scale-105 border-2 ${
//                         index === 0
//                           ? "bg-black text-white border-black shadow-2xl animate-glow"
//                           : index === 1
//                           ? "bg-gray-800 text-white border-gray-800 shadow-xl"
//                           : index === 2
//                           ? "bg-gray-600 text-white border-gray-600 shadow-lg"
//                           : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
//                       }`}
//                     >
//                       <div className="flex items-center gap-6">
//                         <div className={`flex items-center justify-center w-14 h-14 rounded-full font-black text-2xl border-2 ${
//                           index < 3 ? "bg-white/20 border-white/30 text-white" : "bg-black text-white border-black"
//                         }`}>
//                           {index + 1}
//                         </div>
//                         <span className="text-2xl font-bold font-geist-sans tracking-wide">{team.name}</span>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <span className="text-3xl font-black font-geist-mono">{team.score}</span>
//                         <span className="text-lg opacity-70 font-geist-mono">pts</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-12 text-center">
//                   <Link
//                     href="/scoreboard"
//                     className="group inline-flex items-center gap-4 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-black/25 transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide relative overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//                     <Trophy className="w-6 h-6 relative z-10" />
//                     <span className="relative z-10">View Full Scoreboard</span>
//                     <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
//           <div className="absolute inset-0 geometric-bg opacity-10" />
          
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//             <div className="text-center mb-16">
//               <div className="inline-block mb-4">
//                 <div className="w-16 h-1 bg-black mx-auto mb-6" />
//                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
//                   What Makes Us Distinguished
//                 </h2>
//                 <div className="w-16 h-1 bg-black mx-auto" />
//               </div>
//               <p className="text-gray-600 text-xl max-w-3xl mx-auto font-geist-mono leading-relaxed">
//                 Discover the pillars of excellence that have shaped our institution for over a century
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className={`group bg-white glass-effect rounded-3xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-float ${
//                     mounted ? 'animate-slide-in-left' : 'opacity-0'
//                   }`}
//                   style={{ animationDelay: `${index * 0.2}s` }}
//                 >
//                   <div className="p-6 rounded-2xl bg-black shadow-lg mb-6 group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110">
//                     <feature.icon className="w-10 h-10 text-white" />
//                   </div>
//                   <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-black transition-colors font-geist-sans">
//                     {feature.title}
//                   </h3>
//                   <div className="w-8 h-0.5 bg-black mb-4 opacity-30" />
//                   <p className="text-gray-600 text-sm leading-relaxed font-geist-mono">
//                     {feature.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer CTA */}
//         <div className="py-20 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">
//           <div className="absolute inset-0 opacity-5" style={{
//             backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.1) 51%, transparent 52%)`,
//             backgroundSize: '20px 20px'
//           }} />
          
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
//             <div className="bg-black rounded-3xl p-12 md:p-16 shadow-2xl border-4 border-gray-800 animate-glow relative overflow-hidden">
//               <div className="absolute inset-0 geometric-bg opacity-10" />
              
//               <div className="relative z-10">
//                 <div className="w-20 h-1 bg-white mx-auto mb-8" />
//                 <h2 className="text-4xl md:text-6xl font-black text-white mb-6 font-geist-sans text-shadow">
//                   Join the Celebration
//                 </h2>
//                 <div className="w-20 h-1 bg-white mx-auto mb-8" />
//                 <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto font-geist-mono leading-relaxed">
//                   Be part of our vibrant fest celebrating knowledge, tradition, and academic excellence
//                 </p>
                
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
//                   <Link
//                     href="/team-panel"
//                     className="group relative flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//                     <Award className="w-6 h-6 relative z-10" />
//                     <span className="relative z-10">Access Team Panel</span>
//                   </Link>
                  
//                   <Link
//                     href="/admin-login"
//                     className="group relative flex items-center justify-center gap-3 bg-transparent text-white border-3 border-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//                     <Users className="w-6 h-6 relative z-10" />
//                     <span className="relative z-10">Admin Access</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }