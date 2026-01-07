"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data - would come from API
const mockFighter = {
  name: "John Doe",
  combatId: "CID-ABC123",
  record: { wins: 8, losses: 2, draws: 0, knockouts: 5, submissions: 2 },
  weightClass: "Welterweight",
  disciplines: ["MMA", "Boxing"],
  eligibilityStatus: "ELIGIBLE",
  nextExpiration: "2026-02-20",
  gym: "American Top Team",
};

const mockDocuments = {
  total: 8,
  approved: 6,
  pending: 1,
  expiringSoon: 1,
  expired: 0,
};

const mockUpcomingBouts = [
  {
    id: "1",
    event: "UFC Fight Night 245",
    opponent: "Mike Smith",
    date: "2026-02-15",
    location: "Las Vegas, NV",
    weightClass: "Welterweight",
    status: "CONFIRMED",
  },
];

const mockPendingActions = [
  { id: "1", type: "signature", title: "Sign Bout Agreement", event: "UFC Fight Night 245", urgent: true },
  { id: "2", type: "document", title: "Upload Updated Physical", expires: "2026-01-20", urgent: false },
];

const mockNotifications = [
  { id: "1", title: "Bout Agreement Ready", message: "Your bout agreement for UFC FN 245 is ready to sign", time: "2 hours ago", unread: true },
  { id: "2", title: "Physical Expiring Soon", message: "Your physical examination expires in 14 days", time: "1 day ago", unread: true },
  { id: "3", title: "Event Confirmed", message: "Your bout on Feb 15 has been confirmed", time: "3 days ago", unread: false },
];

const mockOpportunities = [
  { id: "1", promotion: "Bellator", event: "Bellator 312", date: "2026-03-10", opponent: "TBD", purse: "$15,000" },
  { id: "2", promotion: "PFL", event: "PFL Regular Season", date: "2026-04-05", opponent: "TBD", purse: "$25,000" },
];

export default function FighterDashboard() {
  const daysUntilExpiration = Math.ceil(
    (new Date(mockFighter.nextExpiration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {mockFighter.name.split(" ")[0]}</h1>
          <p className="text-gray-500 mt-1">Here&apos;s your fight readiness overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/fighter/profile"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-lg text-sm font-medium transition-colors border border-[#2a2a2a]"
          >
            View Profile
          </Link>
          <Link
            href="/fighter/documents?upload=true"
            className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Upload Document
          </Link>
        </div>
      </div>

      {/* Eligibility Status Banner */}
      <div className={`p-4 rounded-xl border ${
        mockFighter.eligibilityStatus === "ELIGIBLE"
          ? "bg-[#22c55e]/10 border-[#22c55e]/30"
          : mockFighter.eligibilityStatus === "CONDITIONAL"
          ? "bg-[#f59e0b]/10 border-[#f59e0b]/30"
          : "bg-[#ef4444]/10 border-[#ef4444]/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              mockFighter.eligibilityStatus === "ELIGIBLE"
                ? "bg-[#22c55e]/20"
                : mockFighter.eligibilityStatus === "CONDITIONAL"
                ? "bg-[#f59e0b]/20"
                : "bg-[#ef4444]/20"
            }`}>
              {mockFighter.eligibilityStatus === "ELIGIBLE" ? (
                <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                mockFighter.eligibilityStatus === "ELIGIBLE"
                  ? "text-[#22c55e]"
                  : mockFighter.eligibilityStatus === "CONDITIONAL"
                  ? "text-[#f59e0b]"
                  : "text-[#ef4444]"
              }`}>
                {mockFighter.eligibilityStatus === "ELIGIBLE"
                  ? "You're Fight Ready!"
                  : mockFighter.eligibilityStatus === "CONDITIONAL"
                  ? "Action Required"
                  : "Not Eligible"}
              </h2>
              <p className="text-gray-400 text-sm">
                {mockFighter.eligibilityStatus === "ELIGIBLE"
                  ? `All documents current. Next expiration in ${daysUntilExpiration} days.`
                  : "Some documents need attention"}
              </p>
            </div>
          </div>
          <Link
            href="/fighter/documents"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Fight Record</p>
          <p className="text-2xl font-bold text-white mt-1">
            {mockFighter.record.wins}-{mockFighter.record.losses}-{mockFighter.record.draws}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {mockFighter.record.knockouts} KO • {mockFighter.record.submissions} SUB
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Documents</p>
          <p className="text-2xl font-bold text-white mt-1">{mockDocuments.approved}/{mockDocuments.total}</p>
          <p className="text-xs text-gray-500 mt-1">
            {mockDocuments.pending} pending • {mockDocuments.expiringSoon} expiring
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Weight Class</p>
          <p className="text-2xl font-bold text-white mt-1">{mockFighter.weightClass}</p>
          <p className="text-xs text-gray-500 mt-1">{mockFighter.disciplines.join(", ")}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Training At</p>
          <p className="text-2xl font-bold text-white mt-1 truncate">{mockFighter.gym}</p>
          <p className="text-xs text-gray-500 mt-1">Active member</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Actions & Bouts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Actions */}
          {mockPendingActions.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
                <h3 className="font-semibold text-white">Action Required</h3>
                <span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] rounded text-xs font-medium">
                  {mockPendingActions.length} pending
                </span>
              </div>
              <div className="divide-y divide-[#2a2a2a]">
                {mockPendingActions.map((action) => (
                  <div key={action.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        action.type === "signature" ? "bg-[#3b82f6]/20" : "bg-[#f59e0b]/20"
                      }`}>
                        {action.type === "signature" ? (
                          <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{action.title}</p>
                        <p className="text-sm text-gray-500">
                          {action.event || `Expires ${new Date(action.expires!).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={action.type === "signature" ? "/fighter/bouts" : "/fighter/documents"}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        action.urgent
                          ? "bg-[#ef4444] hover:bg-[#dc2626] text-white"
                          : "bg-[#252525] hover:bg-[#2a2a2a] text-white border border-[#3a3a3a]"
                      }`}
                    >
                      {action.type === "signature" ? "Sign Now" : "Upload"}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Bouts */}
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="font-semibold text-white">Upcoming Bouts</h3>
              <Link href="/fighter/bouts" className="text-sm text-[#ef4444] hover:underline">
                View All
              </Link>
            </div>
            {mockUpcomingBouts.length > 0 ? (
              <div className="divide-y divide-[#2a2a2a]">
                {mockUpcomingBouts.map((bout) => (
                  <div key={bout.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{bout.event}</h4>
                          <span className="px-2 py-0.5 bg-[#22c55e]/20 text-[#22c55e] rounded text-xs font-medium">
                            {bout.status}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1">vs. {bout.opponent}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(bout.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {bout.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{bout.weightClass}</p>
                        <p className="text-lg font-bold text-white mt-1">
                          {Math.ceil((new Date(bout.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#252525] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">No upcoming bouts</p>
                <Link href="/fighter/opportunities" className="text-sm text-[#ef4444] hover:underline mt-1 inline-block">
                  Browse Opportunities
                </Link>
              </div>
            )}
          </div>

          {/* Opportunities */}
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="font-semibold text-white">Available Opportunities</h3>
              <Link href="/fighter/opportunities" className="text-sm text-[#ef4444] hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[#2a2a2a]">
              {mockOpportunities.map((opp) => (
                <div key={opp.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{opp.promotion}</h4>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{opp.event}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(opp.date).toLocaleDateString()} • Purse: {opp.purse}
                    </p>
                  </div>
                  <Link
                    href={`/fighter/opportunities/${opp.id}`}
                    className="px-3 py-1.5 bg-[#252525] hover:bg-[#2a2a2a] text-white rounded-lg text-sm font-medium transition-colors border border-[#3a3a3a]"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Combat ID */}
        <div className="space-y-6">
          {/* Combat ID Card Preview */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border border-[#2a2a2a] overflow-hidden">
            <div className="bg-gradient-to-r from-[#ef4444] to-[#f97316] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-medium">COMBAT ID</p>
                  <p className="text-white font-bold text-lg">{mockFighter.combatId}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-[#252525] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{mockFighter.name}</p>
                  <p className="text-sm text-gray-500">{mockFighter.weightClass}</p>
                  <p className="text-sm text-gray-500">{mockFighter.record.wins}-{mockFighter.record.losses}-{mockFighter.record.draws}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full" />
                  <span className="text-xs text-[#22c55e]">Verified</span>
                </div>
                <Link
                  href="/fighter/profile"
                  className="text-xs text-[#ef4444] hover:underline"
                >
                  View Full ID →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="font-semibold text-white">Recent Notifications</h3>
              <Link href="/fighter/notifications" className="text-sm text-[#ef4444] hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-[#2a2a2a]">
              {mockNotifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className={`p-4 ${notif.unread ? "bg-[#ef4444]/5" : ""}`}>
                  <div className="flex items-start gap-3">
                    {notif.unread && (
                      <div className="w-2 h-2 bg-[#ef4444] rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div className={notif.unread ? "" : "ml-5"}>
                      <p className={`text-sm ${notif.unread ? "font-medium text-white" : "text-gray-400"}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
            <h3 className="font-semibold text-white mb-4">Career Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Win Rate</span>
                <span className="text-white font-medium">
                  {Math.round((mockFighter.record.wins / (mockFighter.record.wins + mockFighter.record.losses)) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Finish Rate</span>
                <span className="text-white font-medium">
                  {Math.round(((mockFighter.record.knockouts + mockFighter.record.submissions) / mockFighter.record.wins) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">KO/TKO</span>
                <span className="text-white font-medium">{mockFighter.record.knockouts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Submissions</span>
                <span className="text-white font-medium">{mockFighter.record.submissions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
