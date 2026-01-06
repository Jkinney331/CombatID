"use client";

import { useState } from "react";

export default function PromotionSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "notifications" | "billing">("profile");

  const teamMembers = [
    { id: 1, name: "John Smith", email: "john@efl.com", role: "Owner", status: "active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@efl.com", role: "Admin", status: "active" },
    { id: 3, name: "Mike Williams", email: "mike@efl.com", role: "Matchmaker", status: "active" },
    { id: 4, name: "Emily Davis", email: "emily@efl.com", role: "Viewer", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500">Manage your organization settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a]">
        <div className="flex gap-6">
          {[
            { id: "profile", label: "Organization Profile" },
            { id: "team", label: "Team Members" },
            { id: "notifications", label: "Notifications" },
            { id: "billing", label: "Billing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#c5f82a] text-[#c5f82a]"
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
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
          <h3 className="font-semibold text-white mb-6">Organization Profile</h3>
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-[#252525] rounded-xl flex items-center justify-center">
              <span className="text-3xl text-gray-400">EF</span>
            </div>
            <div>
              <button className="px-4 py-2 bg-[#c5f82a] text-[#0f0f0f] rounded-lg hover:bg-[#d4f94d] transition-colors text-sm font-semibold">
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px, PNG or JPG</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="Elite Fight League"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Organization Type</label>
              <select className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]">
                <option>Promotion</option>
                <option>Event Organizer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input
                type="text"
                defaultValue="Las Vegas, NV"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
              <input
                type="url"
                defaultValue="https://efl.com"
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                defaultValue="Elite Fight League is a premier MMA promotion based in Las Vegas, featuring world-class fighters and exciting events."
                rows={3}
                className="w-full px-4 py-2.5 bg-[#252525] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a] flex justify-end">
            <button className="px-4 py-2 bg-[#c5f82a] text-[#0f0f0f] rounded-lg hover:bg-[#d4f94d] transition-colors font-semibold">
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
            <button className="px-4 py-2 bg-[#c5f82a] text-[#0f0f0f] rounded-lg hover:bg-[#d4f94d] transition-colors text-sm font-semibold">
              + Invite Member
            </button>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
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
                        <div className="w-10 h-10 bg-[#c5f82a]/20 rounded-full flex items-center justify-center">
                          <span className="text-[#c5f82a] font-medium text-sm">
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
                        <option>Owner</option>
                        <option>Admin</option>
                        <option>Matchmaker</option>
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
                      {member.role !== "Owner" && (
                        <button className="text-[#ef4444] hover:underline text-sm">Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
          <h3 className="font-semibold text-white mb-6">Notification Preferences</h3>
          <div className="space-y-6">
            {[
              { id: "contract_signed", label: "Contract signed", description: "When a fighter signs a contract or bout agreement" },
              { id: "event_approved", label: "Event approved", description: "When a commission approves your event" },
              { id: "fighter_eligible", label: "Fighter eligibility changes", description: "When a rostered fighter's eligibility status changes" },
              { id: "document_expiring", label: "Document expiring", description: "When a fighter's medical document is expiring soon" },
              { id: "roster_invitation", label: "Roster invitation response", description: "When a fighter responds to a roster invitation" },
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
                    Push
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#2a2a2a] flex justify-end">
            <button className="px-4 py-2 bg-[#c5f82a] text-[#0f0f0f] rounded-lg hover:bg-[#d4f94d] transition-colors font-semibold">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Current Plan</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#c5f82a]/20 text-[#c5f82a]">
                Pro
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500">Monthly Price</p>
                <p className="text-2xl font-bold text-white">$299</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Roster Limit</p>
                <p className="text-2xl font-bold text-white">50</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Events/Year</p>
                <p className="text-2xl font-bold text-white">Unlimited</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-[#2a2a2a] text-white rounded-lg hover:bg-[#252525] transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
            <h3 className="font-semibold text-white mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-[#2a2a2a] rounded-xl">
              <div className="w-12 h-8 bg-[#1a1f71] rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium text-white">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
              <button className="ml-auto text-[#c5f82a] hover:underline text-sm font-medium">Edit</button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
            <h3 className="font-semibold text-white mb-4">Billing History</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {[
                  { date: "Jan 1, 2024", description: "Pro Plan - Monthly", amount: "$299.00" },
                  { date: "Dec 1, 2023", description: "Pro Plan - Monthly", amount: "$299.00" },
                  { date: "Nov 1, 2023", description: "Pro Plan - Monthly", amount: "$299.00" },
                ].map((invoice, i) => (
                  <tr key={i}>
                    <td className="py-3 text-sm text-gray-400">{invoice.date}</td>
                    <td className="py-3 text-sm text-gray-400">{invoice.description}</td>
                    <td className="py-3 text-sm font-medium text-white">{invoice.amount}</td>
                    <td className="py-3">
                      <button className="text-[#c5f82a] hover:underline text-sm font-medium">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
