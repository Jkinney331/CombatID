"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";


const fighterData = {
  id: "f10",
  name: "Alex Martinez",
  combatId: "CID-AM-2024",
  record: "12-4",
  weightClass: "Featherweight",
  disciplines: ["MMA"],
  eligibility: "eligible",
  age: 27,
  height: "5'8\"",
  reach: "70\"",
  gym: "Team Alpha Male",
  location: "Sacramento, CA",
  bio: "Dynamic striker with excellent wrestling defense. Known for exciting fights and knockout power.",
  profileImage: null,
  stats: {
    wins: 12,
    losses: 4,
    knockouts: 7,
    submissions: 3,
    decisions: 2,
  },
  availability: "available",
  lastFight: "2024-01-10",
};

const fightHistory = [
  { id: 1, opponent: "Jason Kim", result: "W", method: "TKO", round: 2, event: "Bellator 305", date: "2024-01-10" },
  { id: 2, opponent: "Pedro Gonzalez", result: "W", method: "Decision", round: 3, event: "Bellator 298", date: "2023-10-20" },
  { id: 3, opponent: "Mike Davis", result: "L", method: "Submission", round: 2, event: "Bellator 290", date: "2023-07-15" },
  { id: 4, opponent: "Chris Lee", result: "W", method: "KO", round: 1, event: "Bellator 285", date: "2023-04-22" },
  { id: 5, opponent: "James Brown", result: "W", method: "TKO", round: 3, event: "Bellator 278", date: "2023-01-14" },
];

export default function FighterPublicProfilePage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "highlights">("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/fighters" className="text-[#6b7280] hover:text-[#111827]">
          Find Fighters
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827] font-medium">{fighterData.name}</span>
      </div>

      {/* Fighter Header */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-[#f3f4f6] rounded-xl flex items-center justify-center">
            <span className="text-5xl">👤</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#111827]">{fighterData.name}</h1>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#dcfce7] text-[#166534]">
                    {fighterData.availability}
                  </span>
                </div>
                <p className="text-[#6b7280]">{fighterData.combatId}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#6b7280]">
                  <span>{fighterData.weightClass}</span>
                  <span>•</span>
                  <span>{fighterData.gym}</span>
                  <span>•</span>
                  <span>{fighterData.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
                  Contact Manager
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium"
                >
                  Invite to Roster
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 mt-6">
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.record}</p>
                <p className="text-xs text-[#6b7280]">Record</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.stats.knockouts}</p>
                <p className="text-xs text-[#6b7280]">KO Wins</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.stats.submissions}</p>
                <p className="text-xs text-[#6b7280]">Sub Wins</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.age}</p>
                <p className="text-xs text-[#6b7280]">Age</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.height}</p>
                <p className="text-xs text-[#6b7280]">Height</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.reach}</p>
                <p className="text-xs text-[#6b7280]">Reach</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "history", label: "Fight History" },
            { id: "highlights", label: "Highlights" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Fighter Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Full Name</span>
                <span className="font-medium">{fighterData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Combat ID</span>
                <span className="font-medium">{fighterData.combatId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Weight Class</span>
                <span className="font-medium">{fighterData.weightClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Age</span>
                <span className="font-medium">{fighterData.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Height</span>
                <span className="font-medium">{fighterData.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Reach</span>
                <span className="font-medium">{fighterData.reach}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Last Fight</span>
                <span className="font-medium">{fighterData.lastFight}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Eligibility Status</h3>
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#dcfce7] text-[#166534]">
                Eligible to Compete
              </span>
            </div>
            <p className="text-sm text-[#6b7280] mb-4">
              This fighter has all required medical documentation current and valid.
            </p>
            <div className="space-y-2">
              {["Blood Tests", "Physical Exam", "Eye Exam", "MRI/CT Scan", "License"].map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-sm">
                  <span className="text-[#10b981]">✓</span>
                  <span className="text-[#374151]">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Bio</h3>
            <p className="text-[#374151]">{fighterData.bio}</p>
          </div>
        </div>
      )}

      {/* Fight History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="font-semibold text-[#111827]">Fight History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Result</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Opponent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Method</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Round</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {fightHistory.map((fight) => (
                <tr key={fight.id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        fight.result === "W"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                    >
                      {fight.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{fight.opponent}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{fight.method}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">Round {fight.round}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{fight.event}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{fight.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Highlights Tab */}
      {activeTab === "highlights" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Fight Highlights</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-[#f3f4f6] rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <span className="text-4xl">🎬</span>
                  <p className="text-sm text-[#6b7280] mt-2">Highlight {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Invite to Roster</h3>
            <div className="flex items-center gap-4 mb-4 p-4 bg-[#f9fafb] rounded-lg">
              <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <p className="font-medium text-[#111827]">{fighterData.name}</p>
                <p className="text-sm text-[#6b7280]">{fighterData.weightClass} • {fighterData.record}</p>
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
                <label className="block text-sm font-medium text-[#374151] mb-1">Message</label>
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
