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
  eligible: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  conditional: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  incomplete: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
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
          <h1 className="text-2xl font-bold text-[#111827]">My Roster</h1>
          <p className="text-[#6b7280]">Manage your contracted fighters</p>
        </div>
        <Link
          href="/promotion/fighters"
          className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
        >
          + Add Fighter
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Total Fighters</p>
          <p className="text-2xl font-bold text-[#111827]">{rosterFighters.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Eligible</p>
          <p className="text-2xl font-bold text-[#10b981]">
            {rosterFighters.filter((f) => f.eligibility === "eligible").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Conditional</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {rosterFighters.filter((f) => f.eligibility === "conditional").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Needs Attention</p>
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
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        </div>
        <select
          value={weightFilter}
          onChange={(e) => setWeightFilter(e.target.value)}
          className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
        >
          <option value="all">All Weight Classes</option>
          {weightClasses.map((wc) => (
            <option key={wc} value={wc}>{wc}</option>
          ))}
        </select>
        <select
          value={eligibilityFilter}
          onChange={(e) => setEligibilityFilter(e.target.value)}
          className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
        >
          <option value="all">All Eligibility</option>
          <option value="eligible">Eligible</option>
          <option value="conditional">Conditional</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Fighter List */}
      <div className="bg-white rounded-xl border border-[#e5e7eb]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Weight Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Record</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Eligibility</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Contract Until</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Next Fight</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filteredFighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#f9fafb]">
                <td className="px-4 py-3">
                  <Link href={`/promotion/roster/${fighter.id}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                      <span>👤</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{fighter.name}</p>
                      <p className="text-xs text-[#6b7280]">{fighter.combatId}</p>
                    </div>
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
                <td className="px-4 py-3 text-sm text-[#374151]">{fighter.contractedUntil}</td>
                <td className="px-4 py-3 text-sm text-[#374151]">
                  {fighter.upcomingFight || <span className="text-[#9ca3af]">None scheduled</span>}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/promotion/roster/${fighter.id}`}
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

      {filteredFighters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6b7280]">No fighters found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
