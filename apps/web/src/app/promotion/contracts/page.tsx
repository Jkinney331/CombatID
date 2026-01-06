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
  active: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]" },
  pending: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]" },
  expiring: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]" },
  signed: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]" },
  partial: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]" },
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
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
          <p className="text-gray-500">Manage fighter contracts and bout agreements</p>
        </div>
        <button className="bg-[#c5f82a] text-[#0f0f0f] px-4 py-2 rounded-lg hover:bg-[#d4f94d] transition-colors font-semibold">
          + New Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Active Contracts</p>
          <p className="text-2xl font-bold text-white">
            {contracts.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Pending Signature</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {contracts.filter((c) => c.status === "pending").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Expiring Soon</p>
          <p className="text-2xl font-bold text-[#ef4444]">
            {contracts.filter((c) => c.status === "expiring").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Bout Agreements</p>
          <p className="text-2xl font-bold text-white">{boutAgreements.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("roster")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "roster"
                ? "border-[#c5f82a] text-[#c5f82a]"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Roster Contracts
          </button>
          <button
            onClick={() => setActiveTab("bout")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "bout"
                ? "border-[#c5f82a] text-[#c5f82a]"
                : "border-transparent text-gray-500 hover:text-white"
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
              className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expiring">Expiring</option>
            </select>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#151515]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fighter</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Duration</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fights</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">{contract.fighter.name}</p>
                          <p className="text-xs text-gray-500">{contract.fighter.combatId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{contract.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status].bg} ${statusColors[contract.status].text}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {contract.startDate ? (
                        <>
                          {contract.startDate} - {contract.endDate}
                        </>
                      ) : (
                        <span className="text-gray-600">Awaiting signature</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {contract.fightsRemaining} / {contract.totalFights} remaining
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/promotion/contracts/${contract.id}`}
                        className="text-[#c5f82a] hover:underline text-sm font-medium"
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
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-[#151515]">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Matchup</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Sent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Signatures</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {boutAgreements.map((agreement) => (
                <tr key={agreement.id} className="hover:bg-[#252525] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{agreement.event}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {agreement.fighterA} vs {agreement.fighterB}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[agreement.status].bg} ${statusColors[agreement.status].text}`}
                    >
                      {agreement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{agreement.sentAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={agreement.fighterASigned ? "text-[#22c55e]" : "text-gray-600"}>
                        {agreement.fighterASigned ? "✓" : "○"} {agreement.fighterA.split(" ")[0]}
                      </span>
                      <span className={agreement.fighterBSigned ? "text-[#22c55e]" : "text-gray-600"}>
                        {agreement.fighterBSigned ? "✓" : "○"} {agreement.fighterB.split(" ")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[#c5f82a] hover:underline text-sm font-medium">View</button>
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
