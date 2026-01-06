"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";


const boutData = {
  id: "b1",
  position: 1,
  isMainEvent: true,
  weightClass: "Lightweight",
  rounds: 5,
  status: "pending",
  createdAt: "2024-01-15",
  fighterA: {
    id: "f1",
    name: "Marcus Rivera",
    record: "15-2",
    weightClass: "Lightweight",
    combatId: "CID-MR-2024",
    signedAt: "2024-01-20",
    eligible: true,
    profileImage: null,
    age: 28,
    height: "5'10\"",
    reach: "72\"",
    gym: "American Top Team",
  },
  fighterB: {
    id: "f2",
    name: "Jake Thompson",
    record: "12-3",
    weightClass: "Lightweight",
    combatId: "CID-JT-2024",
    signedAt: null,
    eligible: true,
    profileImage: null,
    age: 26,
    height: "5'11\"",
    reach: "74\"",
    gym: "Jackson Wink MMA",
  },
  contract: {
    id: "c1",
    purseA: 50000,
    purseB: 50000,
    ppvPoints: true,
    createdAt: "2024-01-15",
    sentAt: "2024-01-16",
    fighterASignedAt: "2024-01-20",
    fighterBSignedAt: null,
  },
};

export default function BoutDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "contract" | "eligibility">("overview");
  const [showSendReminder, setShowSendReminder] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/promotion/events" className="text-[#6b7280] hover:text-[#111827]">
          Events
        </Link>
        <span className="text-[#6b7280]">/</span>
        <Link href={`/promotion/events/${params.id}`} className="text-[#6b7280] hover:text-[#111827]">
          EFL Fight Night 47
        </Link>
        <span className="text-[#6b7280]">/</span>
        <span className="text-[#111827] font-medium">Bout</span>
      </div>

      {/* Bout Header */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-medium text-[#7C3AED]">
              {boutData.isMainEvent ? "MAIN EVENT" : `BOUT ${boutData.position}`}
            </span>
            <h1 className="text-xl font-bold text-[#111827] mt-1">
              {boutData.fighterA.name} vs {boutData.fighterB.name}
            </h1>
            <p className="text-[#6b7280] text-sm mt-1">
              {boutData.weightClass} • {boutData.rounds} rounds
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
              Edit Bout
            </button>
            <button className="px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors text-sm font-medium">
              Cancel Bout
            </button>
          </div>
        </div>

        {/* Fighter Comparison */}
        <div className="grid grid-cols-3 gap-8 items-center">
          {/* Fighter A */}
          <div className="text-center">
            <div className="w-24 h-24 bg-[#f3f4f6] rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="font-bold text-lg text-[#111827]">{boutData.fighterA.name}</h3>
            <p className="text-[#6b7280]">{boutData.fighterA.record}</p>
            <p className="text-sm text-[#6b7280] mt-1">{boutData.fighterA.gym}</p>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="text-[#6b7280]">Age:</span> {boutData.fighterA.age}</p>
              <p><span className="text-[#6b7280]">Height:</span> {boutData.fighterA.height}</p>
              <p><span className="text-[#6b7280]">Reach:</span> {boutData.fighterA.reach}</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                boutData.fighterA.signedAt ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fef3c7] text-[#92400e]"
              }`}>
                {boutData.fighterA.signedAt ? "Contract Signed" : "Pending Signature"}
              </div>
              <div className={`block mx-auto w-fit px-3 py-1 rounded-full text-xs font-medium ${
                boutData.fighterA.eligible ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
              }`}>
                {boutData.fighterA.eligible ? "Eligible" : "Not Eligible"}
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="w-20 h-20 bg-[#7C3AED]/10 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl font-bold text-[#7C3AED]">VS</span>
            </div>
          </div>

          {/* Fighter B */}
          <div className="text-center">
            <div className="w-24 h-24 bg-[#f3f4f6] rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="font-bold text-lg text-[#111827]">{boutData.fighterB.name}</h3>
            <p className="text-[#6b7280]">{boutData.fighterB.record}</p>
            <p className="text-sm text-[#6b7280] mt-1">{boutData.fighterB.gym}</p>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="text-[#6b7280]">Age:</span> {boutData.fighterB.age}</p>
              <p><span className="text-[#6b7280]">Height:</span> {boutData.fighterB.height}</p>
              <p><span className="text-[#6b7280]">Reach:</span> {boutData.fighterB.reach}</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                boutData.fighterB.signedAt ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fef3c7] text-[#92400e]"
              }`}>
                {boutData.fighterB.signedAt ? "Contract Signed" : "Pending Signature"}
              </div>
              {!boutData.fighterB.signedAt && (
                <button
                  onClick={() => setShowSendReminder(true)}
                  className="block mx-auto text-xs text-[#7C3AED] hover:underline"
                >
                  Send Reminder
                </button>
              )}
              <div className={`block mx-auto w-fit px-3 py-1 rounded-full text-xs font-medium ${
                boutData.fighterB.eligible ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]"
              }`}>
                {boutData.fighterB.eligible ? "Eligible" : "Not Eligible"}
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
            { id: "contract", label: "Contract Details" },
            { id: "eligibility", label: "Eligibility Status" },
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
            <h3 className="font-semibold text-[#111827] mb-4">Bout Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Status</span>
                <span className="font-medium capitalize">{boutData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Weight Class</span>
                <span className="font-medium">{boutData.weightClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Scheduled Rounds</span>
                <span className="font-medium">{boutData.rounds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Card Position</span>
                <span className="font-medium">{boutData.isMainEvent ? "Main Event" : `Bout ${boutData.position}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Created</span>
                <span className="font-medium">{boutData.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Contract Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Contract Sent</span>
                <span className="font-medium">{boutData.contract.sentAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">{boutData.fighterA.name}</span>
                <span className={`font-medium ${boutData.contract.fighterASignedAt ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                  {boutData.contract.fighterASignedAt ? `Signed ${boutData.contract.fighterASignedAt}` : "Pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">{boutData.fighterB.name}</span>
                <span className={`font-medium ${boutData.contract.fighterBSignedAt ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                  {boutData.contract.fighterBSignedAt ? `Signed ${boutData.contract.fighterBSignedAt}` : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Tab */}
      {activeTab === "contract" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-4">Contract Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h4 className="font-medium text-[#111827] mb-3">{boutData.fighterA.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Base Purse</span>
                  <span className="font-medium">${boutData.contract.purseA.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">PPV Points</span>
                  <span className="font-medium">{boutData.contract.ppvPoints ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Signature Status</span>
                  <span className={`font-medium ${boutData.contract.fighterASignedAt ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                    {boutData.contract.fighterASignedAt ? "Signed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h4 className="font-medium text-[#111827] mb-3">{boutData.fighterB.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Base Purse</span>
                  <span className="font-medium">${boutData.contract.purseB.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">PPV Points</span>
                  <span className="font-medium">{boutData.contract.ppvPoints ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Signature Status</span>
                  <span className={`font-medium ${boutData.contract.fighterBSignedAt ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                    {boutData.contract.fighterBSignedAt ? "Signed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
              View Full Contract
            </button>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
              Resend Contract
            </button>
          </div>
        </div>
      )}

      {/* Eligibility Tab */}
      {activeTab === "eligibility" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">{boutData.fighterA.name}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                Eligible
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Blood Test (HIV, Hep B/C)", status: "verified", expires: "2024-06-15" },
                { name: "Physical Examination", status: "verified", expires: "2024-08-20" },
                { name: "Eye Examination", status: "verified", expires: "2024-09-10" },
                { name: "MRI/CT Scan", status: "verified", expires: "2024-12-01" },
                { name: "Fight License", status: "verified", expires: "2024-12-31" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>{doc.name}</span>
                  </div>
                  <span className="text-[#6b7280]">Exp: {doc.expires}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">{boutData.fighterB.name}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                Eligible
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Blood Test (HIV, Hep B/C)", status: "verified", expires: "2024-05-20" },
                { name: "Physical Examination", status: "verified", expires: "2024-07-15" },
                { name: "Eye Examination", status: "verified", expires: "2024-08-01" },
                { name: "MRI/CT Scan", status: "verified", expires: "2024-11-15" },
                { name: "Fight License", status: "verified", expires: "2024-12-31" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span>
                    <span>{doc.name}</span>
                  </div>
                  <span className="text-[#6b7280]">Exp: {doc.expires}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Send Contract Reminder</h3>
            <p className="text-[#6b7280] text-sm mb-4">
              Send a reminder to {boutData.fighterB.name} to sign the bout agreement.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Add a message (optional)</label>
              <textarea
                placeholder="Please review and sign the contract at your earliest convenience..."
                rows={3}
                className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSendReminder(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSendReminder(false)}
                className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
