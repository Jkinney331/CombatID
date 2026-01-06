"use client";

import Link from "next/link";
import { useState } from "react";

const trainingSchedule = [
  { id: 1, time: "6:00 AM", type: "Open Mat", coach: "Coach Dan", fighters: 8 },
  { id: 2, time: "9:00 AM", type: "Striking", coach: "Coach Maria", fighters: 12 },
  { id: 3, time: "11:00 AM", type: "Wrestling", coach: "Coach Dan", fighters: 6 },
  { id: 4, time: "2:00 PM", type: "BJJ", coach: "Coach Alex", fighters: 10 },
  { id: 5, time: "4:00 PM", type: "MMA Sparring", coach: "Coach Dan", fighters: 8 },
  { id: 6, time: "6:00 PM", type: "Conditioning", coach: "Coach Kim", fighters: 15 },
];

const fightCamps = [
  {
    id: 1,
    fighter: "Marcus Rivera",
    opponent: "Jake Thompson",
    event: "EFL Fight Night 47",
    date: "Feb 15, 2024",
    weeksOut: 3,
    status: "active",
    phase: "Peak",
    coaches: ["Coach Dan", "Coach Maria"],
  },
  {
    id: 2,
    fighter: "Sarah Chen",
    opponent: "Ana Rodriguez",
    event: "EFL Fight Night 47",
    date: "Feb 15, 2024",
    weeksOut: 3,
    status: "active",
    phase: "Peak",
    coaches: ["Coach Alex", "Coach Maria"],
  },
  {
    id: 3,
    fighter: "Mike Johnson",
    opponent: "Carlos Santos",
    event: "EFL Fight Night 47",
    date: "Feb 15, 2024",
    weeksOut: 3,
    status: "active",
    phase: "Peak",
    coaches: ["Coach Dan"],
  },
];

const recentSessions = [
  { id: 1, fighterId: "f1", fighter: "Marcus Rivera", type: "Wrestling", duration: "90 min", date: "Today", notes: "Takedown defense" },
  { id: 2, fighterId: "f2", fighter: "Sarah Chen", type: "Striking", duration: "60 min", date: "Today", notes: "Footwork drills" },
  { id: 3, fighterId: "f3", fighter: "Mike Johnson", type: "BJJ", duration: "75 min", date: "Yesterday", notes: "Guard passing" },
  { id: 4, fighterId: "f4", fighter: "David Lee", type: "MMA", duration: "90 min", date: "Yesterday", notes: "Full sparring" },
];

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "camps" | "log">("schedule");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showLogModal, setShowLogModal] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Training</h1>
          <p className="text-[#6b7280]">Manage schedules and fight camps</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-[#059669] text-white px-4 py-2 rounded-lg hover:bg-[#047857] transition-colors font-medium"
        >
          + Log Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Active Fight Camps</p>
          <p className="text-2xl font-bold text-[#111827]">{fightCamps.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Sessions This Week</p>
          <p className="text-2xl font-bold text-[#111827]">42</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Active Fighters</p>
          <p className="text-2xl font-bold text-[#111827]">18</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm">Coaches</p>
          <p className="text-2xl font-bold text-[#111827]">5</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "schedule", label: "Daily Schedule" },
            { id: "camps", label: "Fight Camps" },
            { id: "log", label: "Training Log" },
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

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? "bg-[#059669] text-white"
                    : "bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="bg-white rounded-xl border border-[#e5e7eb]">
            <div className="p-4 border-b border-[#e5e7eb]">
              <h3 className="font-semibold text-[#111827]">{selectedDay} Schedule</h3>
            </div>
            <div className="divide-y divide-[#e5e7eb]">
              {trainingSchedule.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-[#6b7280]">{session.time}</div>
                    <div className="w-12 h-12 bg-[#059669]/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🥊</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{session.type}</p>
                      <p className="text-sm text-[#6b7280]">{session.coach}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#111827]">{session.fighters} fighters</p>
                    </div>
                    <button className="text-[#059669] hover:underline text-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fight Camps Tab */}
      {activeTab === "camps" && (
        <div className="space-y-4">
          {fightCamps.map((camp) => (
            <div key={camp.id} className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[#111827]">{camp.fighter}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#059669]/10 text-[#059669]">
                      {camp.phase}
                    </span>
                  </div>
                  <p className="text-sm text-[#6b7280] mt-1">vs {camp.opponent}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#111827]">{camp.weeksOut} weeks out</p>
                  <p className="text-sm text-[#6b7280]">{camp.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Event</p>
                  <p className="font-medium text-[#111827]">{camp.event}</p>
                </div>
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Coaches</p>
                  <p className="font-medium text-[#111827]">{camp.coaches.join(", ")}</p>
                </div>
                <div className="p-3 bg-[#f9fafb] rounded-lg">
                  <p className="text-xs text-[#6b7280]">Status</p>
                  <p className="font-medium text-[#10b981] capitalize">{camp.status}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors text-sm font-medium">
                  View Schedule
                </button>
                <button className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium">
                  Log Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Training Log Tab */}
      {activeTab === "log" && (
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">Recent Training Sessions</h3>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors text-sm font-medium"
            >
              + Log Session
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Fighter</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Duration</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#6b7280]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {recentSessions.map((session) => (
                <tr key={session.id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <Link href={`/gym/fighters/${session.fighterId}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f3f4f6] rounded-full flex items-center justify-center">
                        <span>👤</span>
                      </div>
                      <span className="font-medium text-[#111827]">{session.fighter}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#059669]/10 text-[#059669]">
                      {session.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#374151]">{session.duration}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{session.date}</td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">{session.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Log Training Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Fighter</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Select fighter...</option>
                  <option>Marcus Rivera</option>
                  <option>Sarah Chen</option>
                  <option>Mike Johnson</option>
                  <option>David Lee</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Training Type</label>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                  <option>Striking</option>
                  <option>Wrestling</option>
                  <option>BJJ</option>
                  <option>MMA</option>
                  <option>Conditioning</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Duration</label>
                  <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg">
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>60 min</option>
                    <option>75 min</option>
                    <option>90 min</option>
                    <option>120 min</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Notes</label>
                <textarea
                  placeholder="Session notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors"
              >
                Log Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
