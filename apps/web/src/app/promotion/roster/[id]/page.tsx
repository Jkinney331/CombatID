"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

const fighterData = {
  id: "f1",
  name: "Marcus Rivera",
  combatId: "CID-MR-2024",
  record: "15-2",
  weightClass: "Lightweight",
  disciplines: ["MMA"],
  eligibility: "eligible",
  contractedUntil: "2025-12-31",
  age: 28,
  height: "5'10\"",
  reach: "72\"",
  gym: "American Top Team",
  location: "Miami, FL",
  bio: "Former collegiate wrestler turned MMA fighter with a devastating ground game and improving striking.",
  profileImage: null,
  stats: {
    wins: 15,
    losses: 2,
    knockouts: 8,
    submissions: 5,
    decisions: 2,
  },
};

const fightHistory = [
  { id: 1, opponent: "Jake Thompson", result: "W", method: "TKO", round: 2, event: "EFL Fight Night 46", date: "2024-01-20" },
  { id: 2, opponent: "Tony Garcia", result: "W", method: "Submission", round: 3, event: "EFL Championship Series", date: "2023-11-15" },
  { id: 3, opponent: "Chris Williams", result: "W", method: "Decision", round: 3, event: "EFL Fight Night 44", date: "2023-09-08" },
  { id: 4, opponent: "Ryan Martinez", result: "L", method: "KO", round: 1, event: "EFL Fight Night 42", date: "2023-06-22" },
  { id: 5, opponent: "Sam Lee", result: "W", method: "Submission", round: 2, event: "EFL Contender Series 5", date: "2023-04-15" },
];

const documents = [
  { id: 1, type: "Blood Test", status: "verified", expires: "2024-06-15", uploadedAt: "2024-01-10" },
  { id: 2, type: "Physical Examination", status: "verified", expires: "2024-08-20", uploadedAt: "2024-01-08" },
  { id: 3, type: "Eye Examination", status: "verified", expires: "2024-09-10", uploadedAt: "2024-01-05" },
  { id: 4, type: "MRI/CT Scan", status: "verified", expires: "2024-12-01", uploadedAt: "2023-12-15" },
  { id: 5, type: "Fight License (Nevada)", status: "verified", expires: "2024-12-31", uploadedAt: "2024-01-02" },
];

export default function RosterFighterDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "documents" | "contract">("overview");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/roster" className="text-[#6b7280] hover:text-[#111827]">
          My Roster
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
                <h1 className="text-2xl font-bold text-[#111827]">{fighterData.name}</h1>
                <p className="text-[#6b7280]">{fighterData.combatId}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#dcfce7] text-[#166534]">
                    {fighterData.eligibility}
                  </span>
                  <span className="text-sm text-[#6b7280]">{fighterData.weightClass}</span>
                  <span className="text-sm text-[#6b7280]">{fighterData.gym}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
                  Message
                </button>
                <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
                  Book for Event
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6">
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
            { id: "documents", label: "Documents" },
            { id: "contract", label: "Contract" },
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
                <span className="text-[#6b7280]">Gym</span>
                <span className="font-medium">{fighterData.gym}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Location</span>
                <span className="font-medium">{fighterData.location}</span>
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
            <div className="space-y-3">
              {documents.slice(0, 4).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>{doc.type}</span>
                  </div>
                  <span className="text-[#6b7280]">Exp: {doc.expires}</span>
                </div>
              ))}
            </div>
            <Link
              href="#"
              onClick={() => setActiveTab("documents")}
              className="text-[#7C3AED] hover:underline text-sm mt-4 inline-block"
            >
              View all documents
            </Link>
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

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="font-semibold text-[#111827]">Medical & Compliance Documents</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Document</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Expires</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f3f4f6] rounded flex items-center justify-center">
                        <span>📄</span>
                      </div>
                      <span className="font-medium text-[#111827]">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{doc.expires}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{doc.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contract Tab */}
      {activeTab === "contract" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Contract Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Contract Status</span>
                <span className="font-medium text-[#10b981]">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Contract End Date</span>
                <span className="font-medium">{fighterData.contractedUntil}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Fights Remaining</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Fight Exclusivity</span>
                <span className="font-medium">Yes</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Base Purse</span>
                <span className="font-medium">$50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Win Bonus</span>
                <span className="font-medium">$50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">PPV Points</span>
                <span className="font-medium">Yes (after 200k buys)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Sponsorship Rights</span>
                <span className="font-medium">Shared (70/30)</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex gap-3">
            <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
              View Full Contract
            </button>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
              Extend Contract
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
