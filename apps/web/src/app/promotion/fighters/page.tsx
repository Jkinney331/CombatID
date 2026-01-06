"use client";

import Link from "next/link";
import { useState } from "react";

const allFighters = [
  {
    id: "f10",
    name: "Alex Martinez",
    combatId: "CID-AM-2024",
    record: "12-4",
    weightClass: "Featherweight",
    eligibility: "eligible",
    gym: "Team Alpha Male",
    location: "Sacramento, CA",
    onRoster: false,
  },
  {
    id: "f11",
    name: "Jessica Williams",
    combatId: "CID-JW-2024",
    record: "9-2",
    weightClass: "Flyweight",
    eligibility: "eligible",
    gym: "American Kickboxing Academy",
    location: "San Jose, CA",
    onRoster: false,
  },
  {
    id: "f12",
    name: "Kevin Park",
    combatId: "CID-KP-2024",
    record: "6-1",
    weightClass: "Lightweight",
    eligibility: "eligible",
    gym: "Team Korea MMA",
    location: "Los Angeles, CA",
    onRoster: false,
  },
  {
    id: "f13",
    name: "Maria Silva",
    combatId: "CID-MS-2024",
    record: "11-3",
    weightClass: "Bantamweight",
    eligibility: "conditional",
    gym: "Nova Uniao",
    location: "Rio de Janeiro, Brazil",
    onRoster: false,
  },
  {
    id: "f14",
    name: "Tommy O'Brien",
    combatId: "CID-TO-2024",
    record: "8-2",
    weightClass: "Welterweight",
    eligibility: "eligible",
    gym: "SBG Ireland",
    location: "Dublin, Ireland",
    onRoster: false,
  },
  {
    id: "f15",
    name: "Yuki Tanaka",
    combatId: "CID-YT-2024",
    record: "14-5",
    weightClass: "Bantamweight",
    eligibility: "eligible",
    gym: "Krazy Bee",
    location: "Tokyo, Japan",
    onRoster: false,
  },
  {
    id: "f1",
    name: "Marcus Rivera",
    combatId: "CID-MR-2024",
    record: "15-2",
    weightClass: "Lightweight",
    eligibility: "eligible",
    gym: "American Top Team",
    location: "Miami, FL",
    onRoster: true,
  },
  {
    id: "f2",
    name: "Sarah Chen",
    combatId: "CID-SC-2024",
    record: "8-1",
    weightClass: "Strawweight",
    eligibility: "eligible",
    gym: "Team Oyama",
    location: "Las Vegas, NV",
    onRoster: true,
  },
];

const eligibilityColors: Record<string, { bg: string; text: string }> = {
  eligible: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  conditional: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  incomplete: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

export default function FindFightersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weightFilter, setWeightFilter] = useState<string>("all");
  const [showRoster, setShowRoster] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState<typeof allFighters[0] | null>(null);

  const filteredFighters = allFighters.filter((fighter) => {
    const matchesSearch = fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.combatId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.gym.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWeight = weightFilter === "all" || fighter.weightClass === weightFilter;
    const matchesRoster = showRoster ? true : !fighter.onRoster;
    return matchesSearch && matchesWeight && matchesRoster;
  });

  const weightClasses = [...new Set(allFighters.map((f) => f.weightClass))].sort();

  const handleInvite = (fighter: typeof allFighters[0]) => {
    setSelectedFighter(fighter);
    setShowInviteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Find Fighters</h1>
        <p className="text-[#6b7280]">Search all registered fighters on CombatID</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, CombatID, or gym..."
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
        <label className="flex items-center gap-2 text-sm text-[#374151]">
          <input
            type="checkbox"
            checked={showRoster}
            onChange={(e) => setShowRoster(e.target.checked)}
            className="rounded border-[#e5e7eb]"
          />
          Show my roster
        </label>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-[#e5e7eb]">
        <div className="p-4 border-b border-[#e5e7eb]">
          <p className="text-sm text-[#6b7280]">{filteredFighters.length} fighters found</p>
        </div>
        <div className="divide-y divide-[#e5e7eb]">
          {filteredFighters.map((fighter) => (
            <div
              key={fighter.id}
              className="p-4 flex items-center justify-between hover:bg-[#f9fafb]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/promotion/fighters/${fighter.id}`}
                      className="font-medium text-[#111827] hover:text-[#7C3AED]"
                    >
                      {fighter.name}
                    </Link>
                    {fighter.onRoster && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED]">
                        On Roster
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6b7280]">
                    {fighter.combatId} • {fighter.record} • {fighter.weightClass}
                  </p>
                  <p className="text-xs text-[#6b7280]">{fighter.gym} • {fighter.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${eligibilityColors[fighter.eligibility].bg} ${eligibilityColors[fighter.eligibility].text}`}
                >
                  {fighter.eligibility}
                </span>
                {!fighter.onRoster && (
                  <button
                    onClick={() => handleInvite(fighter)}
                    className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium"
                  >
                    Invite to Roster
                  </button>
                )}
                {fighter.onRoster && (
                  <Link
                    href={`/promotion/roster/${fighter.id}`}
                    className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
          {filteredFighters.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <p className="text-[#6b7280]">No fighters found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && selectedFighter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Invite Fighter to Roster</h3>
            <div className="flex items-center gap-4 mb-4 p-4 bg-[#f9fafb] rounded-lg">
              <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <p className="font-medium text-[#111827]">{selectedFighter.name}</p>
                <p className="text-sm text-[#6b7280]">{selectedFighter.weightClass} • {selectedFighter.record}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Contract Type</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Multi-fight contract</option>
                  <option>Single fight contract</option>
                  <option>Promotional agreement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Message to Fighter</label>
                <textarea
                  placeholder="We'd love to have you fight for Elite Fight League..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
