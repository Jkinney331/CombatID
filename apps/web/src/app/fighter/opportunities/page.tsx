"use client";

import { useState } from "react";
import { Card, CardHeader, Badge, Button, SearchInput, Select, PillTabs } from "@/components/ui";

// Mock opportunities data
const mockOpportunities = [
  {
    id: "OPP-001",
    type: "bout",
    title: "Main Event - Welterweight Championship",
    promotion: "ONE Championship",
    promotionLogo: null,
    event: "ONE 178: Bangkok",
    eventDate: "2026-02-15",
    location: "Impact Arena, Bangkok, Thailand",
    opponent: {
      name: "Kiamrian Abbasov",
      record: "28-6",
      ranking: "#2 Welterweight",
      country: "KGZ",
    },
    purse: "$150,000",
    winBonus: "$150,000",
    weightClass: "Welterweight",
    rounds: 5,
    status: "pending",
    deadline: "2026-01-20",
    notes: "Title fight opportunity. Must make 170lbs.",
    sentAt: "2026-01-03",
  },
  {
    id: "OPP-002",
    type: "bout",
    title: "Co-Main Event",
    promotion: "Bellator MMA",
    promotionLogo: null,
    event: "Bellator 310",
    eventDate: "2026-03-01",
    location: "SAP Center, San Jose, CA",
    opponent: {
      name: "Jason Jackson",
      record: "18-4",
      ranking: "#3 Welterweight",
      country: "JAM",
    },
    purse: "$100,000",
    winBonus: "$100,000",
    weightClass: "Welterweight",
    rounds: 3,
    status: "pending",
    deadline: "2026-01-25",
    notes: "Three round co-main event bout.",
    sentAt: "2026-01-05",
  },
  {
    id: "OPP-003",
    type: "bout",
    title: "Fight Night Main Card",
    promotion: "UFC",
    promotionLogo: null,
    event: "UFC Fight Night 250",
    eventDate: "2026-04-12",
    location: "UFC APEX, Las Vegas, NV",
    opponent: {
      name: "Sean Brady",
      record: "16-1",
      ranking: "#8 Welterweight",
      country: "USA",
    },
    purse: "$85,000",
    winBonus: "$85,000",
    weightClass: "Welterweight",
    rounds: 3,
    status: "viewed",
    deadline: "2026-02-01",
    notes: "Main card bout. Performance bonuses available.",
    sentAt: "2026-01-02",
  },
  {
    id: "OPP-004",
    type: "exhibition",
    title: "Charity Exhibition Match",
    promotion: "Fight for the Cure Foundation",
    promotionLogo: null,
    event: "Champions for Charity",
    eventDate: "2026-02-28",
    location: "Madison Square Garden, New York, NY",
    opponent: null,
    purse: "$25,000",
    winBonus: null,
    weightClass: "Open",
    rounds: 3,
    status: "pending",
    deadline: "2026-01-30",
    notes: "Three round exhibition for charity. No record impact.",
    sentAt: "2026-01-04",
  },
  {
    id: "OPP-005",
    type: "bout",
    title: "PFL Season Opener",
    promotion: "PFL",
    promotionLogo: null,
    event: "PFL 1: 2026 Season",
    eventDate: "2026-04-01",
    location: "Esports Stadium, Arlington, TX",
    opponent: {
      name: "Rory MacDonald",
      record: "23-8-1",
      ranking: "Former Champion",
      country: "CAN",
    },
    purse: "$75,000",
    winBonus: "Tournament Prize",
    weightClass: "Welterweight",
    rounds: 3,
    status: "declined",
    deadline: "2026-01-15",
    notes: "Season format with $1M championship prize.",
    sentAt: "2025-12-28",
  },
];

type OpportunityStatus = "pending" | "viewed" | "accepted" | "declined" | "expired";

const statusConfig: Record<OpportunityStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  pending: { label: "New", variant: "warning" },
  viewed: { label: "Viewed", variant: "info" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "danger" },
  expired: { label: "Expired", variant: "default" },
};

const statusTabs = [
  { value: "all", label: "All Offers", count: mockOpportunities.length },
  { value: "pending", label: "New", count: mockOpportunities.filter(o => o.status === "pending").length },
  { value: "viewed", label: "Reviewing", count: mockOpportunities.filter(o => o.status === "viewed").length },
  { value: "accepted", label: "Accepted", count: mockOpportunities.filter(o => o.status === "accepted").length },
];

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockOpportunities[0] | null>(null);

  const filteredOpportunities = mockOpportunities
    .filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.promotion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.event.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || opp.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === "purse") {
        const purseA = parseInt(a.purse.replace(/[^0-9]/g, ""));
        const purseB = parseInt(b.purse.replace(/[^0-9]/g, ""));
        return purseB - purseA;
      } else if (sortBy === "date") {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
      return 0;
    });

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fight Opportunities</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and respond to bout offers from promotions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
            <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#f59e0b] font-medium text-sm">
              {mockOpportunities.filter(o => o.status === "pending").length} pending responses
            </span>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <PillTabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "deadline", label: "Sort by Deadline" },
              { value: "purse", label: "Sort by Purse" },
              { value: "date", label: "Sort by Event Date" },
            ]}
            className="sm:w-48"
          />
        </div>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOpportunities.map((opportunity) => {
          const status = statusConfig[opportunity.status as OpportunityStatus];
          const daysUntilDeadline = getDaysUntilDeadline(opportunity.deadline);
          const isUrgent = daysUntilDeadline <= 7 && opportunity.status === "pending";

          return (
            <Card
              key={opportunity.id}
              className={`cursor-pointer transition-all hover:border-[#ef4444]/50 ${
                isUrgent ? "border-[#f59e0b]/50" : ""
              }`}
              onClick={() => setSelectedOpportunity(opportunity)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {opportunity.promotion.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{opportunity.promotion}</p>
                      <p className="text-sm text-gray-500">{opportunity.event}</p>
                    </div>
                  </div>
                  <Badge variant={status.variant} dot>
                    {status.label}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">{opportunity.title}</h3>

                {/* Opponent Info */}
                {opportunity.opponent && (
                  <div className="mb-3 p-3 bg-[#151515] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">OPPONENT</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{opportunity.opponent.name}</p>
                        <p className="text-sm text-gray-400">
                          {opportunity.opponent.record} • {opportunity.opponent.country}
                        </p>
                      </div>
                      <span className="text-sm text-[#ef4444]">{opportunity.opponent.ranking}</span>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="text-white font-medium">
                      {new Date(opportunity.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-white font-medium text-sm">{opportunity.location.split(",")[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Purse</p>
                    <p className="text-[#22c55e] font-bold">{opportunity.purse}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Win Bonus</p>
                    <p className="text-white font-medium">{opportunity.winBonus || "N/A"}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className={`flex items-center justify-between p-2 rounded-lg ${
                  isUrgent ? "bg-[#f59e0b]/10" : "bg-[#151515]"
                }`}>
                  <div className="flex items-center gap-2">
                    <svg className={`w-4 h-4 ${isUrgent ? "text-[#f59e0b]" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-sm ${isUrgent ? "text-[#f59e0b]" : "text-gray-400"}`}>
                      Response deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  {isUrgent && (
                    <span className="text-xs font-medium text-[#f59e0b]">
                      {daysUntilDeadline} days left
                    </span>
                  )}
                </div>

                {/* Actions */}
                {opportunity.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      className="flex-1 bg-[#22c55e] hover:bg-[#16a34a]"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle accept
                      }}
                    >
                      Accept Offer
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle negotiate
                      }}
                    >
                      Negotiate
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle decline
                      }}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search criteria" : "Check back soon for new fight offers"}
            </p>
          </div>
        </Card>
      )}

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#252525] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {selectedOpportunity.promotion.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedOpportunity.promotion}</p>
                  <p className="text-sm text-gray-500">{selectedOpportunity.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Title & Badge */}
              <div>
                <Badge variant={statusConfig[selectedOpportunity.status as OpportunityStatus].variant} dot className="mb-2">
                  {statusConfig[selectedOpportunity.status as OpportunityStatus].label}
                </Badge>
                <h2 className="text-2xl font-bold text-white">{selectedOpportunity.title}</h2>
                <p className="text-gray-400 mt-1">{selectedOpportunity.event}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#151515] rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">EVENT DATE</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedOpportunity.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-[#151515] rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">LOCATION</p>
                  <p className="text-white font-semibold">{selectedOpportunity.location}</p>
                </div>
              </div>

              {/* Opponent */}
              {selectedOpportunity.opponent && (
                <div className="p-4 bg-[#151515] rounded-lg border border-[#2a2a2a]">
                  <p className="text-xs text-gray-500 mb-3">OPPONENT</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#252525] rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-white">{selectedOpportunity.opponent.name}</p>
                      <p className="text-gray-400">{selectedOpportunity.opponent.record}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default">{selectedOpportunity.opponent.country}</Badge>
                        <span className="text-sm text-[#ef4444]">{selectedOpportunity.opponent.ranking}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fight Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#151515] rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">WEIGHT CLASS</p>
                  <p className="text-white font-bold">{selectedOpportunity.weightClass}</p>
                </div>
                <div className="p-4 bg-[#151515] rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">ROUNDS</p>
                  <p className="text-white font-bold">{selectedOpportunity.rounds}</p>
                </div>
                <div className="p-4 bg-[#151515] rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">TYPE</p>
                  <p className="text-white font-bold capitalize">{selectedOpportunity.type}</p>
                </div>
              </div>

              {/* Compensation */}
              <div className="p-4 bg-gradient-to-r from-[#22c55e]/10 to-[#22c55e]/5 rounded-lg border border-[#22c55e]/20">
                <p className="text-xs text-gray-500 mb-3">COMPENSATION</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Base Purse</p>
                    <p className="text-2xl font-bold text-[#22c55e]">{selectedOpportunity.purse}</p>
                  </div>
                  {selectedOpportunity.winBonus && (
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Win Bonus</p>
                      <p className="text-2xl font-bold text-white">{selectedOpportunity.winBonus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedOpportunity.notes && (
                <div className="p-4 bg-[#151515] rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">ADDITIONAL NOTES</p>
                  <p className="text-gray-300">{selectedOpportunity.notes}</p>
                </div>
              )}

              {/* Response Deadline */}
              <div className={`p-4 rounded-lg ${
                getDaysUntilDeadline(selectedOpportunity.deadline) <= 7
                  ? "bg-[#f59e0b]/10 border border-[#f59e0b]/30"
                  : "bg-[#151515]"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">RESPONSE DEADLINE</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedOpportunity.deadline).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#f59e0b]">
                      {getDaysUntilDeadline(selectedOpportunity.deadline)}
                    </p>
                    <p className="text-xs text-gray-500">days remaining</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedOpportunity.status === "pending" && (
              <div className="p-4 border-t border-[#2a2a2a] flex gap-3 sticky bottom-0 bg-[#1a1a1a]">
                <Button
                  variant="primary"
                  className="flex-1 bg-[#22c55e] hover:bg-[#16a34a]"
                >
                  Accept Offer
                </Button>
                <Button variant="outline" className="flex-1">
                  Counter Offer
                </Button>
                <Button variant="ghost" className="text-[#ef4444] hover:bg-[#ef4444]/10">
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
