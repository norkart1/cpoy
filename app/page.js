// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth.js";
// // import { redirect } from "next";
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
//     color: "from-green-500 to-emerald-600"
//   },
//   {
//     icon: GraduationCap,
//     title: "Academic Excellence",
//     description: "Seven-year comprehensive program combining religious and secular education",
//     color: "from-blue-500 to-cyan-600"
//   },
//   {
//     icon: Star,
//     title: "Proven Success",
//     description: "Consistently producing rank holders and distinguished scholars since 2001",
//     color: "from-purple-500 to-indigo-600"
//   },
//   {
//     icon: Target,
//     title: "Modern Integration",
//     description: "Government certified Arabic and Urdu courses with contemporary curriculum",
//     color: "from-orange-500 to-red-600"
//   }
// ];

// export default function HomePage() {

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Check session
//   //   const session = await getServerSession(authOptions);
//   //   if (!session) {
//   //     redirect("/team-login");
//   //   }

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
        
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
        
//         .animate-fade-in {
//           animation: fadeIn 1s ease-out forwards;
//         }
        
//         .animate-fade-in-up {
//           animation: fadeInUp 1s ease-out forwards;
//         }
        
//         .animate-pulse-dot {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         {/* Hero Section */}
//         <div className="min-h-screen bg-white text-black relative overflow-hidden">
//           {/* Background Image */}
//           <div
//             className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
//             style={{
//               backgroundImage: "url('/your-bw-image.png')", // Replace with your uploaded image path
//             }}
//           />

//           {/* Subtle pattern overlay */}
//           <div
//             className="absolute inset-0 opacity-[0.02]"
//             style={{
//               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
//               backgroundSize: '20px 20px'
//             }}
//           />

//           <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center min-h-screen justify-center">
//             {/* Badge */}
//             <div
//               className={`inline-flex items-center gap-2 border border-gray-400 bg-white px-4 py-2 rounded-full text-xs uppercase tracking-wide font-medium mb-8 font-geist-mono ${mounted ? 'animate-fade-in' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: '0.1s' }}
//             >
//               <div className="w-2 h-2 bg-black rounded-full animate-pulse-dot" />
//               Est. 1924 • 100 Years of Knowledge
//             </div>

//             {/* Main Heading */}
//             <h1
//               className={`text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight mb-6 font-geist-sans ${mounted ? 'animate-fade-in-up' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: '0.2s' }}
//             >
//               Alathurpadi Dars
//               <br />
//               <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal font-geist-mono tracking-wider text-gray-700 mt-6">
//                 Fest 2025
//               </span>
//             </h1>

//             {/* Subtitle */}
//             <div
//               className={`max-w-3xl mb-12 font-geist-mono ${mounted ? 'animate-fade-in-up' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: '0.3s' }}
//             >
//               <p className="text-lg sm:text-xl text-gray-700 mb-3 leading-relaxed">
//                 Celebrating a century of Islamic educational excellence in Kerala
//               </p>
//               <p className="text-sm sm:text-base text-gray-500 italic">
//                 Where tradition meets innovation
//               </p>
//             </div>

//             {/* CTA Buttons */}
//             <div
//               className={`flex flex-col sm:flex-row gap-4 justify-center ${mounted ? 'animate-fade-in-up' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: '0.4s' }}
//             >
//               <button className="group inline-flex items-center gap-3 border-2 border-black text-black px-8 py-3 rounded-full font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 Team Panel
//               </button>

//               <button className="group inline-flex items-center gap-3 border-2 border-gray-600 text-gray-800 px-8 py-3 rounded-full font-semibold font-geist-sans hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 View Results
//               </button>
//             </div>

//             {/* Scroll indicator */}
//             <div
//               className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${mounted ? 'animate-fade-in' : 'opacity-0'
//                 }`}
//               style={{ animationDelay: '0.6s' }}
//             >
//               <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
//                 <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-bounce" />
//               </div>
//             </div>
//           </div>
//         </div>


//         {/* Achievements Section */}
//         <div className="py-16 bg-white/50 backdrop-blur-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Legacy of Excellence</h2>
//               <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                 Under the leadership of Dr. C.K. Muhammad Abdurahman Faizy, our institution continues to produce distinguished scholars
//               </p>
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//               {achievements.map((achievement, index) => (
//                 <div
//                   key={index}
//                   className={`text-center p-6 rounded-3xl border transition-all duration-300 hover:scale-105 ${achievement.highlight
//                     ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl"
//                     : "bg-white/60 backdrop-blur-sm border-gray-200 hover:shadow-xl"
//                     }`}
//                 >
//                   <div className={`text-3xl md:text-4xl font-bold mb-2 ${achievement.highlight ? "text-white" : "text-indigo-600"
//                     }`}>
//                     {achievement.count}
//                   </div>
//                   <div className={`text-sm font-medium ${achievement.highlight ? "text-indigo-100" : "text-gray-600"
//                     }`}>
//                     {achievement.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Current Scoreboard Preview */}
//         <div className="py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Live Competition Results</h2>
//               <p className="text-gray-600 text-lg">Current standings in the fest competitions</p>
//             </div>

//             <div className="max-w-3xl mx-auto">
//               <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
//                 <div className="grid grid-cols-1 gap-4">
//                   {teams.map((team, index) => (
//                     <div
//                       key={team.name}
//                       className={`flex justify-between items-center p-6 rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 ${index === 0
//                         ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
//                         : index === 1
//                           ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
//                           : index === 2
//                             ? "bg-gradient-to-r from-amber-600 to-yellow-700 text-white"
//                             : "bg-gray-50 hover:bg-gray-100"
//                         }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${index === 0 ? "bg-white/20" : index === 1 ? "bg-white/20" : index === 2 ? "bg-white/20" : "bg-indigo-100 text-indigo-600"
//                           }`}>
//                           {index + 1}
//                         </div>
//                         <span className="text-xl font-semibold">{team.name}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold">{team.score}</span>
//                         <span className="text-sm opacity-80">pts</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-8 text-center">
//                   <Link
//                     href="/scoreboard"
//                     className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105"
//                   >
//                     <Trophy className="w-5 h-5" />
//                     View Full Scoreboard
//                     <ChevronRight className="w-4 h-4" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="py-16 bg-white/30 backdrop-blur-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Makes Us Distinguished</h2>
//               <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//                 Discover the pillars of excellence that have shaped our institution for over a century
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="group bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
//                 >
//                   <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300`}>
//                     <feature.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     {feature.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer CTA */}
//         <div className="py-16">
//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl">
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                 Join the Celebration
//               </h2>
//               <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
//                 Be part of our vibrant fest celebrating knowledge, tradition, and academic excellence
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link
//                   href="/team-panel"
//                   className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   <Award className="w-5 h-5" />
//                   Access Team Panel
//                 </Link>
//                 <Link
//                   href="/admin-login"
//                   className="flex items-center justify-center gap-2 bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
//                 >
//                   <Users className="w-5 h-5" />
//                   Admin Access
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

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

// Sample team data (replace with MongoDB query if needed)
// const teams = [
//   { name: "QUDWATHULULAMA", score: 450 },
//   { name: "SUHBATHUSSADATH", score: 380 },
//   { name: "NUSRATHULUMARA", score: 320 },
// ];

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

      <div className="min-h-screen bg-white">
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
             </Link>
              <button className="group relative inline-flex items-center gap-2 border-2 border-gray-600 text-gray-800 px-8 py-3 rounded-lg font-semibold font-geist-sans hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
                <Trophy className="w-5 h-5" />
                View Results
              </button>
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
        <div className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="w-16 h-1 bg-black mx-auto mb-6" />
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 font-geist-sans text-shadow">
                  Live Competition Results
                </h2>
                <div className="w-16 h-1 bg-black mx-auto" />
              </div>
              <p className="text-gray-600 text-xl font-geist-mono">Current standings in the fest competitions</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white glass-effect rounded-3xl p-10 shadow-2xl border-2 border-gray-200 animate-glow">
        <div className="grid grid-cols-1 gap-6">
          {teams.map((team, index) => (
            <div
              key={team.teamName}
              className={`group flex justify-between items-center p-8 rounded-2xl transition-all duration-500 hover:scale-105 border-2 ${
                index === 0
                  ? "bg-black text-white border-black shadow-2xl animate-glow"
                  : index === 1
                  ? "bg-gray-800 text-white border-gray-800 shadow-xl"
                  : index === 2
                  ? "bg-gray-600 text-white border-gray-600 shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`flex items-center justify-center w-14 h-14 rounded-full font-black text-2xl border-2 ${
                  index < 3 ? "bg-white/20 border-white/30 text-white" : "bg-black text-white border-black"
                }`}>
                  {index + 1}
                </div>
                <span className="text-2xl font-bold font-geist-sans tracking-wide">{team.teamName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-geist-mono">{team.totalPoints}</span>
                <span className="text-lg opacity-70 font-geist-mono">pts</span>
              </div>
            </div>
          ))}
        </div>

                <div className="mt-12 text-center">
                  <Link
                    href="/scoreboard"
                    className="group inline-flex items-center gap-4 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-black/25 transition-all duration-500 transform hover:scale-110 font-geist-sans tracking-wide relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <Trophy className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">View Full Scoreboard</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
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