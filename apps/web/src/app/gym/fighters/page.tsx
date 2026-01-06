"use client";

import Link from "next/link";
import { useState } from "react";

const fighters = [
  {
    id: "f1",
    name: "Marcus Rivera",
    combatId: "CID-MR-2024",
    record: "15-2",
    weightClass: "Lightweight",
    eligibility: "eligible",
    nextFight: "Feb 15, 2024",
    promotion: "Elite Fight League",
    contractStatus: "active",
    documentsComplete: 5,
    documentsTotal: 5,
  },
  {
    id: "f2",
    name: "Sarah Chen",
    combatId: "CID-SC-2024",
    record: "8-1",
    weightClass: "Strawweight",
    eligibility: "eligible",
    nextFight: "Feb 15, 2024",
    promotion: "Elite Fight League",
    contractStatus: "active",
    documentsComplete: 5,
    documentsTotal: 5,
  },
  {
    id: "f3",
    name: "Mike Johnson",
    combatId: "CID-MJ-2024",
    record: "7-4",
    weightClass: "Welterweight",
    eligibility: "conditional",
    nextFight: "Feb 15, 2024",
    promotion: "Elite Fight League",
    contractStatus: "active",
    documentsComplete: 4,
    documentsTotal: 5,
  },
  {
    id: "f4",
    name: "David Lee",
    combatId: "CID-DL-2024",
    record: "5-1",
    weightClass: "Bantamweight",
    eligibility: "eligible",
    nextFight: null,
    promotion: null,
    contractStatus: "free agent",
    documentsComplete: 5,
    documentsTotal: 5,
  },
  {
    id: "f5",
    name: "Lisa Park",
    combatId: "CID-LP-2024",
    record: "3-0",
    weightClass: "Flyweight",
    eligibility: "incomplete",
    nextFight: null,
    promotion: null,
    contractStatus: "free agent",
    documentsComplete: 2,
    documentsTotal: 5,
  },
  {
    id: "f6",
    name: "Tommy Williams",
    combatId: "CID-TW-2024",
    record: "10-3",
    weightClass: "Middleweight",
    eligibility: "eligible",
    nextFight: null,
    promotion: "Bellator",
    contractStatus: "active",
    documentsComplete: 5,
    documentsTotal: 5,
  },
  {
    id: "f7",
    name: "Ana Rodriguez",
    combatId: "CID-AR-2024",
    record: "10-2",
    weightClass: "Strawweight",
    eligibility: "eligible",
    nextFight: "Feb 15, 2024",
    promotion: "Elite Fight League",
    contractStatus: "active",
    documentsComplete: 5,
    documentsTotal: 5,
  },
];

const eligibilityColors: Record<string, { bg: string; text: string }> = {
  eligible: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  conditional: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  incomplete: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

export default function GymFightersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState<string>("all");
  const [weightFilter, setWeightFilter] = useState<string>("all");

  const filteredFighters = fighters.filter((fighter) => {
    const matchesSearch =
      fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.combatId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEligibility =
      eligibilityFilter === "all" || fighter.eligibility === eligibilityFilter;
    const matchesWeight = weightFilter === "all" || fighter.weightClass === weightFilter;
    return matchesSearch && matchesEligibility && matchesWeight;
  });

  const weightClasses = [...new Set(fighters.map((f) => f.weightClass))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">My Fighters</h1>
          <p className="text-[#6b7280]">Manage fighters training at your gym</p>
        </div>
        <button className="bg-[#059669] text-white px-4 py-2 rounded-lg hover:bg-[#047857] transition-colors font-medium">
          + Add Fighter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Total Fighters</p>
          <p className="text-2xl font-bold text-[#111827]">{fighters.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Fully Eligible</p>
          <p className="text-2xl font-bold text-[#10b981]">
            {fighters.filter((f) => f.eligibility === "eligible").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Conditional</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {fighters.filter((f) => f.eligibility === "conditional").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Incomplete</p>
          <p className="text-2xl font-bold text-[#ef4444]">
            {fighters.filter((f) => f.eligibility === "incomplete").length}
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
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
          />
        </div>
        <select
          value={weightFilter}
          onChange={(e) => setWeightFilter(e.target.value)}
          className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] bg-white"
        >
          <option value="all">All Weight Classes</option>
          {weightClasses.map((wc) => (
            <option key={wc} value={wc}>
              {wc}
            </option>
          ))}
        </select>
        <select
          value={eligibilityFilter}
          onChange={(e) => setEligibilityFilter(e.target.value)}
          className="px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] bg-white"
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
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Documents</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Next Fight</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filteredFighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#f9fafb]">
                <td className="px-4 py-3">
                  <Link href={`/gym/fighters/${fighter.id}`} className="flex items-center gap-3">
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fighter.documentsComplete === fighter.documentsTotal
                            ? "bg-[#10b981]"
                            : "bg-[#f59e0b]"
                        }`}
                        style={{
                          width: `${(fighter.documentsComplete / fighter.documentsTotal) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#6b7280]">
                      {fighter.documentsComplete}/{fighter.documentsTotal}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#374151]">
                  {fighter.nextFight ? (
                    <div>
                      <p>{fighter.nextFight}</p>
                      <p className="text-xs text-[#6b7280]">{fighter.promotion}</p>
                    </div>
                  ) : (
                    <span className="text-[#9ca3af]">None scheduled</span>
                  )}
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

      {filteredFighters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6b7280]">No fighters found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
