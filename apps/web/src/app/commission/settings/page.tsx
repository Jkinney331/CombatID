"use client";

import { useState } from "react";

export default function CommissionSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "rulesets" | "notifications">("profile");

  const teamMembers = [
    { id: 1, name: "John Smith", email: "john.smith@nac.gov", role: "Administrator", status: "active" },
    { id: 2, name: "Mary Johnson", email: "mary.johnson@nac.gov", role: "Document Reviewer", status: "active" },
    { id: 3, name: "James Williams", email: "james.williams@nac.gov", role: "Event Inspector", status: "active" },
    { id: 4, name: "Sarah Davis", email: "sarah.davis@nac.gov", role: "Viewer", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500">Manage commission settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a]">
        <div className="flex gap-6">
          {[
            { id: "profile", label: "Commission Profile" },
            { id: "team", label: "Team Members" },
            { id: "rulesets", label: "Default Rulesets" },
            { id: "notifications", label: "Notifications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#3b82f6] text-[#3b82f6]"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
          <h3 className="font-semibold text-white mb-6">Commission Information</h3>
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-[#3b82f6]/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#3b82f6]">NAC</span>
            </div>
            <div>
              <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm font-medium">
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px, PNG or JPG</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Commission Name</label>
              <input
                type="text"
                defaultValue="Nevada Athletic Commission"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Jurisdiction</label>
              <input
                type="text"
                defaultValue="State of Nevada"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
              <input
                type="text"
                defaultValue="555 E. Washington Ave., Suite 3200"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">City, State ZIP</label>
              <input
                type="text"
                defaultValue="Las Vegas, NV 89101"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                defaultValue="(702) 486-2575"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                defaultValue="info@nac.gov"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
              <input
                type="url"
                defaultValue="https://boxing.nv.gov"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Executive Director</label>
              <input
                type="text"
                defaultValue="John Smith"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a] flex justify-end">
            <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{teamMembers.length} team members</p>
            <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm font-medium">
              + Invite Member
            </button>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#151515]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Member</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3b82f6]/20 rounded-full flex items-center justify-center">
                          <span className="text-[#3b82f6] font-medium text-sm">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={member.role}
                        className="px-3 py-1 bg-[#252525] border border-[#2a2a2a] rounded-lg text-sm text-white"
                      >
                        <option>Administrator</option>
                        <option>Document Reviewer</option>
                        <option>Event Inspector</option>
                        <option>Viewer</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === "active"
                            ? "bg-[#22c55e]/20 text-[#22c55e]"
                            : "bg-[#f59e0b]/20 text-[#f59e0b]"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-[#ef4444] hover:underline text-sm">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rulesets Tab */}
      {activeTab === "rulesets" && (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
          <h3 className="font-semibold text-white mb-4">Default Document Requirements</h3>
          <p className="text-sm text-gray-500 mb-6">
            Configure the default medical requirements for each discipline. These can be overridden on a per-event basis.
          </p>
          <div className="space-y-6">
            {[
              {
                discipline: "MMA",
                requirements: [
                  { name: "Blood Test (HIV, Hep B/C)", validity: "6 months", required: true },
                  { name: "Physical Examination", validity: "12 months", required: true },
                  { name: "Eye Examination", validity: "12 months", required: true },
                  { name: "MRI/CT Scan", validity: "24 months", required: true },
                  { name: "EKG (if over 40)", validity: "12 months", required: false },
                ],
              },
              {
                discipline: "Boxing",
                requirements: [
                  { name: "Blood Test (HIV, Hep B/C)", validity: "6 months", required: true },
                  { name: "Physical Examination", validity: "12 months", required: true },
                  { name: "Eye Examination", validity: "12 months", required: true },
                  { name: "MRI/CT Scan", validity: "12 months", required: true },
                  { name: "EKG (if over 35)", validity: "12 months", required: true },
                ],
              },
            ].map((disc) => (
              <div key={disc.discipline} className="border border-[#2a2a2a] rounded-lg p-4">
                <h4 className="font-medium text-white mb-3">{disc.discipline}</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="text-left py-2 text-gray-500">Requirement</th>
                      <th className="text-left py-2 text-gray-500">Validity Period</th>
                      <th className="text-left py-2 text-gray-500">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {disc.requirements.map((req) => (
                      <tr key={req.name}>
                        <td className="py-2 text-gray-300">{req.name}</td>
                        <td className="py-2 text-gray-400">{req.validity}</td>
                        <td className="py-2">
                          <input type="checkbox" defaultChecked={req.required} className="rounded bg-[#252525] border-[#2a2a2a]" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a] flex justify-end">
            <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium">
              Save Rulesets
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
          <h3 className="font-semibold text-white mb-6">Notification Preferences</h3>
          <div className="space-y-6">
            {[
              { id: "event_submitted", label: "Event submitted for approval", description: "When a promotion submits a new event" },
              { id: "document_uploaded", label: "Document uploaded", description: "When a fighter uploads a new document" },
              { id: "fighter_registered", label: "Fighter registered", description: "When a new fighter registers in your jurisdiction" },
              { id: "document_expiring", label: "Document expiring", description: "When a fighter's document is expiring within 30 days" },
              { id: "bout_eligibility", label: "Bout eligibility issue", description: "When a fighter on a fight card has eligibility issues" },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{pref.label}</p>
                  <p className="text-sm text-gray-500">{pref.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" defaultChecked className="rounded bg-[#252525] border-[#2a2a2a]" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" defaultChecked className="rounded bg-[#252525] border-[#2a2a2a]" />
                    Dashboard
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a] flex justify-end">
            <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
