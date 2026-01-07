"use client";

import { useState } from "react";
import { Card, CardHeader, Badge, Button, PillTabs } from "@/components/ui";

// Mock bouts data
const mockBouts = [
  {
    id: "BOUT-001",
    status: "upcoming",
    event: {
      name: "UFC 310",
      date: "2026-02-08",
      location: "T-Mobile Arena, Las Vegas, NV",
      promotion: "UFC",
    },
    opponent: {
      name: "Leon Edwards",
      record: "22-3-1",
      country: "GBR",
      ranking: "Champion",
    },
    details: {
      weightClass: "Welterweight",
      weight: "170 lbs",
      rounds: 5,
      type: "Championship",
      position: "Main Event",
    },
    contract: {
      id: "CTR-2026-001",
      purse: "$500,000",
      winBonus: "$500,000",
      ppvPoints: "Yes",
      signed: true,
      signedAt: "2025-12-15",
    },
    medicals: {
      preFlightPhysical: "scheduled",
      physicalDate: "2026-02-07",
      weighIn: "pending",
    },
  },
  {
    id: "BOUT-002",
    status: "pending_signature",
    event: {
      name: "UFC Fight Night 252",
      date: "2026-04-20",
      location: "UFC APEX, Las Vegas, NV",
      promotion: "UFC",
    },
    opponent: {
      name: "Kamaru Usman",
      record: "20-4",
      country: "NGA",
      ranking: "#1 Contender",
    },
    details: {
      weightClass: "Welterweight",
      weight: "170 lbs",
      rounds: 5,
      type: "Main Event",
      position: "Main Event",
    },
    contract: {
      id: "CTR-2026-002",
      purse: "$350,000",
      winBonus: "$350,000",
      ppvPoints: "No",
      signed: false,
      deadline: "2026-01-20",
    },
    medicals: {
      preFlightPhysical: "not_scheduled",
      weighIn: "not_scheduled",
    },
  },
  {
    id: "BOUT-003",
    status: "completed",
    event: {
      name: "UFC 305",
      date: "2025-11-15",
      location: "Madison Square Garden, New York, NY",
      promotion: "UFC",
    },
    opponent: {
      name: "Belal Muhammad",
      record: "24-4",
      country: "USA",
      ranking: "#3",
    },
    details: {
      weightClass: "Welterweight",
      weight: "170 lbs",
      rounds: 3,
      type: "Co-Main Event",
      position: "Co-Main Event",
    },
    result: {
      outcome: "win",
      method: "KO/TKO",
      round: 2,
      time: "3:45",
      bonus: "Performance of the Night",
    },
    contract: {
      id: "CTR-2025-015",
      purse: "$250,000",
      winBonus: "$250,000",
      ppvPoints: "No",
      signed: true,
      signedAt: "2025-09-20",
    },
  },
  {
    id: "BOUT-004",
    status: "completed",
    event: {
      name: "UFC 299",
      date: "2025-07-10",
      location: "American Airlines Arena, Miami, FL",
      promotion: "UFC",
    },
    opponent: {
      name: "Gilbert Burns",
      record: "22-6",
      country: "BRA",
      ranking: "#5",
    },
    details: {
      weightClass: "Welterweight",
      weight: "170 lbs",
      rounds: 3,
      type: "Main Card",
      position: "Main Card",
    },
    result: {
      outcome: "win",
      method: "Decision",
      round: 3,
      time: "5:00",
      bonus: null,
    },
    contract: {
      id: "CTR-2025-008",
      purse: "$150,000",
      winBonus: "$150,000",
      ppvPoints: "No",
      signed: true,
      signedAt: "2025-05-15",
    },
  },
];

type BoutStatus = "upcoming" | "pending_signature" | "completed" | "cancelled";

const statusConfig: Record<BoutStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  upcoming: { label: "Upcoming", variant: "info" },
  pending_signature: { label: "Pending Signature", variant: "warning" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "danger" },
};

const statusTabs = [
  { value: "all", label: "All Bouts", count: mockBouts.length },
  { value: "upcoming", label: "Upcoming", count: mockBouts.filter(b => b.status === "upcoming").length },
  { value: "pending_signature", label: "Pending Signature", count: mockBouts.filter(b => b.status === "pending_signature").length },
  { value: "completed", label: "History", count: mockBouts.filter(b => b.status === "completed").length },
];

export default function BoutsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedBout, setSelectedBout] = useState<typeof mockBouts[0] | null>(null);

  const filteredBouts = mockBouts.filter(
    (bout) => statusFilter === "all" || bout.status === statusFilter
  );

  const getDaysUntilEvent = (date: string) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSignContract = (bout: typeof mockBouts[0]) => {
    setSelectedBout(bout);
    setShowContractModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bouts & Contracts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your upcoming bouts and sign contracts
          </p>
        </div>
        {mockBouts.filter(b => b.status === "pending_signature").length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
            <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-[#f59e0b] font-medium">
              {mockBouts.filter(b => b.status === "pending_signature").length} contract(s) awaiting signature
            </span>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <PillTabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Upcoming Bout Card (Featured) */}
      {statusFilter === "all" || statusFilter === "upcoming" ? (
        <>
          {mockBouts.filter(b => b.status === "upcoming").map((bout) => (
            <Card key={bout.id} className="border-[#ef4444]/30 bg-gradient-to-r from-[#ef4444]/5 to-transparent">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="info">Next Fight</Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-white font-medium">{getDaysUntilEvent(bout.event.date)} days away</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Event Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{bout.event.name}</h2>
                    <p className="text-gray-400 mb-4">
                      {new Date(bout.event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-500 text-sm">{bout.event.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="default">{bout.details.weightClass}</Badge>
                      <Badge variant="default">{bout.details.rounds} Rounds</Badge>
                      <Badge variant="success">{bout.details.type}</Badge>
                    </div>
                  </div>

                  {/* Matchup */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">YOU</p>
                      <div className="w-20 h-20 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-[#ef4444]">MW</span>
                      </div>
                      <p className="text-white font-bold">Marcus Williams</p>
                      <p className="text-gray-400 text-sm">12-2-0</p>
                    </div>
                    <div className="mx-6">
                      <span className="text-4xl font-bold text-[#ef4444]">VS</span>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm mb-2">{bout.opponent.ranking}</p>
                      <div className="w-20 h-20 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-gray-400">
                          {bout.opponent.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <p className="text-white font-bold">{bout.opponent.name}</p>
                      <p className="text-gray-400 text-sm">{bout.opponent.record}</p>
                    </div>
                  </div>

                  {/* Pre-Fight Checklist */}
                  <div className="bg-[#151515] rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Pre-Fight Checklist</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Contract Signed</span>
                        {bout.contract.signed ? (
                          <span className="text-[#22c55e] flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete
                          </span>
                        ) : (
                          <span className="text-[#f59e0b]">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Pre-Fight Physical</span>
                        {bout.medicals?.preFlightPhysical === "scheduled" ? (
                          <span className="text-[#3b82f6]">
                            {new Date(bout.medicals.physicalDate!).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-500">Not Scheduled</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Weigh-In</span>
                        <span className="text-gray-500">
                          {new Date(bout.event.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </>
      ) : null}

      {/* Pending Signature Contracts */}
      {(statusFilter === "all" || statusFilter === "pending_signature") &&
        mockBouts.filter(b => b.status === "pending_signature").length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Contracts Awaiting Signature</h2>
          {mockBouts.filter(b => b.status === "pending_signature").map((bout) => (
            <Card key={bout.id} className="border-[#f59e0b]/30">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{bout.event.name}</p>
                      <p className="text-gray-400 text-sm">
                        vs {bout.opponent.name} • {new Date(bout.event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Contract Value</p>
                      <p className="text-[#22c55e] font-bold">{bout.contract.purse}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Deadline</p>
                      <p className="text-[#f59e0b] font-medium">
                        {bout.contract.deadline && new Date(bout.contract.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      className="bg-[#ef4444] hover:bg-[#dc2626]"
                      onClick={() => handleSignContract(bout)}
                    >
                      Review & Sign
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Fight History */}
      {(statusFilter === "all" || statusFilter === "completed") && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Fight History</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#151515]">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Opponent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Purse</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {mockBouts.filter(b => b.status === "completed").map((bout) => (
                    <tr key={bout.id} className="hover:bg-[#252525] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{bout.event.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(bout.event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#252525] rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">
                              {bout.opponent.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-white">{bout.opponent.name}</p>
                            <p className="text-sm text-gray-500">{bout.opponent.record}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={bout.result?.outcome === "win" ? "success" : bout.result?.outcome === "loss" ? "danger" : "default"}
                        >
                          {bout.result?.outcome?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white">{bout.result?.method}</p>
                          <p className="text-sm text-gray-500">
                            R{bout.result?.round} {bout.result?.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#22c55e] font-medium">{bout.contract.purse}</p>
                        {bout.result?.bonus && (
                          <p className="text-xs text-[#f59e0b]">{bout.result.bonus}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredBouts.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No bouts found</h3>
            <p className="text-gray-500">
              Check the Opportunities page for available fights
            </p>
          </div>
        </Card>
      )}

      {/* Contract Signing Modal */}
      {showContractModal && selectedBout && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContractModal(false)}
        >
          <div
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-[#1a1a1a]">
              <div>
                <h2 className="text-xl font-bold text-white">Bout Agreement</h2>
                <p className="text-gray-500 text-sm">{selectedBout.contract.id}</p>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contract Content */}
            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="p-4 bg-[#151515] rounded-lg">
                <h3 className="font-semibold text-white mb-4">Event Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Event</p>
                    <p className="text-white">{selectedBout.event.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-white">{new Date(selectedBout.event.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-white">{selectedBout.event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Promotion</p>
                    <p className="text-white">{selectedBout.event.promotion}</p>
                  </div>
                </div>
              </div>

              {/* Bout Details */}
              <div className="p-4 bg-[#151515] rounded-lg">
                <h3 className="font-semibold text-white mb-4">Bout Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Opponent</p>
                    <p className="text-white">{selectedBout.opponent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight Class</p>
                    <p className="text-white">{selectedBout.details.weightClass}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contracted Weight</p>
                    <p className="text-white">{selectedBout.details.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rounds</p>
                    <p className="text-white">{selectedBout.details.rounds}</p>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className="p-4 bg-gradient-to-r from-[#22c55e]/10 to-transparent rounded-lg border border-[#22c55e]/20">
                <h3 className="font-semibold text-white mb-4">Compensation</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Base Purse</p>
                    <p className="text-2xl font-bold text-[#22c55e]">{selectedBout.contract.purse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Win Bonus</p>
                    <p className="text-2xl font-bold text-white">{selectedBout.contract.winBonus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PPV Points</p>
                    <p className="text-2xl font-bold text-white">{selectedBout.contract.ppvPoints}</p>
                  </div>
                </div>
              </div>

              {/* Terms (Simulated) */}
              <div className="p-4 bg-[#151515] rounded-lg max-h-48 overflow-y-auto">
                <h3 className="font-semibold text-white mb-4">Terms & Conditions</h3>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>1. Fighter agrees to compete at the contracted weight of {selectedBout.details.weight}.</p>
                  <p>2. Fighter must pass all pre-fight medical examinations and drug tests administered by the athletic commission.</p>
                  <p>3. Fighter agrees to comply with all rules and regulations of the {selectedBout.event.promotion}.</p>
                  <p>4. Payment will be made within 30 days following the event, less applicable taxes and deductions.</p>
                  <p>5. Win bonus is contingent upon fighter winning the bout by any method (KO/TKO, Submission, or Decision).</p>
                  <p>6. Fighter must maintain valid licensing with the Nevada State Athletic Commission.</p>
                  <p>7. Promotional obligations include pre-fight media, weigh-ins, and post-fight press conference.</p>
                </div>
              </div>

              {/* Signature Section */}
              <div className="p-4 bg-[#151515] rounded-lg border-2 border-dashed border-[#3a3a3a]">
                <h3 className="font-semibold text-white mb-4">Digital Signature</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-[#3a3a3a] bg-[#252525] text-[#ef4444] focus:ring-[#ef4444]" />
                      <span className="text-gray-300">
                        I, Marcus Williams, have read and agree to the terms of this bout agreement.
                      </span>
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-500 mb-2">Draw your signature below:</label>
                  <div className="h-24 bg-[#252525] rounded-lg border border-[#3a3a3a] flex items-center justify-center">
                    <span className="text-gray-500">Click to sign</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#2a2a2a] flex gap-3 sticky bottom-0 bg-[#1a1a1a]">
              <Button variant="outline" className="flex-1" onClick={() => setShowContractModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1 bg-[#22c55e] hover:bg-[#16a34a]">
                Sign Contract
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
