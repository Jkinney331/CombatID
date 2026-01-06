"use client";

import { useState } from "react";

export default function GymSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "coaches" | "notifications">("profile");

  const coaches = [
    { id: 1, name: "Coach Dan", email: "dan@att.com", specialties: ["Wrestling", "MMA"], fighters: 8 },
    { id: 2, name: "Coach Maria", email: "maria@att.com", specialties: ["Striking", "Muay Thai"], fighters: 6 },
    { id: 3, name: "Coach Alex", email: "alex@att.com", specialties: ["BJJ", "Grappling"], fighters: 10 },
    { id: 4, name: "Coach Kim", email: "kim@att.com", specialties: ["Conditioning", "S&C"], fighters: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        <p className="text-[#6b7280]">Manage your gym settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "profile", label: "Gym Profile" },
            { id: "coaches", label: "Coaches" },
            { id: "notifications", label: "Notifications" },
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h3 className="font-semibold text-[#111827] mb-6">Gym Profile</h3>
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-[#f3f4f6] rounded-xl flex items-center justify-center">
              <span className="text-3xl">AT</span>
            </div>
            <div>
              <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
                Upload Logo
              </button>
              <p className="text-xs text-[#6b7280] mt-2">Recommended: 400x400px, PNG or JPG</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Gym Name</label>
              <input
                type="text"
                defaultValue="American Top Team"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Location</label>
              <input
                type="text"
                defaultValue="Miami, FL"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (305) 555-0100"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Email</label>
              <input
                type="email"
                defaultValue="info@att.com"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Website</label>
              <input
                type="url"
                defaultValue="https://americantopteam.com"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Disciplines</label>
              <input
                type="text"
                defaultValue="MMA, BJJ, Wrestling, Striking"
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#374151] mb-1">Description</label>
              <textarea
                defaultValue="American Top Team is one of the premier MMA training facilities in the world, home to multiple UFC champions and elite fighters."
                rows={3}
                className="w-full px-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e5e7eb] flex justify-end">
            <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Coaches Tab */}
      {activeTab === "coaches" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6b7280]">{coaches.length} coaches</p>
            <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
              + Add Coach
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Coach</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Specialties</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighters</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {coaches.map((coach) => (
                  <tr key={coach.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#059669]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#059669] font-medium">
                            {coach.name.split(" ")[1][0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{coach.name}</p>
                          <p className="text-xs text-[#6b7280]">{coach.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {coach.specialties.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-xs bg-[#f3f4f6] text-[#374151]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{coach.fighters} fighters</td>
                    <td className="px-4 py-3">
                      <button className="text-[#059669] hover:underline text-sm mr-3">Edit</button>
                      <button className="text-[#ef4444] hover:underline text-sm">Remove</button>
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
              { id: "document_expiring", label: "Document expiring", description: "When a fighter's medical document is expiring soon" },
              { id: "document_expired", label: "Document expired", description: "When a fighter's document has expired" },
              { id: "eligibility_change", label: "Eligibility changes", description: "When a fighter's eligibility status changes" },
              { id: "fight_offer", label: "Fight offer received", description: "When a promotion sends a fight offer" },
              { id: "contract_update", label: "Contract updates", description: "When there are updates to fighter contracts" },
              { id: "training_reminder", label: "Training reminders", description: "Daily training schedule reminders" },
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
            <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors font-medium">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
