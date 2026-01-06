"use client";

import Link from "next/link";
import { useState } from "react";

const rosterFighters = [
  {
    id: "f1",
    name: "Marcus Rivera",
    combatId: "CID-MR-2024",
    record: "15-2",
    weightClass: "Lightweight",
    disciplines: ["MMA"],
    eligibility: "eligible",
    contractedUntil: "2025-12-31",
    lastFight: "2024-01-20",
    upcomingFight: "2024-02-15",
  },
  {
    id: "f2",
    name: "Sarah Chen",
    combatId: "CID-SC-2024",
    record: "8-1",
    weightClass: "Strawweight",
    disciplines: ["MMA"],
    eligibility: "eligible",
    contractedUntil: "2025-06-30",
    lastFight: "2023-12-10",
    upcomingFight: "2024-02-15",
  },
  {
    id: "f3",
    name: "Mike Johnson",
    combatId: "CID-MJ-2024",
    record: "7-4",
    weightClass: "Welterweight",
    disciplines: ["MMA"],
    eligibility: "conditional",
    contractedUntil: "2024-12-31",
    lastFight: "2024-01-06",
    upcomingFight: "2024-02-15",
  },
  {
    id: "f4",
    name: "David Lee",
    combatId: "CID-DL-2024",
    record: "5-1",
    weightClass: "Bantamweight",
    disciplines: ["MMA"],
    eligibility: "eligible",
    contractedUntil: "2025-03-31",
    lastFight: "2023-11-15",
    upcomingFight: null,
  },
  {
    id: "f5",
    name: "Ana Rodriguez",
    combatId: "CID-AR-2024",
    record: "10-2",
    weightClass: "Strawweight",
    disciplines: ["MMA", "Kickboxing"],
    eligibility: "eligible",
    contractedUntil: "2025-09-30",
    lastFight: "2024-01-06",
    upcomingFight: "2024-02-15",
  },
  {
    id: "f6",
    name: "Carlos Santos",
    combatId: "CID-CS-2024",
    record: "9-2",
    weightClass: "Welterweight",
    disciplines: ["MMA"],
    eligibility: "incomplete",
    contractedUntil: "2024-08-31",
    lastFight: "2023-10-20",
    upcomingFight: "2024-02-15",
  },
];

const eligibilityColors: Record<string, { bg: string; text: string }> = {
  eligible: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]" },
  conditional: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]" },
  incomplete: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]" },
};

export default function RosterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weightFilter, setWeightFilter] = useState<string>("all");
  const [eligibilityFilter, setEligibilityFilter] = useState<string>("all");

  const filteredFighters = rosterFighters.filter((fighter) => {
    const matchesSearch = fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.combatId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWeight = weightFilter === "all" || fighter.weightClass === weightFilter;
    const matchesEligibility = eligibilityFilter === "all" || fighter.eligibility === eligibilityFilter;
    return matchesSearch && matchesWeight && matchesEligibility;
  });

  const weightClasses = [...new Set(rosterFighters.map((f) => f.weightClass))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Roster</h1>
          <p className="text-gray-500">Manage your contracted fighters</p>
        </div>
        <Link
          href="/promotion/fighters"
          className="bg-[#c5f82a] text-[#0f0f0f] px-4 py-2 rounded-lg hover:bg-[#d4f94d] transition-colors font-semibold"
        >
          + Add Fighter
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Total Fighters</p>
          <p className="text-2xl font-bold text-white">{rosterFighters.length}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Eligible</p>
          <p className="text-2xl font-bold text-[#22c55e]">
            {rosterFighters.filter((f) => f.eligibility === "eligible").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Conditional</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {rosterFighters.filter((f) => f.eligibility === "conditional").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Needs Attention</p>
          <p className="text-2xl font-bold text-[#ef4444]">
            {rosterFighters.filter((f) => f.eligibility === "incomplete").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search fighters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c5f82a] focus:border-transparent"
          />
        </div>
        <select
          value={weightFilter}
          onChange={(e) => setWeightFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
        >
          <option value="all">All Weight Classes</option>
          {weightClasses.map((wc) => (
            <option key={wc} value={wc}>{wc}</option>
          ))}
        </select>
        <select
          value={eligibilityFilter}
          onChange={(e) => setEligibilityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
        >
          <option value="all">All Eligibility</option>
          <option value="eligible">Eligible</option>
          <option value="conditional">Conditional</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Fighter List */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#151515]">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fighter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Weight Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Record</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Eligibility</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Contract Until</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Next Fight</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {filteredFighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#252525] transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/promotion/roster/${fighter.id}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">{fighter.name}</p>
                      <p className="text-xs text-gray-500">{fighter.combatId}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{fighter.weightClass}</td>
                <td className="px-4 py-3 text-sm font-medium text-white">{fighter.record}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${eligibilityColors[fighter.eligibility].bg} ${eligibilityColors[fighter.eligibility].text}`}
                  >
                    {fighter.eligibility}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{fighter.contractedUntil}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {fighter.upcomingFight || <span className="text-gray-600">None scheduled</span>}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/promotion/roster/${fighter.id}`}
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

      {filteredFighters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fighters found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
