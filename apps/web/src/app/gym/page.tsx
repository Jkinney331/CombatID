"use client";

import Link from "next/link";

const fighters = [
  { id: "f1", name: "Marcus Rivera", record: "15-2", weightClass: "Lightweight", eligibility: "eligible", nextFight: "Feb 15, 2024", promotion: "Elite Fight League" },
  { id: "f2", name: "Sarah Chen", record: "8-1", weightClass: "Strawweight", eligibility: "eligible", nextFight: "Feb 15, 2024", promotion: "Elite Fight League" },
  { id: "f3", name: "Mike Johnson", record: "7-4", weightClass: "Welterweight", eligibility: "conditional", nextFight: "Feb 15, 2024", promotion: "Elite Fight League" },
  { id: "f4", name: "David Lee", record: "5-1", weightClass: "Bantamweight", eligibility: "eligible", nextFight: null, promotion: null },
  { id: "f5", name: "Lisa Park", record: "3-0", weightClass: "Flyweight", eligibility: "incomplete", nextFight: null, promotion: null },
];

const upcomingFights = [
  { id: 1, fighter: "Marcus Rivera", opponent: "Jake Thompson", event: "EFL Fight Night 47", date: "Feb 15, 2024", promotion: "Elite Fight League" },
  { id: 2, fighter: "Sarah Chen", opponent: "Ana Rodriguez", event: "EFL Fight Night 47", date: "Feb 15, 2024", promotion: "Elite Fight League" },
  { id: 3, fighter: "Mike Johnson", opponent: "Carlos Santos", event: "EFL Fight Night 47", date: "Feb 15, 2024", promotion: "Elite Fight League" },
];

const recentActivity = [
  { id: 1, action: "Blood test uploaded", fighter: "Marcus Rivera", time: "2 hours ago" },
  { id: 2, action: "Contract signed", fighter: "Sarah Chen", time: "5 hours ago" },
  { id: 3, action: "Eye exam expired", fighter: "Mike Johnson", time: "1 day ago" },
  { id: 4, action: "Physical completed", fighter: "David Lee", time: "2 days ago" },
];

const documentAlerts = [
  { id: 1, fighterId: "f3", fighter: "Mike Johnson", document: "Eye Examination", status: "expired", daysAgo: 5 },
  { id: 2, fighterId: "f5", fighter: "Lisa Park", document: "Blood Test", status: "missing", daysAgo: null },
  { id: 3, fighterId: "f5", fighter: "Lisa Park", document: "Physical Exam", status: "missing", daysAgo: null },
  { id: 4, fighterId: "f1", fighter: "Marcus Rivera", document: "MRI Scan", status: "expiring", daysUntil: 30 },
];

const eligibilityColors: Record<string, { bg: string; text: string }> = {
  eligible: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  conditional: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  incomplete: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

export default function GymDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-[#6b7280]">Welcome back, American Top Team</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Total Fighters</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">18</p>
          <p className="text-xs text-[#10b981] mt-2">+2 this month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Fully Eligible</p>
          <p className="text-3xl font-bold text-[#10b981] mt-1">15</p>
          <p className="text-xs text-[#6b7280] mt-2">83% of roster</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Upcoming Fights</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">3</p>
          <p className="text-xs text-[#6b7280] mt-2">Next: Feb 15</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Document Alerts</p>
          <p className="text-3xl font-bold text-[#f59e0b] mt-1">4</p>
          <p className="text-xs text-[#6b7280] mt-2">Need attention</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Document Alerts - Priority */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h2 className="font-semibold text-[#111827]">Document Alerts</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#fef3c7] text-[#92400e]">
              {documentAlerts.length} alerts
            </span>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {documentAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={`/gym/fighters/${alert.fighterId}`}
                className="p-4 block hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.status === "expired" || alert.status === "missing"
                        ? "bg-[#ef4444]"
                        : "bg-[#f59e0b]"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{alert.fighter}</p>
                    <p className="text-xs text-[#6b7280]">
                      {alert.document} -{" "}
                      <span
                        className={
                          alert.status === "expired" || alert.status === "missing"
                            ? "text-[#ef4444]"
                            : "text-[#f59e0b]"
                        }
                      >
                        {alert.status === "expired" && `Expired ${alert.daysAgo} days ago`}
                        {alert.status === "missing" && "Missing"}
                        {alert.status === "expiring" && `Expires in ${alert.daysUntil} days`}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Fights - 2 columns */}
        <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h2 className="font-semibold text-[#111827]">Upcoming Fights</h2>
            <Link href="/gym/fighters" className="text-sm text-[#059669] hover:underline">
              View all fighters
            </Link>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {upcomingFights.map((fight) => (
              <div key={fight.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#059669]/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🥊</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">
                      {fight.fighter} vs {fight.opponent}
                    </p>
                    <p className="text-sm text-[#6b7280]">{fight.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#111827]">{fight.date}</p>
                  <p className="text-xs text-[#6b7280]">{fight.promotion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fighter Overview */}
      <div className="bg-white rounded-xl border border-[#e5e7eb]">
        <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <h2 className="font-semibold text-[#111827]">Fighter Overview</h2>
          <Link
            href="/gym/fighters"
            className="text-sm text-[#059669] hover:underline"
          >
            Manage all fighters
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Weight Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Record</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Eligibility</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Next Fight</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {fighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#f9fafb]">
                <td className="px-4 py-3">
                  <Link href={`/gym/fighters/${fighter.id}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                      <span>👤</span>
                    </div>
                    <span className="font-medium text-[#111827]">{fighter.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-[#374151]">{fighter.weightClass}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#374151]">{fighter.record}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${eligibilityColors[fighter.eligibility].bg} ${eligibilityColors[fighter.eligibility].text}`}
                  >
                    {fighter.eligibility}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#374151]">
                  {fighter.nextFight || <span className="text-[#9ca3af]">None scheduled</span>}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/gym/fighters/${fighter.id}`}
                    className="text-[#059669] hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-[#e5e7eb]">
        <div className="p-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[#111827]">Recent Activity</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb]">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#f3f4f6] rounded-full flex items-center justify-center text-sm">
                  {activity.action.includes("uploaded") && "📤"}
                  {activity.action.includes("signed") && "✍️"}
                  {activity.action.includes("expired") && "⚠️"}
                  {activity.action.includes("completed") && "✓"}
                </div>
                <div>
                  <p className="text-sm text-[#111827]">
                    <span className="font-medium">{activity.action}</span>
                    <span> - {activity.fighter}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#6b7280]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
