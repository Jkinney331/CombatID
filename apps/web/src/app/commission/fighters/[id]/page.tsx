"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";


const fighterData = {
  id: "DOEJ123456",
  name: "John Doe",
  combatId: "CID-JD-2024",
  record: "3-0",
  weightClass: "Welterweight",
  disciplines: ["MMA", "Kickboxing"],
  eligibility: "eligible",
  age: 28,
  height: "6'0\"",
  reach: "74\"",
  gym: "American Top Team",
  location: "Las Vegas, NV",
  country: "USA",
  dateOfBirth: "1996-05-15",
  bio: "Undefeated welterweight prospect with strong wrestling background and knockout power.",
  verificationStatus: "verified",
  licenseNumber: "NAC-2024-12345",
  licenseExpires: "2024-12-31",
};

const documents = [
  { id: 1, type: "Blood Test (HIV, Hep B/C)", status: "verified", expires: "2024-06-15", uploadedAt: "2024-01-10", aiConfidence: 98, reviewedBy: "J. Smith" },
  { id: 2, type: "Physical Examination", status: "verified", expires: "2024-08-20", uploadedAt: "2024-01-08", aiConfidence: 95, reviewedBy: "J. Smith" },
  { id: 3, type: "Eye Examination", status: "verified", expires: "2024-09-10", uploadedAt: "2024-01-05", aiConfidence: 97, reviewedBy: "M. Johnson" },
  { id: 4, type: "MRI/CT Scan", status: "verified", expires: "2024-12-01", uploadedAt: "2023-12-15", aiConfidence: 92, reviewedBy: "M. Johnson" },
  { id: 5, type: "EKG", status: "pending", expires: null, uploadedAt: "2024-01-22", aiConfidence: 89, reviewedBy: null },
];

const fightHistory = [
  { id: 1, opponent: "Mike Davis", result: "W", method: "TKO", round: 2, event: "EFL Fight Night 44", date: "2023-09-08", jurisdiction: "Nevada" },
  { id: 2, opponent: "Ryan Martinez", result: "W", method: "Decision", round: 3, event: "EFL Fight Night 42", date: "2023-06-22", jurisdiction: "Nevada" },
  { id: 3, opponent: "Sam Lee", result: "W", method: "Submission", round: 2, event: "EFL Contender Series 5", date: "2023-04-15", jurisdiction: "Nevada" },
];

const eligibilityChecks = [
  { id: 1, requirement: "Blood Test (HIV, Hep B/C)", status: "met", validUntil: "2024-06-15" },
  { id: 2, requirement: "Physical Examination", status: "met", validUntil: "2024-08-20" },
  { id: 3, requirement: "Eye Examination", status: "met", validUntil: "2024-09-10" },
  { id: 4, requirement: "MRI/CT Scan", status: "met", validUntil: "2024-12-01" },
  { id: 5, requirement: "Valid License", status: "met", validUntil: "2024-12-31" },
  { id: 6, requirement: "No Active Suspension", status: "met", validUntil: null },
];

export default function CommissionFighterDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "history" | "eligibility">("overview");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/commission/fighters" className="text-[#6b7280] hover:text-[#111827]">
          Fighters
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
                    Eligible
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#dbeafe] text-[#1e40af]">
                    Verified
                  </span>
                </div>
                <p className="text-[#6b7280]">{fighterData.combatId} • License: {fighterData.licenseNumber}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-[#6b7280]">
                  <span>{fighterData.weightClass}</span>
                  <span>•</span>
                  <span>{fighterData.gym}</span>
                  <span>•</span>
                  <span>{fighterData.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium"
                >
                  Override Eligibility
                </button>
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="px-4 py-2 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#fef2f2] transition-colors text-sm font-medium"
                >
                  Suspend Fighter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 mt-6">
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">{fighterData.record}</p>
                <p className="text-xs text-[#6b7280]">Record</p>
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
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#10b981]">5/5</p>
                <p className="text-xs text-[#6b7280]">Documents</p>
              </div>
              <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                <p className="text-2xl font-bold text-[#111827]">3</p>
                <p className="text-xs text-[#6b7280]">Fights (NV)</p>
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
            { id: "documents", label: "Documents" },
            { id: "history", label: "Fight History" },
            { id: "eligibility", label: "Eligibility" },
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Personal Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Full Name</span>
                <span className="font-medium">{fighterData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Date of Birth</span>
                <span className="font-medium">{fighterData.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Country</span>
                <span className="font-medium">{fighterData.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Residence</span>
                <span className="font-medium">{fighterData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Weight Class</span>
                <span className="font-medium">{fighterData.weightClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Gym</span>
                <span className="font-medium">{fighterData.gym}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">License Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">License Number</span>
                <span className="font-medium">{fighterData.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Jurisdiction</span>
                <span className="font-medium">Nevada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Disciplines</span>
                <span className="font-medium">{fighterData.disciplines.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">License Expires</span>
                <span className="font-medium">{fighterData.licenseExpires}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Verification Status</span>
                <span className="font-medium text-[#10b981]">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Eligibility Status</span>
                <span className="font-medium text-[#10b981]">Eligible</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Commission Notes</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#f9fafb] rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#111827]">License Renewal</span>
                  <span className="text-xs text-[#6b7280]">Jan 2, 2024 - J. Smith</span>
                </div>
                <p className="text-sm text-[#6b7280]">License renewed for 2024. All documents verified.</p>
              </div>
              <div className="p-3 bg-[#f9fafb] rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#111827]">Initial Registration</span>
                  <span className="text-xs text-[#6b7280]">Apr 10, 2023 - M. Johnson</span>
                </div>
                <p className="text-sm text-[#6b7280]">Fighter registered and licensed for MMA competition.</p>
              </div>
            </div>
            <button className="mt-4 text-[#2563EB] hover:underline text-sm">+ Add Note</button>
          </div>
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
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">AI Confidence</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Expires</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Reviewed By</th>
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
                      <span className="font-medium text-[#111827]">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === "verified"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : "bg-[#fef3c7] text-[#92400e]"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            doc.aiConfidence >= 95 ? "bg-[#10b981]" : doc.aiConfidence >= 85 ? "bg-[#f59e0b]" : "bg-[#ef4444]"
                          }`}
                          style={{ width: `${doc.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#6b7280]">{doc.aiConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">
                    {doc.expires || <span className="text-[#9ca3af]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">
                    {doc.reviewedBy || <span className="text-[#9ca3af]">Pending</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-[#2563EB] hover:underline text-sm">View</button>
                      {doc.status === "pending" && (
                        <button className="text-[#10b981] hover:underline text-sm">Approve</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fight History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h3 className="font-semibold text-[#111827]">Fight History (Nevada)</h3>
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

      {/* Eligibility Tab */}
      {activeTab === "eligibility" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Eligibility Status</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#dcfce7] text-[#166534]">
                Eligible to Compete
              </span>
            </div>
            <div className="space-y-3">
              {eligibilityChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={check.status === "met" ? "text-[#10b981]" : "text-[#ef4444]"}>
                      {check.status === "met" ? "✓" : "✗"}
                    </span>
                    <span className="text-[#374151]">{check.requirement}</span>
                  </div>
                  <span className="text-sm text-[#6b7280]">
                    {check.validUntil ? `Valid until ${check.validUntil}` : "Active"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Override History</h3>
            <p className="text-sm text-[#6b7280]">No eligibility overrides on record.</p>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Suspend Fighter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Suspension Type</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Medical Suspension</option>
                  <option>Administrative Suspension</option>
                  <option>Disciplinary Suspension</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Duration</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                  <option>180 days</option>
                  <option>Indefinite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Reason</label>
                <textarea
                  placeholder="Enter suspension reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors"
              >
                Suspend Fighter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Override Eligibility</h3>
            <div className="p-3 bg-[#fef3c7] rounded-lg mb-4">
              <p className="text-sm text-[#92400e]">
                Eligibility overrides should only be used in exceptional circumstances and will be logged in the fighter's permanent record.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Override Type</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Grant Conditional Eligibility</option>
                  <option>Waive Document Requirement</option>
                  <option>Clear Medical Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Reason for Override</label>
                <textarea
                  placeholder="Enter detailed justification..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Valid Until</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
