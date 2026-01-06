"use client";

import Link from "next/link";
import { useState } from "react";

const events = [
  {
    id: "1",
    name: "EFL Fight Night 47",
    date: "2024-02-15",
    venue: "MGM Grand Garden Arena",
    location: "Las Vegas, NV",
    status: "approved",
    bouts: 12,
    ticketsSold: 8500,
    capacity: 12000,
    commission: "Nevada Athletic Commission",
  },
  {
    id: "2",
    name: "EFL Championship Series",
    date: "2024-03-22",
    venue: "T-Mobile Arena",
    location: "Las Vegas, NV",
    status: "submitted",
    bouts: 14,
    ticketsSold: 0,
    capacity: 20000,
    commission: "Nevada Athletic Commission",
  },
  {
    id: "3",
    name: "EFL Contender Series 8",
    date: "2024-04-05",
    venue: "UFC Apex",
    location: "Las Vegas, NV",
    status: "draft",
    bouts: 6,
    ticketsSold: 0,
    capacity: 1000,
    commission: "Nevada Athletic Commission",
  },
  {
    id: "4",
    name: "EFL Fight Night 46",
    date: "2024-01-20",
    venue: "Mandalay Bay Events Center",
    location: "Las Vegas, NV",
    status: "completed",
    bouts: 11,
    ticketsSold: 9200,
    capacity: 12000,
    commission: "Nevada Athletic Commission",
  },
  {
    id: "5",
    name: "EFL New Year's Clash",
    date: "2024-01-06",
    venue: "MGM Grand Garden Arena",
    location: "Las Vegas, NV",
    status: "completed",
    bouts: 13,
    ticketsSold: 11500,
    capacity: 12000,
    commission: "Nevada Athletic Commission",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-[#22c55e]/20", text: "text-[#22c55e]" },
  submitted: { bg: "bg-[#f59e0b]/20", text: "text-[#f59e0b]" },
  draft: { bg: "bg-[#6b7280]/20", text: "text-[#9ca3af]" },
  completed: { bg: "bg-[#3b82f6]/20", text: "text-[#3b82f6]" },
};

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(
    (e) => e.status !== "completed"
  );
  const pastEvents = filteredEvents.filter((e) => e.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-gray-500">Manage your fight events and cards</p>
        </div>
        <Link
          href="/promotion/events/new"
          className="bg-[#c5f82a] text-[#0f0f0f] px-4 py-2 rounded-lg hover:bg-[#d4f94d] transition-colors font-semibold"
        >
          + Create Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c5f82a] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#c5f82a]"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="font-semibold text-white">Upcoming Events</h2>
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/promotion/events/${event.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#252525] transition-colors block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#c5f82a]/10 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-[#c5f82a] font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold text-[#c5f82a]">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {event.venue} • {event.location}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{event.commission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{event.bouts}</p>
                    <p className="text-xs text-gray-500">Bouts</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status].bg} ${statusColors[event.status].text}`}
                  >
                    {event.status}
                  </span>
                  <span className="text-gray-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="font-semibold text-white">Past Events</h2>
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {pastEvents.map((event) => (
              <Link
                key={event.id}
                href={`/promotion/events/${event.id}`}
                className="p-4 flex items-center justify-between hover:bg-[#252525] transition-colors block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#252525] rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-xl font-bold text-gray-400">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {event.venue} • {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{event.bouts}</p>
                    <p className="text-xs text-gray-500">Bouts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">
                      {Math.round((event.ticketsSold / event.capacity) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">Sold</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status].bg} ${statusColors[event.status].text}`}
                  >
                    {event.status}
                  </span>
                  <span className="text-gray-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
