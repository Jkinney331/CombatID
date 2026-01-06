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
  eligible: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]" },
  conditional: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]" },
  incomplete: { bg: "bg-[#ef4444]/20", text: "text-[#ef4444]" },
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
          <h1 className="text-2xl font-bold text-white">My Fighters</h1>
          <p className="text-gray-500">Manage fighters training at your gym</p>
        </div>
        <button className="bg-[#ea580c] text-white px-4 py-2 rounded-lg hover:bg-[#c2410c] transition-colors font-medium">
          + Add Fighter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Total Fighters</p>
          <p className="text-2xl font-bold text-white">{fighters.length}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Fully Eligible</p>
          <p className="text-2xl font-bold text-[#22c55e]">
            {fighters.filter((f) => f.eligibility === "eligible").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Conditional</p>
          <p className="text-2xl font-bold text-[#f59e0b]">
            {fighters.filter((f) => f.eligibility === "conditional").length}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Incomplete</p>
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
            className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
          />
        </div>
        <select
          value={weightFilter}
          onChange={(e) => setWeightFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
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
          className="px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
        >
          <option value="all">All Eligibility</option>
          <option value="eligible">Eligible</option>
          <option value="conditional">Conditional</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Fighter List */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#151515] border-b border-[#2a2a2a]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fighter</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Weight Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Record</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Eligibility</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Documents</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Next Fight</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {filteredFighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#252525] transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/gym/fighters/${fighter.id}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
                      <span className="text-gray-400">👤</span>
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fighter.documentsComplete === fighter.documentsTotal
                            ? "bg-[#22c55e]"
                            : "bg-[#f59e0b]"
                        }`}
                        style={{
                          width: `${(fighter.documentsComplete / fighter.documentsTotal) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {fighter.documentsComplete}/{fighter.documentsTotal}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {fighter.nextFight ? (
                    <div>
                      <p className="text-white">{fighter.nextFight}</p>
                      <p className="text-xs text-gray-500">{fighter.promotion}</p>
                    </div>
                  ) : (
                    <span className="text-gray-600">None scheduled</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/gym/fighters/${fighter.id}`}
                    className="text-[#ea580c] hover:underline text-sm"
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
