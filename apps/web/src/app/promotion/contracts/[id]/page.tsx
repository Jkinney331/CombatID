"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";


const contracts: Record<string, {
  id: string;
  fighter: { name: string; combatId: string };
  type: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  fightsRemaining: number;
  totalFights: number;
  terms: {
    purseRange: string;
    exclusivity: string;
    termLength: string;
    weightClass: string;
  };
  history: Array<{
    id: number;
    event: string;
    date: string;
    opponent: string;
    result: string;
  }>;
}> = {
  c1: {
    id: "c1",
    fighter: { name: "Marcus Rivera", combatId: "CID-MR-2024" },
    type: "Multi-fight",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    fightsRemaining: 4,
    totalFights: 6,
    terms: {
      purseRange: "$15,000 - $50,000",
      exclusivity: "Exclusive",
      termLength: "24 months",
      weightClass: "Lightweight (155 lbs)",
    },
    history: [
      { id: 1, event: "EFL Fight Night 45", date: "2024-09-15", opponent: "Alex Thompson", result: "Win (KO)" },
      { id: 2, event: "EFL Fight Night 42", date: "2024-06-22", opponent: "Carlos Martinez", result: "Win (Decision)" },
    ],
  },
  c2: {
    id: "c2",
    fighter: { name: "Sarah Chen", combatId: "CID-SC-2024" },
    type: "Multi-fight",
    status: "active",
    startDate: "2023-07-01",
    endDate: "2025-06-30",
    fightsRemaining: 2,
    totalFights: 4,
    terms: {
      purseRange: "$10,000 - $30,000",
      exclusivity: "Exclusive",
      termLength: "24 months",
      weightClass: "Strawweight (115 lbs)",
    },
    history: [
      { id: 1, event: "EFL Fight Night 44", date: "2024-08-10", opponent: "Maria Lopez", result: "Win (Submission)" },
      { id: 2, event: "EFL Fight Night 40", date: "2024-04-15", opponent: "Kim Park", result: "Win (Decision)" },
    ],
  },
  c3: {
    id: "c3",
    fighter: { name: "Alex Martinez", combatId: "CID-AM-2024" },
    type: "Single fight",
    status: "pending",
    startDate: null,
    endDate: null,
    fightsRemaining: 1,
    totalFights: 1,
    terms: {
      purseRange: "$8,000",
      exclusivity: "Non-exclusive",
      termLength: "Single bout",
      weightClass: "Featherweight (145 lbs)",
    },
    history: [],
  },
  c4: {
    id: "c4",
    fighter: { name: "Mike Johnson", combatId: "CID-MJ-2024" },
    type: "Multi-fight",
    status: "expiring",
    startDate: "2023-01-01",
    endDate: "2024-03-31",
    fightsRemaining: 1,
    totalFights: 4,
    terms: {
      purseRange: "$12,000 - $35,000",
      exclusivity: "Exclusive",
      termLength: "15 months",
      weightClass: "Welterweight (170 lbs)",
    },
    history: [
      { id: 1, event: "EFL Fight Night 38", date: "2023-12-08", opponent: "David Lee", result: "Win (Decision)" },
      { id: 2, event: "EFL Fight Night 35", date: "2023-09-20", opponent: "Ryan Brooks", result: "Loss (KO)" },
      { id: 3, event: "EFL Fight Night 32", date: "2023-06-15", opponent: "Tony Williams", result: "Win (Submission)" },
    ],
  },
  c5: {
    id: "c5",
    fighter: { name: "Jessica Williams", combatId: "CID-JW-2024" },
    type: "Multi-fight",
    status: "pending",
    startDate: null,
    endDate: null,
    fightsRemaining: 3,
    totalFights: 3,
    terms: {
      purseRange: "$10,000 - $25,000",
      exclusivity: "Exclusive",
      termLength: "18 months",
      weightClass: "Flyweight (125 lbs)",
    },
    history: [],
  },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  expiring: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params.id as string;
  const contract = contracts[contractId];
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  if (!contract) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/promotion/contracts" className="text-[#6b7280] hover:text-[#111827]">
            Contracts
          </Link>
          <span className="text-[#6b7280]">/</span>
          <span className="text-[#111827]">Not Found</span>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-12 text-center">
          <p className="text-[#6b7280]">Contract not found</p>
          <Link href="/promotion/contracts" className="text-[#7C3AED] hover:underline mt-2 inline-block">
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/contracts" className="text-[#6b7280] hover:text-[#111827]">
          Contracts
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827]">{contract.fighter.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{contract.fighter.name}</h1>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status].bg} ${statusColors[contract.status].text}`}
              >
                {contract.status}
              </span>
            </div>
            <p className="text-[#6b7280]">{contract.fighter.combatId}</p>
            <p className="text-sm text-[#7C3AED] font-medium mt-1">{contract.type} Contract</p>
          </div>
        </div>
        <div className="flex gap-2">
          {contract.status === "expiring" && (
            <button
              onClick={() => setShowRenewModal(true)}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
            >
              Renew Contract
            </button>
          )}
          {contract.status === "pending" && (
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium">
              Send Reminder
            </button>
          )}
          <button
            onClick={() => setShowTerminateModal(true)}
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors font-medium text-[#374151]"
          >
            More Options
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Contract Details */}
        <div className="col-span-2 space-y-6">
          {/* Terms */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Contract Terms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#f9fafb] rounded-lg">
                <p className="text-sm text-[#6b7280]">Purse Range</p>
                <p className="font-semibold text-[#111827]">{contract.terms.purseRange}</p>
              </div>
              <div className="p-4 bg-[#f9fafb] rounded-lg">
                <p className="text-sm text-[#6b7280]">Exclusivity</p>
                <p className="font-semibold text-[#111827]">{contract.terms.exclusivity}</p>
              </div>
              <div className="p-4 bg-[#f9fafb] rounded-lg">
                <p className="text-sm text-[#6b7280]">Term Length</p>
                <p className="font-semibold text-[#111827]">{contract.terms.termLength}</p>
              </div>
              <div className="p-4 bg-[#f9fafb] rounded-lg">
                <p className="text-sm text-[#6b7280]">Weight Class</p>
                <p className="font-semibold text-[#111827]">{contract.terms.weightClass}</p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Contract Duration</h3>
            {contract.startDate ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#6b7280]">Start Date</p>
                    <p className="font-medium text-[#111827]">{contract.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#6b7280]">End Date</p>
                    <p className="font-medium text-[#111827]">{contract.endDate}</p>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C3AED] rounded-full"
                    style={{
                      width: `${((contract.totalFights - contract.fightsRemaining) / contract.totalFights) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-[#6b7280] text-center">
                  {contract.totalFights - contract.fightsRemaining} of {contract.totalFights} fights completed
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[#f59e0b] font-medium">Awaiting Signature</p>
                <p className="text-sm text-[#6b7280] mt-1">Contract has been sent and is pending fighter signature</p>
              </div>
            )}
          </div>

          {/* Fight History */}
          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <div className="p-4 border-b border-[#e5e7eb]">
              <h3 className="font-semibold text-[#111827]">Fight History Under Contract</h3>
            </div>
            {contract.history.length > 0 ? (
              <div className="divide-y divide-[#e5e7eb]">
                {contract.history.map((fight) => (
                  <div key={fight.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#f3f4f6] rounded-lg flex items-center justify-center">
                        <span>🥊</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#111827]">vs {fight.opponent}</p>
                        <p className="text-sm text-[#6b7280]">{fight.event}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          fight.result.startsWith("Win") ? "text-[#10b981]" : "text-[#ef4444]"
                        }`}
                      >
                        {fight.result}
                      </p>
                      <p className="text-sm text-[#6b7280]">{fight.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#6b7280]">
                No fights completed under this contract yet
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Contract Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Fights Remaining</span>
                <span className="font-semibold text-[#111827]">{contract.fightsRemaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Total Fights</span>
                <span className="font-semibold text-[#111827]">{contract.totalFights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Contract Type</span>
                <span className="font-semibold text-[#111827]">{contract.type}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-left text-sm">
                View Contract PDF
              </button>
              <button className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-left text-sm">
                Amendment History
              </button>
              <Link
                href={`/promotion/roster/${contractId}`}
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm block"
              >
                View Fighter Profile
              </Link>
              <button
                onClick={() => setShowTerminateModal(true)}
                className="w-full px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors text-left text-sm"
              >
                Terminate Contract
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Renew Contract</h3>
            <p className="text-[#6b7280] mb-4">
              Send a renewal offer to {contract.fighter.name}. They will be notified and can review the new terms.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">New Term Length</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>12 months</option>
                  <option>18 months</option>
                  <option>24 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Number of Fights</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>3 fights</option>
                  <option>4 fights</option>
                  <option>6 fights</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRenewModal(false)}
                className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRenewModal(false)}
                className="flex-1 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminate Modal */}
      {showTerminateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Terminate Contract</h3>
            <p className="text-[#6b7280] mb-4">
              Are you sure you want to terminate the contract with {contract.fighter.name}? This action cannot be undone.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Reason for Termination</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Mutual agreement</option>
                  <option>Breach of contract</option>
                  <option>Fighter request</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTerminateModal(false)}
                className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTerminateModal(false)}
                className="flex-1 px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors font-medium"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
