"use client";

import Link from "next/link";

const fighters = [
  { id: "f1", name: "Marcus Rivera", record: "15-2", weightClass: "Lightweight", status: "fight-ready", photo: "MR", nextFight: "Feb 15", winRate: 88 },
  { id: "f2", name: "Sarah Chen", record: "8-1", weightClass: "Strawweight", status: "fight-ready", photo: "SC", nextFight: "Feb 15", winRate: 89 },
  { id: "f3", name: "Mike Johnson", record: "7-4", weightClass: "Welterweight", status: "attention", photo: "MJ", nextFight: "Mar 22", winRate: 64 },
  { id: "f4", name: "David Lee", record: "5-1", weightClass: "Bantamweight", status: "fight-ready", photo: "DL", nextFight: null, winRate: 83 },
  { id: "f5", name: "Lisa Park", record: "3-0", weightClass: "Flyweight", status: "incomplete", photo: "LP", nextFight: null, winRate: 100 },
];

const upcomingFights = [
  { id: 1, fighter: "Marcus Rivera", opponent: "Jake Thompson", event: "EFL Fight Night 47", date: "Feb 15", time: "7:00 PM", venue: "MGM Grand" },
  { id: 2, fighter: "Sarah Chen", opponent: "Ana Rodriguez", event: "EFL Fight Night 47", date: "Feb 15", time: "7:00 PM", venue: "MGM Grand" },
  { id: 3, fighter: "Mike Johnson", opponent: "Carlos Santos", event: "EFL Championship", date: "Mar 22", time: "8:00 PM", venue: "T-Mobile Arena" },
];

const activityFeed = [
  { id: 1, type: "document", action: "Blood test uploaded", fighter: "Marcus Rivera", time: "2h ago", icon: "upload" },
  { id: 2, type: "contract", action: "Contract signed", fighter: "Sarah Chen", time: "5h ago", icon: "check" },
  { id: 3, type: "alert", action: "Eye exam expired", fighter: "Mike Johnson", time: "1d ago", icon: "alert" },
  { id: 4, type: "document", action: "Physical completed", fighter: "David Lee", time: "2d ago", icon: "check" },
  { id: 5, type: "fight", action: "Fight booked", fighter: "Sarah Chen", time: "3d ago", icon: "calendar" },
];

const alerts = [
  { id: 1, fighter: "Mike Johnson", issue: "Eye exam expired", severity: "high", daysAgo: 5 },
  { id: 2, fighter: "Lisa Park", issue: "Blood test missing", severity: "high", daysAgo: null },
  { id: 3, fighter: "Marcus Rivera", issue: "MRI expiring soon", severity: "medium", daysLeft: 30 },
];

const statusColors: Record<string, { gradient: string; text: string; label: string }> = {
  "fight-ready": { gradient: "from-[#22c55e] to-[#16a34a]", text: "text-[#22c55e]", label: "Fight Ready" },
  "attention": { gradient: "from-[#f59e0b] to-[#d97706]", text: "text-[#f59e0b]", label: "Attention Needed" },
  "incomplete": { gradient: "from-[#ef4444] to-[#dc2626]", text: "text-[#ef4444]", label: "Incomplete" },
};

function CircularProgress({ percentage, size = 80, strokeWidth = 6, color = "#ea580c" }: { percentage: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{percentage}%</span>
      </div>
    </div>
  );
}

function IconByType({ type }: { type: string }) {
  switch (type) {
    case "upload":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case "check":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "alert":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function GymDashboard() {
  const fightReady = fighters.filter(f => f.status === "fight-ready").length;
  const totalFighters = fighters.length;
  const complianceRate = Math.round((fightReady / totalFighters) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Hero Stats Section */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] rounded-3xl p-6 border border-[#2a2a2a]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Welcome */}
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Welcome back</p>
            <h1 className="text-3xl font-black text-white mt-1">American Top Team</h1>
            <p className="text-gray-400 mt-1">Your team is <span className="text-[#22c55e] font-semibold">{complianceRate}% fight ready</span></p>
          </div>

          {/* Circular Progress Stats */}
          <div className="flex items-center gap-6 lg:gap-10">
            <div className="text-center">
              <CircularProgress percentage={complianceRate} color="#22c55e" />
              <p className="text-xs text-gray-500 mt-2 font-medium">Compliance</p>
            </div>
            <div className="text-center">
              <CircularProgress percentage={83} color="#ea580c" />
              <p className="text-xs text-gray-500 mt-2 font-medium">Win Rate</p>
            </div>
            <div className="text-center">
              <CircularProgress percentage={60} color="#8b5cf6" />
              <p className="text-xs text-gray-500 mt-2 font-medium">Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ea580c] to-[#dc2626] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{totalFighters}</p>
              <p className="text-gray-500 text-sm">Fighters</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-[#22c55e]">{fightReady}</p>
              <p className="text-gray-500 text-sm">Fight Ready</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{upcomingFights.length}</p>
              <p className="text-gray-500 text-sm">Upcoming Fights</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-[#f59e0b]">{alerts.length}</p>
              <p className="text-gray-500 text-sm">Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fighter Cards - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Roster</h2>
            <Link href="/gym/fighters" className="text-[#ea580c] text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {fighters.slice(0, 4).map((fighter) => (
              <Link
                key={fighter.id}
                href={`/gym/fighters/${fighter.id}`}
                className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] hover:border-[#ea580c]/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${statusColors[fighter.status].gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                    {fighter.photo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate group-hover:text-[#ea580c] transition-colors">{fighter.name}</p>
                    <p className="text-gray-500 text-sm">{fighter.weightClass} • {fighter.record}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        fighter.status === "fight-ready" ? "bg-[#22c55e]/20 text-[#22c55e]" :
                        fighter.status === "attention" ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                        "bg-[#ef4444]/20 text-[#ef4444]"
                      }`}>
                        {statusColors[fighter.status].label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{fighter.winRate}%</p>
                    <p className="text-xs text-gray-500">Win Rate</p>
                  </div>
                </div>
                {fighter.nextFight && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Next Fight</span>
                    <span className="text-white text-sm font-semibold">{fighter.nextFight}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Alerts</h2>
            <span className="px-2.5 py-1 bg-[#f59e0b]/20 text-[#f59e0b] rounded-full text-xs font-bold">{alerts.length}</span>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                href={`/gym/fighters`}
                className="p-4 flex items-start gap-3 hover:bg-[#222222] transition-colors block"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  alert.severity === "high" ? "bg-[#ef4444]/20" : "bg-[#f59e0b]/20"
                }`}>
                  <svg className={`w-5 h-5 ${alert.severity === "high" ? "text-[#ef4444]" : "text-[#f59e0b]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{alert.fighter}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{alert.issue}</p>
                  <p className={`text-xs mt-1 ${alert.severity === "high" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}>
                    {alert.daysAgo ? `${alert.daysAgo} days overdue` : alert.daysLeft ? `${alert.daysLeft} days left` : "Missing"}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Fights & Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Fights */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Upcoming Fights</h2>
            <Link href="/gym/opportunities" className="text-[#ea580c] text-sm font-semibold hover:underline">
              See All
            </Link>
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {upcomingFights.map((fight) => (
              <div key={fight.id} className="p-4 hover:bg-[#222222] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#ea580c] to-[#dc2626] rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold">{fight.fighter} <span className="text-gray-500 font-normal">vs</span> {fight.opponent}</p>
                    <p className="text-gray-500 text-sm">{fight.event}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{fight.date}</p>
                    <p className="text-gray-500 text-xs">{fight.time}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-500 text-sm">{fight.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="p-5 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-4">
            {activityFeed.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === "alert" ? "bg-[#ef4444]/20 text-[#ef4444]" :
                    activity.type === "contract" ? "bg-[#22c55e]/20 text-[#22c55e]" :
                    activity.type === "fight" ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" :
                    "bg-[#ea580c]/20 text-[#ea580c]"
                  }`}>
                    <IconByType type={activity.icon} />
                  </div>
                  {index < activityFeed.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#2a2a2a]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">{activity.action}</span>
                    <span className="text-gray-500"> • {activity.fighter}</span>
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-r from-[#ea580c] via-[#dc2626] to-[#be123c] rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white/80 text-sm font-semibold">New Fighter?</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white">ADD TO YOUR ROSTER</h3>
            <p className="text-white/70 mt-1">Get new fighters compliant and fight-ready in minutes.</p>
          </div>
          <Link
            href="/gym/fighters/add"
            className="inline-flex items-center gap-2 bg-white text-[#dc2626] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Add Fighter
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-black/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-black/10 rounded-full"></div>
        <div className="absolute right-20 top-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}
