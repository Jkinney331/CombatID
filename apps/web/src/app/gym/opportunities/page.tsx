"use client";

import Link from "next/link";
import { useState } from "react";

const fightOpportunities = [
  {
    id: 1,
    promotion: "Elite Fight League",
    event: "EFL Fight Night 48",
    date: "Mar 22, 2024",
    location: "Las Vegas, NV",
    weightClasses: ["Lightweight", "Welterweight", "Middleweight"],
    status: "open",
    deadline: "Feb 28, 2024",
    purse: "$15,000 - $50,000",
  },
  {
    id: 2,
    promotion: "Bellator",
    event: "Bellator 310",
    date: "Apr 5, 2024",
    location: "Los Angeles, CA",
    weightClasses: ["Featherweight", "Bantamweight"],
    status: "open",
    deadline: "Mar 10, 2024",
    purse: "$20,000 - $75,000",
  },
  {
    id: 3,
    promotion: "ONE Championship",
    event: "ONE Fight Night 20",
    date: "Apr 20, 2024",
    location: "Singapore",
    weightClasses: ["Flyweight", "Strawweight"],
    status: "open",
    deadline: "Mar 25, 2024",
    purse: "$25,000 - $100,000",
  },
  {
    id: 4,
    promotion: "PFL",
    event: "PFL Regular Season",
    date: "May 10, 2024",
    location: "Atlanta, GA",
    weightClasses: ["Lightweight", "Heavyweight"],
    status: "open",
    deadline: "Apr 15, 2024",
    purse: "$10,000 + playoff potential",
  },
];

const pendingOffers = [
  {
    id: 1,
    fighter: "Marcus Rivera",
    promotion: "Elite Fight League",
    event: "EFL Fight Night 48",
    opponent: "Kevin Park",
    purse: "$50,000 + $50,000 win bonus",
    receivedAt: "Jan 20, 2024",
    expiresAt: "Jan 27, 2024",
    status: "pending",
  },
  {
    id: 2,
    fighter: "David Lee",
    promotion: "Bellator",
    event: "Bellator 310",
    opponent: "TBD",
    purse: "$25,000 + $25,000 win bonus",
    receivedAt: "Jan 18, 2024",
    expiresAt: "Jan 25, 2024",
    status: "pending",
  },
];

const acceptedOffers = [
  {
    id: 1,
    fighter: "Marcus Rivera",
    promotion: "Elite Fight League",
    event: "EFL Fight Night 47",
    opponent: "Jake Thompson",
    purse: "$50,000 + $50,000 win bonus",
    acceptedAt: "Jan 10, 2024",
  },
  {
    id: 2,
    fighter: "Sarah Chen",
    promotion: "Elite Fight League",
    event: "EFL Fight Night 47",
    opponent: "Ana Rodriguez",
    purse: "$30,000 + $30,000 win bonus",
    acceptedAt: "Jan 8, 2024",
  },
];

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "pending" | "accepted">("browse");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof fightOpportunities[0] | null>(null);

  const handleApply = (opp: typeof fightOpportunities[0]) => {
    setSelectedOpportunity(opp);
    setShowApplyModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Fight Opportunities</h1>
        <p className="text-[#6b7280]">Browse and manage fight offers for your fighters</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Open Opportunities</p>
          <p className="text-2xl font-bold text-[#111827]">{fightOpportunities.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Pending Offers</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{pendingOffers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Accepted This Month</p>
          <p className="text-2xl font-bold text-[#10b981]">{acceptedOffers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Eligible Fighters</p>
          <p className="text-2xl font-bold text-[#111827]">15</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "browse", label: "Browse Opportunities" },
            { id: "pending", label: `Pending Offers (${pendingOffers.length})` },
            { id: "accepted", label: "Accepted Offers" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Browse Tab */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          {fightOpportunities.map((opp) => (
            <div key={opp.id} className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[#111827]">{opp.promotion}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                      {opp.status}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-[#111827] mt-1">{opp.event}</p>
                  <p className="text-sm text-[#6b7280]">{opp.date} • {opp.location}</p>
                </div>
                <button
                  onClick={() => handleApply(opp)}
                  className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium"
                >
                  Submit Fighter
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Weight Classes</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {opp.weightClasses.map((wc) => (
                      <span key={wc} className="px-2 py-0.5 bg-white border border-[#e5e7eb] rounded text-xs">
                        {wc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Purse Range</p>
                  <p className="font-medium text-[#111827]">{opp.purse}</p>
                </div>
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Application Deadline</p>
                  <p className="font-medium text-[#111827]">{opp.deadline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingOffers.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 text-center">
              <p className="text-[#6b7280]">No pending offers</p>
            </div>
          ) : (
            pendingOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl border border-[#f59e0b] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-[#111827]">{offer.fighter}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#fef3c7] text-[#92400e]">
                        Pending Response
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7280] mt-1">
                      {offer.promotion} - {offer.event}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#ef4444]">Expires: {offer.expiresAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#f9fafb] rounded-lg">
                    <p className="text-xs text-[#6b7280]">Opponent</p>
                    <p className="font-medium text-[#111827]">{offer.opponent}</p>
                  </div>
                  <div className="p-3 bg-[#f9fafb] rounded-lg">
                    <p className="text-xs text-[#6b7280]">Purse</p>
                    <p className="font-medium text-[#111827]">{offer.purse}</p>
                  </div>
                  <div className="p-3 bg-[#f9fafb] rounded-lg">
                    <p className="text-xs text-[#6b7280]">Received</p>
                    <p className="font-medium text-[#111827]">{offer.receivedAt}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
                    Accept Offer
                  </button>
                  <button className="flex-1 px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
                    Negotiate
                  </button>
                  <button className="px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors text-sm font-medium">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Accepted Tab */}
      {activeTab === "accepted" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighter</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Opponent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Purse</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Accepted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {acceptedOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                        <span>👤</span>
                      </div>
                      <span className="font-medium text-[#111827]">{offer.fighter}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#374151]">{offer.event}</p>
                    <p className="text-xs text-[#6b7280]">{offer.promotion}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{offer.opponent}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{offer.purse}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{offer.acceptedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Submit Fighter</h3>
            <div className="p-4 bg-[#f9fafb] rounded-lg mb-4">
              <p className="font-medium text-[#111827]">{selectedOpportunity.event}</p>
              <p className="text-sm text-[#6b7280]">{selectedOpportunity.promotion} • {selectedOpportunity.date}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Select Fighter</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Select fighter...</option>
                  <option>Marcus Rivera (Lightweight)</option>
                  <option>David Lee (Bantamweight)</option>
                  <option>Tommy Williams (Middleweight)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Weight Class</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  {selectedOpportunity.weightClasses.map((wc) => (
                    <option key={wc}>{wc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Message to Promotion</label>
                <textarea
                  placeholder="Any additional information about the fighter..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
