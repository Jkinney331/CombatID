import Link from "next/link";

// Mock data
const upcomingEvents = [
  { id: "1", name: "Fierce Fighting Championships", event: "Fierce FC XX", date: "01/01/2026", status: "Needs Approvals" },
  { id: "2", name: "Bare Knuckle Fighting Championship", event: "BKFC XX", date: "01/08/2026", status: "Needs Approvals" },
  { id: "3", name: "Ruthless Combat League", event: "RCL XX", date: "01/08/2026", status: "Approved" },
  { id: "4", name: "Ultimate Fighting Championship", event: "UFC XXX", date: "01/16/2026", status: "Approved" },
];

const pendingApprovals = [
  { id: "1", fighter: "DOEJ123456", type: "Blood Test", uploaded: "2 hours ago" },
  { id: "2", fighter: "SMITHJ789", type: "Physical Exam", uploaded: "5 hours ago" },
  { id: "3", fighter: "JONESM456", type: "Eye Exam", uploaded: "1 day ago" },
];

const stats = [
  { label: "Active Fighters", value: "1,247", change: "+12 this week" },
  { label: "Pending Approvals", value: "23", change: "8 urgent" },
  { label: "Upcoming Events", value: "12", change: "Next 30 days" },
  { label: "Cleared Fighters", value: "892", change: "71% of roster" },
];

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "Approved";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isApproved
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function CommissionDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Good Morning</h1>
        <p className="text-white/80">Nevada Athletic Commission Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
            <p className="text-[#6b7280] text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-[#111827]">{stat.value}</p>
            <p className="text-xs text-[#6b7280] mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center">
            <h2 className="font-semibold text-[#111827]">Upcoming Events</h2>
            <Link href="/commission/events" className="text-[#2563EB] text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#111827]">{event.name}</p>
                  <p className="text-sm text-[#6b7280]">{event.event} • {event.date}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center">
            <h2 className="font-semibold text-[#111827]">Pending Approvals</h2>
            <Link href="/commission/approvals" className="text-[#2563EB] text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#111827]">{item.fighter}</p>
                  <p className="text-sm text-[#6b7280]">{item.type} • {item.uploaded}</p>
                </div>
                <button className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <Link
          href="/commission/fighters"
          className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#2563EB] transition-colors text-center"
        >
          <span className="text-2xl mb-2 block">🔍</span>
          <p className="font-medium text-[#111827]">Search Fighters</p>
        </Link>
        <Link
          href="/commission/events"
          className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#2563EB] transition-colors text-center"
        >
          <span className="text-2xl mb-2 block">📅</span>
          <p className="font-medium text-[#111827]">View Events</p>
        </Link>
        <Link
          href="/commission/rulesets"
          className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#2563EB] transition-colors text-center"
        >
          <span className="text-2xl mb-2 block">📋</span>
          <p className="font-medium text-[#111827]">Manage Rulesets</p>
        </Link>
        <Link
          href="/commission/approvals"
          className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#2563EB] transition-colors text-center"
        >
          <span className="text-2xl mb-2 block">✓</span>
          <p className="font-medium text-[#111827]">Process Approvals</p>
        </Link>
      </div>
    </div>
  );
}
