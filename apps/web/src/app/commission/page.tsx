"use client";

import Link from "next/link";

// Mock data
const upcomingEvents = [
  { id: "1", name: "Fierce Fighting Championships", event: "Fierce FC XX", date: "01/01/2026", time: "7:00 PM", status: "pending" },
  { id: "2", name: "Bare Knuckle Fighting Championship", event: "BKFC XX", date: "01/08/2026", time: "8:00 PM", status: "pending" },
  { id: "3", name: "Ruthless Combat League", event: "RCL XX", date: "01/08/2026", time: "6:00 PM", status: "approved" },
  { id: "4", name: "Ultimate Fighting Championship", event: "UFC XXX", date: "01/16/2026", time: "10:00 PM", status: "approved" },
];

const pendingApprovals = [
  { id: "1", fighter: "John Doe", fighterId: "DOEJ123456", type: "Blood Test", uploaded: "2 hours ago", urgent: true },
  { id: "2", fighter: "Jake Smith", fighterId: "SMITHJ789", type: "Physical Exam", uploaded: "5 hours ago", urgent: false },
  { id: "3", fighter: "Mike Jones", fighterId: "JONESM456", type: "Eye Exam", uploaded: "1 day ago", urgent: false },
  { id: "4", fighter: "Carlos Santos", fighterId: "SANTOSC456", type: "MRI Scan", uploaded: "2 days ago", urgent: true },
];

const teamMembers = [
  { id: "1", name: "Dr. Sarah Chen", role: "Medical Director", avatar: "SC", status: "online" },
  { id: "2", name: "James Wilson", role: "Senior Inspector", avatar: "JW", status: "online" },
  { id: "3", name: "Maria Garcia", role: "Compliance Officer", avatar: "MG", status: "away" },
  { id: "4", name: "Tom Bradley", role: "Event Coordinator", avatar: "TB", status: "offline" },
];

export default function CommissionDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Row - Dark Theme */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">Total Fighters</span>
            <span className="w-10 h-10 bg-[#3b82f6]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-white">1,247</p>
          <p className="text-sm text-[#22c55e] mt-2 flex items-center gap-1">
            <span>+3.1%</span>
            <span className="text-gray-500">Last month</span>
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">Pending Reviews</span>
            <span className="w-10 h-10 bg-[#f59e0b]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-white">23</p>
          <p className="text-sm text-[#ef4444] mt-2 flex items-center gap-1">
            <span>8 urgent</span>
            <span className="text-gray-500">Need attention</span>
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">Events This Month</span>
            <span className="w-10 h-10 bg-[#8b5cf6]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-white">12</p>
          <p className="text-sm text-gray-500 mt-2">4 pending approval</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm font-medium">Compliance Rate</span>
            <span className="w-10 h-10 bg-[#22c55e]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-white">94.2%</p>
          <p className="text-sm text-[#22c55e] mt-2 flex items-center gap-1">
            <span>+2.4%</span>
            <span className="text-gray-500">vs last quarter</span>
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Calendar of Events - Left Column */}
        <div className="col-span-2 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
            <h2 className="font-semibold text-white">Upcoming Events</h2>
            <div className="flex items-center gap-2">
              <select className="text-sm bg-[#252525] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-gray-400 focus:outline-none">
                <option>This week</option>
                <option>This month</option>
                <option>Next 30 days</option>
              </select>
            </div>
          </div>
          <div className="p-5">
            {/* Timeline View */}
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.status === 'approved' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}></div>
                    {index < upcomingEvents.length - 1 && <div className="w-0.5 h-full bg-[#2a2a2a] mt-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-[#252525] rounded-xl p-4 group-hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-white">{event.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{event.event} • {event.date} at {event.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'approved'
                            ? 'bg-[#22c55e]/20 text-[#22c55e]'
                            : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        }`}>
                          {event.status === 'approved' ? 'Approved' : 'Pending Review'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 bg-[#3b82f6] rounded-full border-2 border-[#252525] text-white text-xs flex items-center justify-center">F1</div>
                          <div className="w-6 h-6 bg-[#8b5cf6] rounded-full border-2 border-[#252525] text-white text-xs flex items-center justify-center">F2</div>
                          <div className="w-6 h-6 bg-[#3a3a3a] rounded-full border-2 border-[#252525] text-gray-400 text-xs flex items-center justify-center">+8</div>
                        </div>
                        <span className="text-xs text-gray-500">10 fighters on card</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Team & Stats */}
        <div className="space-y-6">
          {/* Attendance / Team */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Team Members</h3>
              <button className="text-[#3b82f6] text-sm font-medium">View all</button>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.avatar}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${
                      member.status === 'online' ? 'bg-[#22c55e]' : member.status === 'away' ? 'bg-[#f59e0b]' : 'bg-gray-500'
                    }`}></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Stats */}
          <div className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-white/80 text-sm">Monthly Report</span>
            </div>
            <p className="text-2xl font-bold mb-1">892 Fighters</p>
            <p className="text-white/70 text-sm mb-4">Fully compliant this month</p>
            <button className="w-full bg-white text-[#3b82f6] rounded-xl py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
        <div className="p-5 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Pending Approvals</h2>
            <p className="text-sm text-gray-500 mt-1">Documents requiring your review</p>
          </div>
          <Link href="/commission/approvals" className="text-[#3b82f6] text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#151515]">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fighter</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {pendingApprovals.map((item) => (
                <tr key={item.id} className="hover:bg-[#252525] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">
                        {item.fighter.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.fighter}</p>
                        <p className="text-xs text-gray-500">{item.fighterId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-400">{item.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">{item.uploaded}</span>
                  </td>
                  <td className="px-5 py-4">
                    {item.urgent ? (
                      <span className="px-2.5 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs font-medium rounded-full">Urgent</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#3a3a3a] text-gray-400 text-xs font-medium rounded-full">Normal</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-4 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-[#2563eb] transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
