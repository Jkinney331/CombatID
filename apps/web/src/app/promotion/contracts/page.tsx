"use client";

import Link from "next/link";
import { useState } from "react";

const contracts = [
  {
    id: "c1",
    fighter: { name: "Marcus Rivera", combatId: "CID-MR-2024" },
    type: "Multi-fight",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    fightsRemaining: 4,
    totalFights: 6,
  },
  {
    id: "c2",
    fighter: { name: "Sarah Chen", combatId: "CID-SC-2024" },
    type: "Multi-fight",
    status: "active",
    startDate: "2023-07-01",
    endDate: "2025-06-30",
    fightsRemaining: 2,
    totalFights: 4,
  },
  {
    id: "c3",
    fighter: { name: "Alex Martinez", combatId: "CID-AM-2024" },
    type: "Single fight",
    status: "pending",
    startDate: null,
    endDate: null,
    fightsRemaining: 1,
    totalFights: 1,
  },
  {
    id: "c4",
    fighter: { name: "Mike Johnson", combatId: "CID-MJ-2024" },
    type: "Multi-fight",
    status: "expiring",
    startDate: "2023-01-01",
    endDate: "2024-03-31",
    fightsRemaining: 1,
    totalFights: 4,
  },
  {
    id: "c5",
    fighter: { name: "Jessica Williams", combatId: "CID-JW-2024" },
    type: "Multi-fight",
    status: "pending",
    startDate: null,
    endDate: null,
    fightsRemaining: 3,
    totalFights: 3,
  },
];

const boutAgreements = [
  {
    id: "ba1",
    event: "EFL Fight Night 47",
    fighterA: "Marcus Rivera",
    fighterB: "Jake Thompson",
    status: "partial",
    fighterASigned: true,
    fighterBSigned: false,
    sentAt: "2024-01-16",
  },
  {
    id: "ba2",
    event: "EFL Fight Night 47",
    fighterA: "Sarah Chen",
    fighterB: "Ana Rodriguez",
    status: "signed",
    fighterASigned: true,
    fighterBSigned: true,
    sentAt: "2024-01-14",
  },
  {
    id: "ba3",
    event: "EFL Championship Series",
    fighterA: "Marcus Rivera",
    fighterB: "Kevin Park",
    status: "pending",
    fighterASigned: false,
    fighterBSigned: false,
    sentAt: "2024-01-20",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  expiring: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  signed: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  partial: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
};

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<"roster" | "bout">("roster");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredContracts = contracts.filter(
    (c) => statusFilter === "all" || c.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Contracts</h1>
          <p className="text-[#6b7280]">Manage fighter contracts and bout agreements</p>
        </div>
        <button className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors font-medium">
          + New Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Active Contracts</p>
          <p className="text-2xl font-bold text-[#111827]">
            {contracts.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Pending Signature</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {contracts.filter((c) => c.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Expiring Soon</p>
          <p className="text-2xl font-bold text-[#ef4444]">
            {contracts.filter((c) => c.status === "expiring").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Bout Agreements</p>
          <p className="text-2xl font-bold text-[#111827]">{boutAgreements.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("roster")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "roster"
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#6b7280] hover:text-[#111827]"
            }`}
          >
            Roster Contracts
          </button>
          <button
            onClick={() => setActiveTab("bout")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "bout"
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#6b7280] hover:text-[#111827]"
            }`}
          >
            Bout Agreements
          </button>
        </div>
      </div>

      {/* Roster Contracts Tab */}
      {activeTab === "roster" && (
        <>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expiring">Expiring</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighter</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Duration</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fights</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                          <span>👤</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{contract.fighter.name}</p>
                          <p className="text-xs text-[#6b7280]">{contract.fighter.combatId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{contract.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status].bg} ${statusColors[contract.status].text}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">
                      {contract.startDate ? (
                        <>
                          {contract.startDate} - {contract.endDate}
                        </>
                      ) : (
                        <span className="text-[#9ca3af]">Awaiting signature</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">
                      {contract.fightsRemaining} / {contract.totalFights} remaining
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/promotion/contracts/${contract.id}`}
                        className="text-[#7C3AED] hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Bout Agreements Tab */}
      {activeTab === "bout" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Matchup</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Sent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Signatures</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {boutAgreements.map((agreement) => (
                <tr key={agreement.id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 font-medium text-[#111827]">{agreement.event}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">
                    {agreement.fighterA} vs {agreement.fighterB}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[agreement.status].bg} ${statusColors[agreement.status].text}`}
                    >
                      {agreement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{agreement.sentAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={agreement.fighterASigned ? "text-[#10b981]" : "text-[#9ca3af]"}>
                        {agreement.fighterASigned ? "✓" : "○"} {agreement.fighterA.split(" ")[0]}
                      </span>
                      <span className={agreement.fighterBSigned ? "text-[#10b981]" : "text-[#9ca3af]"}>
                        {agreement.fighterBSigned ? "✓" : "○"} {agreement.fighterB.split(" ")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[#7C3AED] hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
