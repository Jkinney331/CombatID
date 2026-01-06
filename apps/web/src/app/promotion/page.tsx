"use client";

import Link from "next/link";
import { useState } from "react";

// Mock data for dashboard
const upcomingEvents = [
  {
    id: "1",
    name: "EFL Fight Night 47",
    date: "2024-02-15",
    venue: "MGM Grand Garden Arena",
    location: "Las Vegas, NV",
    status: "approved",
    bouts: 12,
    pendingSignatures: 2,
  },
  {
    id: "2",
    name: "EFL Championship Series",
    date: "2024-03-22",
    venue: "T-Mobile Arena",
    location: "Las Vegas, NV",
    status: "submitted",
    bouts: 14,
    pendingSignatures: 8,
  },
  {
    id: "3",
    name: "EFL Contender Series 8",
    date: "2024-04-05",
    venue: "UFC Apex",
    location: "Las Vegas, NV",
    status: "draft",
    bouts: 6,
    pendingSignatures: 12,
  },
];

const recentActivity = [
  { id: 1, action: "Contract signed", fighter: "Marcus Rivera", event: "EFL Fight Night 47", time: "2 hours ago" },
  { id: 2, action: "Fighter added to roster", fighter: "Sarah Chen", event: null, time: "5 hours ago" },
  { id: 3, action: "Event approved", fighter: null, event: "EFL Fight Night 47", time: "1 day ago" },
  { id: 4, action: "Bout agreement sent", fighter: "Jake Thompson", event: "EFL Championship Series", time: "1 day ago" },
  { id: 5, action: "Medical docs verified", fighter: "Ana Rodriguez", event: null, time: "2 days ago" },
];

const pendingActions = [
  { id: 1, type: "signature", description: "2 fighters pending signature", event: "EFL Fight Night 47", priority: "high" },
  { id: 2, type: "submission", description: "Submit event to commission", event: "EFL Contender Series 8", priority: "medium" },
  { id: 3, type: "contract", description: "5 contracts awaiting response", event: null, priority: "medium" },
  { id: 4, type: "eligibility", description: "3 fighters need document updates", event: null, priority: "low" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  submitted: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  draft: { bg: "bg-[#f3f4f6]", text: "text-[#374151]" },
};

export default function PromotionDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-[#6b7280]">Welcome back, Elite Fight League</p>
        </div>
        <Link
          href="/promotion/events/new"
          className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
        >
          + Create Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Roster Fighters</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">24</p>
          <p className="text-xs text-[#10b981] mt-2">+3 this month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Upcoming Events</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">3</p>
          <p className="text-xs text-[#6b7280] mt-2">Next: Feb 15</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Pending Signatures</p>
          <p className="text-3xl font-bold text-[#f59e0b] mt-1">22</p>
          <p className="text-xs text-[#6b7280] mt-2">Across 3 events</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Events This Year</p>
          <p className="text-3xl font-bold text-[#111827] mt-1">8</p>
          <p className="text-xs text-[#6b7280] mt-2">47 bouts completed</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Upcoming Events - 2 columns */}
        <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h2 className="font-semibold text-[#111827]">Upcoming Events</h2>
            <Link href="/promotion/events" className="text-sm text-[#7C3AED] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/promotion/events/${event.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#111827]">{event.name}</h3>
                    <p className="text-sm text-[#6b7280]">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      • {event.venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#111827]">{event.bouts} bouts</p>
                    {event.pendingSignatures > 0 && (
                      <p className="text-xs text-[#f59e0b]">{event.pendingSignatures} pending</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status].bg} ${statusColors[event.status].text}`}
                  >
                    {event.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Actions - 1 column */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h2 className="font-semibold text-[#111827]">Action Required</h2>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {pendingActions.map((action) => (
              <div key={action.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      action.priority === "high"
                        ? "bg-[#ef4444]"
                        : action.priority === "medium"
                        ? "bg-[#f59e0b]"
                        : "bg-[#6b7280]"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{action.description}</p>
                    {action.event && <p className="text-xs text-[#6b7280] mt-1">{action.event}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                  {activity.action.includes("signed") && "✍️"}
                  {activity.action.includes("added") && "➕"}
                  {activity.action.includes("approved") && "✓"}
                  {activity.action.includes("sent") && "📤"}
                  {activity.action.includes("verified") && "✓"}
                </div>
                <div>
                  <p className="text-sm text-[#111827]">
                    <span className="font-medium">{activity.action}</span>
                    {activity.fighter && <span> - {activity.fighter}</span>}
                  </p>
                  {activity.event && <p className="text-xs text-[#6b7280]">{activity.event}</p>}
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
