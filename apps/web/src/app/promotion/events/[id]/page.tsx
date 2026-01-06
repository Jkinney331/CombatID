"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";


// Mock event data
const eventData = {
  id: "1",
  name: "EFL Fight Night 47",
  date: "2024-02-15",
  time: "7:00 PM",
  venue: "MGM Grand Garden Arena",
  location: "Las Vegas, NV",
  status: "approved",
  commission: "Nevada Athletic Commission",
  commissionId: "nac-001",
  type: "MMA",
  description: "Elite Fight League presents Fight Night 47 featuring top contenders.",
};

const bouts = [
  {
    id: "b1",
    position: 1,
    isMainEvent: true,
    fighterA: { id: "f1", name: "Marcus Rivera", record: "15-2", weightClass: "Lightweight", combatId: "CID-MR-2024", signedAt: "2024-01-20", eligible: true },
    fighterB: { id: "f2", name: "Jake Thompson", record: "12-3", weightClass: "Lightweight", combatId: "CID-JT-2024", signedAt: null, eligible: true },
    weightClass: "Lightweight",
    rounds: 5,
    status: "pending",
  },
  {
    id: "b2",
    position: 2,
    isMainEvent: false,
    fighterA: { id: "f3", name: "Sarah Chen", record: "8-1", weightClass: "Strawweight", combatId: "CID-SC-2024", signedAt: "2024-01-22", eligible: true },
    fighterB: { id: "f4", name: "Ana Rodriguez", record: "10-2", weightClass: "Strawweight", combatId: "CID-AR-2024", signedAt: "2024-01-23", eligible: true },
    weightClass: "Strawweight",
    rounds: 3,
    status: "signed",
  },
  {
    id: "b3",
    position: 3,
    isMainEvent: false,
    fighterA: { id: "f5", name: "Mike Johnson", record: "7-4", weightClass: "Welterweight", combatId: "CID-MJ-2024", signedAt: "2024-01-19", eligible: true },
    fighterB: { id: "f6", name: "Carlos Santos", record: "9-2", weightClass: "Welterweight", combatId: "CID-CS-2024", signedAt: "2024-01-21", eligible: false },
    weightClass: "Welterweight",
    rounds: 3,
    status: "pending",
  },
  {
    id: "b4",
    position: 4,
    isMainEvent: false,
    fighterA: { id: "f7", name: "David Lee", record: "5-1", weightClass: "Bantamweight", combatId: "CID-DL-2024", signedAt: null, eligible: true },
    fighterB: { id: "f8", name: "Tony Garcia", record: "6-2", weightClass: "Bantamweight", combatId: "CID-TG-2024", signedAt: null, eligible: true },
    weightClass: "Bantamweight",
    rounds: 3,
    status: "pending",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  signed: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  pending: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
  approved: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
};

export default function EventDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"card" | "details" | "documents">("card");
  const [showAddBout, setShowAddBout] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/events" className="text-[#6b7280] hover:text-[#111827]">
          Events
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827] font-medium">{eventData.name}</span>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#111827]">{eventData.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[eventData.status].bg} ${statusColors[eventData.status].text}`}
              >
                {eventData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
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
                <span className="text-[#6b7280]">Commission:</span>
                <span className="font-medium">{eventData.commission}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Type:</span>
                <span className="font-medium">{eventData.type}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
              Edit Event
            </button>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
              Submit to Commission
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "card", label: "Fight Card" },
            { id: "details", label: "Event Details" },
            { id: "documents", label: "Documents" },
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

      {/* Fight Card Tab */}
      {activeTab === "card" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#111827]">Fight Card ({bouts.length} bouts)</h2>
            <button
              onClick={() => setShowAddBout(true)}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium"
            >
              + Add Bout
            </button>
          </div>

          {/* Bout Cards */}
          <div className="space-y-3">
            {bouts.map((bout) => (
              <Link
                key={bout.id}
                href={`/promotion/events/${params.id}/bouts/${bout.id}`}
                className="bg-white rounded-xl border border-[#e5e7eb] p-4 block hover:border-[#7C3AED] transition-colors"
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
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[bout.status].bg} ${statusColors[bout.status].text}`}
                  >
                    {bout.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Fighter A */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div>
                        <p className="font-semibold text-[#111827]">{bout.fighterA.name}</p>
                        <p className="text-sm text-[#6b7280]">{bout.fighterA.record}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          {bout.fighterA.signedAt ? (
                            <span className="text-xs text-[#10b981]">Signed</span>
                          ) : (
                            <span className="text-xs text-[#f59e0b]">Pending</span>
                          )}
                          {bout.fighterA.eligible ? (
                            <span className="text-xs text-[#10b981]">Eligible</span>
                          ) : (
                            <span className="text-xs text-[#ef4444]">Not Eligible</span>
                          )}
                        </div>
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
                        <p className="font-semibold text-[#111827]">{bout.fighterB.name}</p>
                        <p className="text-sm text-[#6b7280]">{bout.fighterB.record}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {bout.fighterB.signedAt ? (
                            <span className="text-xs text-[#10b981]">Signed</span>
                          ) : (
                            <span className="text-xs text-[#f59e0b]">Pending</span>
                          )}
                          {bout.fighterB.eligible ? (
                            <span className="text-xs text-[#10b981]">Eligible</span>
                          ) : (
                            <span className="text-xs text-[#ef4444]">Not Eligible</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Tab */}
      {activeTab === "details" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Event Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Event Name</label>
              <input
                type="text"
                value={eventData.name}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Event Type</label>
              <input
                type="text"
                value={eventData.type}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Date</label>
              <input
                type="text"
                value={eventData.date}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Time</label>
              <input
                type="text"
                value={eventData.time}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Venue</label>
              <input
                type="text"
                value={eventData.venue}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Location</label>
              <input
                type="text"
                value={eventData.location}
                readOnly
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
              <textarea
                value={eventData.description}
                readOnly
                rows={3}
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg bg-[#f9fafb]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827]">Event Documents</h3>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
              + Upload Document
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f3f4f6] rounded flex items-center justify-center">
                  <span>📄</span>
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Event Application.pdf</p>
                  <p className="text-xs text-[#6b7280]">Uploaded Jan 15, 2024</p>
                </div>
              </div>
              <button className="text-[#7C3AED] hover:underline text-sm">Download</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f3f4f6] rounded flex items-center justify-center">
                  <span>📄</span>
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Insurance Certificate.pdf</p>
                  <p className="text-xs text-[#6b7280]">Uploaded Jan 16, 2024</p>
                </div>
              </div>
              <button className="text-[#7C3AED] hover:underline text-sm">Download</button>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e7eb] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f3f4f6] rounded flex items-center justify-center">
                  <span>📄</span>
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Venue Contract.pdf</p>
                  <p className="text-xs text-[#6b7280]">Uploaded Jan 14, 2024</p>
                </div>
              </div>
              <button className="text-[#7C3AED] hover:underline text-sm">Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bout Modal */}
      {showAddBout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Add New Bout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Fighter A</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Select fighter...</option>
                  <option>Marcus Rivera (Lightweight)</option>
                  <option>Sarah Chen (Strawweight)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Fighter B</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Select fighter...</option>
                  <option>Jake Thompson (Lightweight)</option>
                  <option>Ana Rodriguez (Strawweight)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Weight Class</label>
                  <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                    <option>Lightweight</option>
                    <option>Welterweight</option>
                    <option>Middleweight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Rounds</label>
                  <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                    <option>3</option>
                    <option>5</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddBout(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddBout(false)}
                className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Add Bout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
