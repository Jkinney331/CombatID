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
        <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        <p className="text-[#6b7280]">Manage your organization settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
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
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-6">Organization Profile</h3>
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-[#f3f4f6] rounded-xl flex items-center justify-center">
              <span className="text-3xl">EF</span>
            </div>
            <div>
              <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
                Upload Logo
              </button>
              <p className="text-xs text-[#6b7280] mt-2">Recommended: 400x400px, PNG or JPG</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="Elite Fight League"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Organization Type</label>
              <select className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white">
                <option>Promotion</option>
                <option>Event Organizer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Location</label>
              <input
                type="text"
                defaultValue="Las Vegas, NV"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Website</label>
              <input
                type="url"
                defaultValue="https://efl.com"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
              <textarea
                defaultValue="Elite Fight League is a premier MMA promotion based in Las Vegas, featuring world-class fighters and exciting events."
                rows={3}
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex justify-end">
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">{teamMembers.length} team members</p>
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium">
              + Invite Member
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Member</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Role</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#7C3AED] font-medium">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{member.name}</p>
                          <p className="text-xs text-[#6b7280]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={member.role}
                        className="px-3 py-1 border border-[#e5e7eb] rounded-lg text-sm bg-white"
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
                            ? "bg-[#dcfce7] text-[#166534]"
                            : "bg-[#fef3c7] text-[#92400e]"
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
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-6">Notification Preferences</h3>
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
                  <p className="font-medium text-[#111827]">{pref.label}</p>
                  <p className="text-sm text-[#6b7280]">{pref.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Push
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex justify-end">
            <button className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors font-medium">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Current Plan</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#7C3AED]/10 text-[#7C3AED]">
                Pro
              </span>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-[#6b7280]">Monthly Price</p>
                <p className="text-2xl font-bold text-[#111827]">$299</p>
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Roster Limit</p>
                <p className="text-2xl font-bold text-[#111827]">50</p>
              </div>
              <div>
                <p className="text-sm text-[#6b7280]">Events/Year</p>
                <p className="text-2xl font-bold text-[#111827]">Unlimited</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-[#e5e7eb] rounded-lg">
              <div className="w-12 h-8 bg-[#1a1f71] rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium text-[#111827]">Visa ending in 4242</p>
                <p className="text-sm text-[#6b7280]">Expires 12/25</p>
              </div>
              <button className="ml-auto text-[#7C3AED] hover:underline text-sm">Edit</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="font-semibold text-[#111827] mb-4">Billing History</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-2 text-sm font-medium text-[#6b7280]">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-[#6b7280]">Description</th>
                  <th className="text-left py-2 text-sm font-medium text-[#6b7280]">Amount</th>
                  <th className="text-left py-2 text-sm font-medium text-[#6b7280]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {[
                  { date: "Jan 1, 2024", description: "Pro Plan - Monthly", amount: "$299.00" },
                  { date: "Dec 1, 2023", description: "Pro Plan - Monthly", amount: "$299.00" },
                  { date: "Nov 1, 2023", description: "Pro Plan - Monthly", amount: "$299.00" },
                ].map((invoice, i) => (
                  <tr key={i}>
                    <td className="py-3 text-sm text-[#374151]">{invoice.date}</td>
                    <td className="py-3 text-sm text-[#374151]">{invoice.description}</td>
                    <td className="py-3 text-sm font-medium text-[#111827]">{invoice.amount}</td>
                    <td className="py-3">
                      <button className="text-[#7C3AED] hover:underline text-sm">Download</button>
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
