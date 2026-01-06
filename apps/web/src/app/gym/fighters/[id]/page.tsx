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
  eligibility: "eligible",
  age: 28,
  height: "5'10\"",
  reach: "72\"",
  location: "Miami, FL",
  email: "marcus.rivera@email.com",
  phone: "+1 (305) 555-0123",
  bio: "Former collegiate wrestler turned MMA fighter with a devastating ground game and improving striking.",
  joinedGym: "2020-03-15",
  coaches: ["Coach Dan", "Coach Maria"],
};

const documents = [
  { id: 1, type: "Blood Test (HIV, Hep B/C)", status: "verified", expires: "2024-06-15", uploadedAt: "2024-01-10", uploadedBy: "Fighter" },
  { id: 2, type: "Physical Examination", status: "verified", expires: "2024-08-20", uploadedAt: "2024-01-08", uploadedBy: "Gym" },
  { id: 3, type: "Eye Examination", status: "verified", expires: "2024-09-10", uploadedAt: "2024-01-05", uploadedBy: "Fighter" },
  { id: 4, type: "MRI/CT Scan", status: "verified", expires: "2024-12-01", uploadedAt: "2023-12-15", uploadedBy: "Fighter" },
  { id: 5, type: "Fight License (Nevada)", status: "verified", expires: "2024-12-31", uploadedAt: "2024-01-02", uploadedBy: "Fighter" },
];

const fightHistory = [
  { id: 1, opponent: "Jake Thompson", result: "W", method: "TKO", round: 2, event: "EFL Fight Night 46", date: "2024-01-20", promotion: "Elite Fight League" },
  { id: 2, opponent: "Tony Garcia", result: "W", method: "Submission", round: 3, event: "EFL Championship Series", date: "2023-11-15", promotion: "Elite Fight League" },
  { id: 3, opponent: "Chris Williams", result: "W", method: "Decision", round: 3, event: "EFL Fight Night 44", date: "2023-09-08", promotion: "Elite Fight League" },
  { id: 4, opponent: "Ryan Martinez", result: "L", method: "KO", round: 1, event: "EFL Fight Night 42", date: "2023-06-22", promotion: "Elite Fight League" },
];

const trainingLog = [
  { id: 1, date: "2024-01-22", type: "Wrestling", duration: "90 min", notes: "Takedown defense drills" },
  { id: 2, date: "2024-01-21", type: "Striking", duration: "60 min", notes: "Boxing combinations with Coach Dan" },
  { id: 3, date: "2024-01-20", type: "BJJ", duration: "75 min", notes: "Submission escapes" },
  { id: 4, date: "2024-01-19", type: "Conditioning", duration: "45 min", notes: "HIIT and cardio" },
];

export default function GymFighterDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "training" | "history">("overview");
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/gym/fighters" className="text-[#6b7280] hover:text-[#111827]">
          My Fighters
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
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium"
                >
                  Upload Document
                </button>
                <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
                  Message Fighter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6">
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
            { id: "training", label: "Training Log" },
            { id: "history", label: "Fight History" },
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
                <span className="text-[#6b7280]">Location</span>
                <span className="font-medium">{fighterData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Joined Gym</span>
                <span className="font-medium">{fighterData.joinedGym}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Coaches</span>
                <span className="font-medium">{fighterData.coaches.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Email</span>
                <span className="font-medium">{fighterData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Phone</span>
                <span className="font-medium">{fighterData.phone}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
              <h4 className="font-medium text-[#111827] mb-3">Document Status</h4>
              <div className="space-y-2">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#10b981]">✓</span>
                      <span className="text-[#374151]">{doc.type}</span>
                    </div>
                    <span className="text-[#6b7280]">Exp: {doc.expires}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab("documents")}
                className="text-[#059669] hover:underline text-sm mt-3 inline-block"
              >
                View all documents
              </button>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Bio</h3>
            <p className="text-[#374151]">{fighterData.bio}</p>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">Medical & Compliance Documents</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium"
            >
              + Upload Document
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Document</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Expires</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Uploaded By</th>
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
                      <span className="font-medium text-[#111827]">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{doc.expires}</td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{doc.uploadedBy}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{doc.uploadedAt}</td>
                  <td className="px-4 py-3">
                    <button className="text-[#059669] hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === "training" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">Recent training sessions</p>
            <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
              + Log Session
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Duration</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {trainingLog.map((session) => (
                  <tr key={session.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3 text-sm font-medium text-[#111827]">{session.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#059669]/10 text-[#059669]">
                        {session.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{session.duration}</td>
                    <td className="px-4 py-3 text-sm text-[#6b7280]">{session.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[#374151]">{fight.event}</p>
                      <p className="text-xs text-[#6b7280]">{fight.promotion}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{fight.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Document Type</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Blood Test (HIV, Hep B/C)</option>
                  <option>Physical Examination</option>
                  <option>Eye Examination</option>
                  <option>MRI/CT Scan</option>
                  <option>EKG</option>
                  <option>Drug Test</option>
                  <option>Fight License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Expiration Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">File</label>
                <div className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-6 text-center">
                  <p className="text-sm text-[#6b7280]">Drag and drop or click to upload</p>
                  <p className="text-xs text-[#9ca3af] mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
