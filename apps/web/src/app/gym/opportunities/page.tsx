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
        <h1 className="text-2xl font-bold text-white">Fight Opportunities</h1>
        <p className="text-gray-500">Browse and manage fight offers for your fighters</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Open Opportunities</p>
          <p className="text-2xl font-bold text-white">{fightOpportunities.length}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Pending Offers</p>
          <p className="text-2xl font-bold text-[#f59e0b]">{pendingOffers.length}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Accepted This Month</p>
          <p className="text-2xl font-bold text-[#22c55e]">{acceptedOffers.length}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-gray-500 text-sm">Eligible Fighters</p>
          <p className="text-2xl font-bold text-white">15</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a]">
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
                  ? "border-[#ea580c] text-[#ea580c]"
                  : "border-transparent text-gray-500 hover:text-white"
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
            <div key={opp.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-white">{opp.promotion}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#22c55e]/20 text-[#22c55e]">
                      {opp.status}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-white mt-1">{opp.event}</p>
                  <p className="text-sm text-gray-500">{opp.date} • {opp.location}</p>
                </div>
                <button
                  onClick={() => handleApply(opp)}
                  className="px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors text-sm font-medium"
                >
                  Submit Fighter
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500">Weight Classes</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {opp.weightClasses.map((wc) => (
                      <span key={wc} className="px-2 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-gray-400">
                        {wc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500">Purse Range</p>
                  <p className="font-medium text-white">{opp.purse}</p>
                </div>
                <div className="p-3 bg-[#252525] rounded-lg">
                  <p className="text-xs text-gray-500">Application Deadline</p>
                  <p className="font-medium text-white">{opp.deadline}</p>
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
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 text-center">
              <p className="text-gray-500">No pending offers</p>
            </div>
          ) : (
            pendingOffers.map((offer) => (
              <div key={offer.id} className="bg-[#1a1a1a] rounded-xl border border-[#f59e0b] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{offer.fighter}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#f59e0b]/20 text-[#f59e0b]">
                        Pending Response
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {offer.promotion} - {offer.event}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#ef4444]">Expires: {offer.expiresAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#252525] rounded-lg">
                    <p className="text-xs text-gray-500">Opponent</p>
                    <p className="font-medium text-white">{offer.opponent}</p>
                  </div>
                  <div className="p-3 bg-[#252525] rounded-lg">
                    <p className="text-xs text-gray-500">Purse</p>
                    <p className="font-medium text-white">{offer.purse}</p>
                  </div>
                  <div className="p-3 bg-[#252525] rounded-lg">
                    <p className="text-xs text-gray-500">Received</p>
                    <p className="font-medium text-white">{offer.receivedAt}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors text-sm font-medium">
                    Accept Offer
                  </button>
                  <button className="flex-1 px-4 py-2 border border-[#2a2a2a] rounded-lg hover:bg-[#252525] transition-colors text-sm font-medium text-gray-400">
                    Negotiate
                  </button>
                  <button className="px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#ef4444]/10 transition-colors text-sm font-medium">
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
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#151515] border-b border-[#2a2a2a]">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Fighter</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Event</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Opponent</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Purse</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Accepted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {acceptedOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-[#252525] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#252525] rounded-full flex items-center justify-center">
                        <span className="text-gray-400">👤</span>
                      </div>
                      <span className="font-medium text-white">{offer.fighter}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-300">{offer.event}</p>
                    <p className="text-xs text-gray-500">{offer.promotion}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{offer.opponent}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{offer.purse}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{offer.acceptedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold text-white mb-4">Submit Fighter</h3>
            <div className="p-4 bg-[#252525] rounded-lg mb-4">
              <p className="font-medium text-white">{selectedOpportunity.event}</p>
              <p className="text-sm text-gray-500">{selectedOpportunity.promotion} • {selectedOpportunity.date}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Select Fighter</label>
                <select className="w-full px-3 py-2 bg-[#252525] border border-[#2a2a2a] rounded-lg text-white">
                  <option>Select fighter...</option>
                  <option>Marcus Rivera (Lightweight)</option>
                  <option>David Lee (Bantamweight)</option>
                  <option>Tommy Williams (Middleweight)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Weight Class</label>
                <select className="w-full px-3 py-2 bg-[#252525] border border-[#2a2a2a] rounded-lg text-white">
                  {selectedOpportunity.weightClasses.map((wc) => (
                    <option key={wc}>{wc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message to Promotion</label>
                <textarea
                  placeholder="Any additional information about the fighter..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#252525] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-[#2a2a2a] rounded-lg hover:bg-[#252525] transition-colors text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410c] transition-colors"
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
