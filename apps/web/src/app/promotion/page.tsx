"use client";

import Link from "next/link";

// Mock data - Canto style dashboard
const profileData = {
  name: "Elite Fight League",
  role: "Pro Promotion",
  department: "Las Vegas, NV",
};

const upcomingEvents = [
  { id: "1", name: "EFL Fight Night 47", date: "Feb 15", time: "7:00 PM", venue: "MGM Grand", bouts: 12, status: "approved" },
  { id: "2", name: "EFL Championship", date: "Mar 22", time: "8:00 PM", venue: "T-Mobile Arena", bouts: 14, status: "submitted" },
  { id: "3", name: "Contender Series 8", date: "Apr 05", time: "6:00 PM", venue: "UFC Apex", bouts: 6, status: "draft" },
];

const rosterFighters = [
  { id: "f1", name: "Marcus Rivera", record: "15-2", weightClass: "Lightweight", status: "eligible", nextFight: "Feb 15" },
  { id: "f2", name: "Sarah Chen", record: "8-1", weightClass: "Strawweight", status: "eligible", nextFight: "Feb 15" },
  { id: "f3", name: "Jake Thompson", record: "12-3", weightClass: "Welterweight", status: "pending", nextFight: "Mar 22" },
  { id: "f4", name: "Ana Rodriguez", record: "10-2", weightClass: "Flyweight", status: "eligible", nextFight: null },
];

const projectProgress = [
  { name: "Fight Night 47", progress: 85, color: "#c5f82a" },
  { name: "Championship", progress: 45, color: "#a855f7" },
  { name: "Contender Series", progress: 20, color: "#3b82f6" },
];

const meetings = [
  { time: "09:30", title: "Fighter Contract Review", team: "Legal team" },
  { time: "10:30", title: "Event Planning", team: "Production" },
  { time: "11:30", title: "Commission Call", team: "Nevada AC" },
  { time: "13:45", title: "Media Day Prep", team: "Marketing" },
];

export default function PromotionDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard overview</h1>
      </div>

      {/* Main Grid - Canto Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="col-span-4 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#c5f82a] rounded-md flex items-center justify-center">
                <span className="text-[#0f0f0f] text-xs font-bold">E</span>
              </div>
              <span className="text-gray-400 text-sm">CombatID™</span>
            </div>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              EFL
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
            </div>
          </div>

          <div className="bg-[#252525] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#c5f82a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{profileData.role}</p>
              <p className="text-gray-500 text-sm">{profileData.department}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Roster size</span>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[#c5f82a] text-sm">|</span>
            <span className="text-4xl font-bold text-white">24</span>
          </div>
        </div>

        <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pending contracts</span>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-amber-500 text-sm">|</span>
            <span className="text-4xl font-bold text-white">5</span>
          </div>
        </div>

        {/* Event Progress Grid */}
        <div className="col-span-4 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">My events</h3>
            <select className="bg-[#252525] text-gray-400 text-xs rounded-lg px-3 py-1.5 border border-[#2a2a2a]">
              <option>Next 30 days</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {projectProgress.map((project, i) => (
              <div key={i} className="bg-[#252525] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white mb-1">{project.progress}%</div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-2">
                  <div className="h-1.5 rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                </div>
                <p className="text-xs text-gray-500 truncate">{project.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity / Charts placeholder */}
        <div className="col-span-4 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#252525] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#c5f82a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Event success rate</p>
              <p className="text-gray-500 text-sm">Up 15% from last quarter</p>
            </div>
          </div>
          <div className="h-24 flex items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-[#c5f82a]/20 rounded-t" style={{ height: `${h}%` }}>
                <div className="w-full bg-[#c5f82a] rounded-t" style={{ height: '30%' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Meetings / Schedule */}
        <div className="col-span-3 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Today&apos;s Schedule</h3>
            <button className="text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {meetings.map((meeting, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-gray-500 text-sm w-12">{meeting.time}</span>
                <div className="flex-1 bg-[#252525] rounded-xl p-3">
                  <p className="text-white text-sm font-medium">{meeting.title}</p>
                  <p className="text-gray-500 text-xs">{meeting.team}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI / Stats Chart */}
        <div className="col-span-5 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="mb-4">
            <h3 className="text-white font-semibold">Fighter Performance</h3>
            <p className="text-gray-500 text-sm">Win rates across your roster</p>
          </div>
          <div className="h-32 flex items-end justify-between gap-4">
            {rosterFighters.map((fighter, i) => {
              const winRate = parseInt(fighter.record.split('-')[0]) / (parseInt(fighter.record.split('-')[0]) + parseInt(fighter.record.split('-')[1])) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-purple-600 to-[#c5f82a] rounded-t-lg" style={{ height: `${winRate}%` }}></div>
                  <p className="text-xs text-gray-500 mt-2 truncate w-full text-center">{fighter.name.split(' ')[0]}</p>
                  <p className="text-xs text-white">{Math.round(winRate)}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Card */}
        <div className="col-span-4 bg-gradient-to-br from-[#c5f82a] to-[#a3d925] rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#0f0f0f] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#c5f82a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[#0f0f0f] text-sm font-medium">Next event ready!</span>
            </div>
            <h3 className="text-[#0f0f0f] text-xl font-bold mb-2">FIGHT NIGHT 47</h3>
            <p className="text-[#0f0f0f]/70 text-sm mb-4">Feb 15, 2026 • MGM Grand</p>
            <Link href="/promotion/events/1" className="inline-flex items-center gap-2 bg-[#0f0f0f] text-[#c5f82a] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1a1a1a] transition-colors">
              View Event
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#0f0f0f]/10 rounded-full"></div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#0f0f0f]/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
