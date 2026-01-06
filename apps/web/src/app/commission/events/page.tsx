"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data
const mockEvents = [
  {
    id: "1",
    name: "Fierce Fighting Championships",
    event: "Fierce FC XX",
    date: "01/01/2026",
    location: "Las Vegas, NV",
    type: "Professional MMA",
    bouts: 10,
    status: "Needs Approvals",
    approvedBouts: 7,
  },
  {
    id: "2",
    name: "Bare Knuckle Fighting Championship",
    event: "BKFC XX",
    date: "01/08/2026",
    location: "Las Vegas, NV",
    type: "Bare Knuckle Boxing",
    bouts: 12,
    status: "Needs Approvals",
    approvedBouts: 8,
  },
  {
    id: "3",
    name: "Ruthless Combat League",
    event: "RCL XX",
    date: "01/08/2026",
    location: "Reno, NV",
    type: "Professional MMA",
    bouts: 8,
    status: "Approved",
    approvedBouts: 8,
  },
  {
    id: "4",
    name: "Ultimate Fighting Championship",
    event: "UFC XXX",
    date: "01/16/2026",
    location: "Las Vegas, NV",
    type: "Professional MMA",
    bouts: 15,
    status: "Approved",
    approvedBouts: 15,
  },
  {
    id: "5",
    name: "Fierce Fighting Championships",
    event: "Fierce FC XXI",
    date: "02/03/2026",
    location: "Las Vegas, NV",
    type: "Professional MMA",
    bouts: 10,
    status: "Needs Approvals",
    approvedBouts: 3,
  },
];

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "Approved";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isApproved
          ? "bg-[#22c55e]/20 text-[#22c55e]"
          : "bg-[#f59e0b]/20 text-[#f59e0b]"
      }`}
    >
      {status}
    </span>
  );
}

export default function EventsPage() {
  const [filter, setFilter] = useState<"all" | "needsApprovals" | "approved">("all");

  const filteredEvents = mockEvents.filter((event) => {
    if (filter === "all") return true;
    if (filter === "needsApprovals") return event.status === "Needs Approvals";
    if (filter === "approved") return event.status === "Approved";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Upcoming Events</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "all"
              ? "bg-[#3b82f6] text-white"
              : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:bg-[#252525]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("needsApprovals")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "needsApprovals"
              ? "bg-[#3b82f6] text-white"
              : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:bg-[#252525]"
          }`}
        >
          Needs Approvals
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "approved"
              ? "bg-[#3b82f6] text-white"
              : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:bg-[#252525]"
          }`}
        >
          Approved
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 hover:border-[#3b82f6] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#252525] rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{event.name}</h3>
                  <p className="text-[#3b82f6] font-medium">{event.event}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                    <span>🥊 {event.type}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={event.status} />
            </div>

            <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Bouts</p>
                  <p className="font-semibold text-white">{event.bouts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="font-semibold text-white">
                    {event.approvedBouts}/{event.bouts}
                  </p>
                </div>
                <div className="w-32 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-full"
                    style={{ width: `${(event.approvedBouts / event.bouts) * 100}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/commission/events/${event.id}`}
                className="px-4 py-2 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
}
