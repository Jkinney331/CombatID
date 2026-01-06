"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";


const eventData = {
  id: "1",
  name: "Fierce Fighting Championships",
  eventName: "Fierce FC XX",
  date: "2026-01-01",
  time: "7:00 PM",
  venue: "MGM Grand Garden Arena",
  location: "Las Vegas, NV",
  status: "submitted",
  promotion: "Fierce Fighting Championships",
  type: "MMA",
  submittedAt: "2025-12-15",
  approvedAt: null,
  capacity: 12000,
};

const bouts = [
  {
    id: "b1",
    position: 1,
    isMainEvent: true,
    fighterA: { id: "f1", name: "John Doe", record: "3-0", combatId: "DOEJ123456", eligible: true },
    fighterB: { id: "f2", name: "Jake Johnson", record: "2-0", combatId: "JOHNSONJ789", eligible: true },
    weightClass: "Welterweight",
    rounds: 5,
    status: "approved",
    notes: null,
  },
  {
    id: "b2",
    position: 2,
    isMainEvent: false,
    fighterA: { id: "f3", name: "Carlos Santos", record: "5-2", combatId: "SANTOSC456", eligible: false },
    fighterB: { id: "f4", name: "James Martin", record: "3-3", combatId: "MARTINJ321", eligible: true },
    weightClass: "Middleweight",
    rounds: 3,
    status: "pending",
    notes: "Fighter A has medical suspension",
  },
  {
    id: "b3",
    position: 3,
    isMainEvent: false,
    fighterA: { id: "f5", name: "Kevin Mill", record: "15-3", combatId: "MILLK654", eligible: true },
    fighterB: { id: "f6", name: "William Owy", record: "7-1", combatId: "WOWY987", eligible: true },
    weightClass: "Lightweight",
    rounds: 3,
    status: "approved",
    notes: null,
  },
];

const documents = [
  { id: 1, name: "Event Application", status: "verified", uploadedAt: "2025-12-15" },
  { id: 2, name: "Insurance Certificate", status: "verified", uploadedAt: "2025-12-15" },
  { id: 3, name: "Venue Contract", status: "verified", uploadedAt: "2025-12-14" },
  { id: 4, name: "Emergency Medical Plan", status: "pending", uploadedAt: "2025-12-16" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  submitted: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
  rejected: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  verified: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
};

export default function CommissionEventDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"card" | "documents" | "checklist">("card");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const allBoutsApproved = bouts.every((bout) => bout.status === "approved");
  const allDocsVerified = documents.every((doc) => doc.status === "verified");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/commission/events" className="text-[#6b7280] hover:text-[#111827]">
          Events
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827] font-medium">{eventData.eventName}</span>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#111827]">{eventData.eventName}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[eventData.status].bg} ${statusColors[eventData.status].text}`}
              >
                {eventData.status}
              </span>
            </div>
            <p className="text-[#6b7280]">{eventData.name}</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Date:</span>
                <span className="font-medium">
                  {new Date(eventData.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Time:</span>
                <span className="font-medium">{eventData.time} PT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Venue:</span>
                <span className="font-medium">{eventData.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Location:</span>
                <span className="font-medium">{eventData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Type:</span>
                <span className="font-medium">{eventData.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Submitted:</span>
                <span className="font-medium">{eventData.submittedAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors text-sm font-medium"
            >
              Reject Event
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium"
              disabled={!allBoutsApproved || !allDocsVerified}
            >
              Approve Event
            </button>
          </div>
        </div>
      </div>

      {/* Approval Checklist Summary */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={allDocsVerified ? "text-[#10b981]" : "text-[#f59e0b]"}>
              {allDocsVerified ? "✓" : "○"}
            </span>
            <span className="text-sm">All documents verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={allBoutsApproved ? "text-[#10b981]" : "text-[#f59e0b]"}>
              {allBoutsApproved ? "✓" : "○"}
            </span>
            <span className="text-sm">All fighters eligible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#10b981]">✓</span>
            <span className="text-sm">Insurance verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#f59e0b]">○</span>
            <span className="text-sm">Medical staff assigned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "card", label: "Fight Card" },
            { id: "documents", label: "Event Documents" },
            { id: "checklist", label: "Approval Checklist" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fight Card Tab */}
      {activeTab === "card" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#111827]">Fight Card ({bouts.length} bouts)</h2>
          </div>

          {/* Bout Cards */}
          <div className="space-y-3">
            {bouts.map((bout) => (
              <div
                key={bout.id}
                className={`bg-white rounded-xl border p-4 ${
                  bout.status === "pending" ? "border-[#f59e0b]" : "border-[#e5e7eb]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#6b7280]">
                      {bout.isMainEvent ? "MAIN EVENT" : `BOUT ${bout.position}`}
                    </span>
                    <span className="text-xs text-[#6b7280]">•</span>
                    <span className="text-xs text-[#6b7280]">
                      {bout.weightClass} • {bout.rounds} rounds
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bout.status].bg} ${statusColors[bout.status].text}`}
                    >
                      {bout.status}
                    </span>
                    {bout.status === "pending" && (
                      <button className="px-3 py-1 bg-[#2563EB] text-white rounded text-xs font-medium hover:bg-[#1d4ed8]">
                        Review
                      </button>
                    )}
                  </div>
                </div>

                {bout.notes && (
                  <div className="mb-3 p-2 bg-[#fef3c7] rounded text-sm text-[#92400e]">
                    {bout.notes}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Fighter A */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div>
                        <Link
                          href={`/commission/fighters/${bout.fighterA.combatId}`}
                          className="font-semibold text-[#111827] hover:text-[#2563EB]"
                        >
                          {bout.fighterA.name}
                        </Link>
                        <p className="text-sm text-[#6b7280]">{bout.fighterA.record}</p>
                        <p className="text-xs text-[#9ca3af]">{bout.fighterA.combatId}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                            bout.fighterA.eligible
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {bout.fighterA.eligible ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <span className="text-xl font-bold text-[#6b7280]">VS</span>
                  </div>

                  {/* Fighter B */}
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <Link
                          href={`/commission/fighters/${bout.fighterB.combatId}`}
                          className="font-semibold text-[#111827] hover:text-[#2563EB]"
                        >
                          {bout.fighterB.name}
                        </Link>
                        <p className="text-sm text-[#6b7280]">{bout.fighterB.record}</p>
                        <p className="text-xs text-[#9ca3af]">{bout.fighterB.combatId}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${
                            bout.fighterB.eligible
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {bout.fighterB.eligible ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="font-semibold text-[#111827]">Event Documents</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Document</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Uploaded</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
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
                      <span className="font-medium text-[#111827]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doc.status].bg} ${statusColors[doc.status].text}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{doc.uploadedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-[#2563EB] hover:underline text-sm">View</button>
                      {doc.status === "pending" && (
                        <button className="text-[#10b981] hover:underline text-sm">Verify</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === "checklist" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Event Approval Checklist</h3>
          <div className="space-y-4">
            {[
              { id: 1, label: "Event application reviewed", checked: true },
              { id: 2, label: "Insurance certificate verified ($1M minimum)", checked: true },
              { id: 3, label: "Venue contract on file", checked: true },
              { id: 4, label: "Emergency medical plan submitted", checked: false },
              { id: 5, label: "All fighters have valid licenses", checked: true },
              { id: 6, label: "All fighters meet medical requirements", checked: false },
              { id: 7, label: "Ring/cage inspection scheduled", checked: false },
              { id: 8, label: "Medical staff assignments confirmed", checked: false },
              { id: 9, label: "Officials assigned (referee, judges)", checked: false },
              { id: 10, label: "Drug testing arrangements confirmed", checked: true },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="w-5 h-5 rounded border-[#d1d5db] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className={item.checked ? "text-[#374151]" : "text-[#6b7280]"}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
            <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium">
              Save Checklist
            </button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Approve Event</h3>
            <p className="text-[#6b7280] mb-4">
              You are about to approve {eventData.eventName}. This will notify the promotion that the event has been sanctioned.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Notes (optional)</label>
                <textarea
                  placeholder="Add any notes for the promotion..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Approve Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Reject Event</h3>
            <p className="text-[#6b7280] mb-4">
              Please provide a reason for rejecting this event. The promotion will be notified.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Reason for Rejection *</label>
                <textarea
                  placeholder="Enter reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors"
              >
                Reject Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
