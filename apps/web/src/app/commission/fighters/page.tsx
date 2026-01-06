"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, SearchInput, Select, Badge, Avatar, Button, NoResultsState, PillTabs } from "@/components/ui";

// Mock data
const mockFighters = [
  { id: "DOEJ123456", name: "John Doe", record: "3-0", gym: "ATT", country: "USA", status: "eligible", disciplines: ["MMA", "Kickboxing"], lastActive: "2 days ago" },
  { id: "JOHNSONJ789", name: "Jake Johnson", record: "2-0", gym: "CKB", country: "NZL", status: "pending", disciplines: ["MMA"], lastActive: "1 week ago" },
  { id: "SANTOSC456", name: "Carlos Santos", record: "5-2", gym: "KC", country: "USA", status: "suspended", disciplines: ["MMA", "Boxing"], lastActive: "3 days ago" },
  { id: "MARTINJ321", name: "James Martin", record: "3-3", gym: "ATT", country: "JPN", status: "ineligible", disciplines: ["MMA"], lastActive: "2 weeks ago" },
  { id: "MILLK654", name: "Kevin Mill", record: "15-3", gym: "CDB", country: "BRA", status: "active", disciplines: ["MMA", "BJJ"], lastActive: "5 hours ago" },
  { id: "WOWY987", name: "William Owy", record: "7-1", gym: "GYM", country: "DAG", status: "eligible", disciplines: ["MMA"], lastActive: "1 day ago" },
];

type FighterStatus = "eligible" | "pending" | "suspended" | "ineligible" | "active";

const statusConfig: Record<FighterStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  eligible: { label: "Ready To Fight", variant: "success" },
  pending: { label: "Pending Review", variant: "warning" },
  suspended: { label: "Medical Suspension", variant: "danger" },
  ineligible: { label: "Ineligible", variant: "danger" },
  active: { label: "Contracted", variant: "info" },
};

const statusTabs = [
  { value: "all", label: "All", count: mockFighters.length },
  { value: "eligible", label: "Fight Ready", count: mockFighters.filter(f => f.status === "eligible").length },
  { value: "pending", label: "Pending", count: mockFighters.filter(f => f.status === "pending").length },
  { value: "suspended", label: "Suspended", count: mockFighters.filter(f => f.status === "suspended").length },
];

export default function FightersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredFighters = mockFighters.filter((fighter) => {
    const matchesSearch =
      fighter.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline =
      disciplineFilter === "all" || fighter.disciplines.includes(disciplineFilter);
    const matchesStatus =
      statusFilter === "all" || fighter.status === statusFilter;
    return matchesSearch && matchesDiscipline && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fighter Registry</h1>
          <p className="text-gray-500 text-sm mt-1">
            Viewing fighters for <span className="font-medium text-white">Nevada Athletic Commission</span>
          </p>
        </div>
        <Button
          variant="primary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Register Fighter
        </Button>
      </div>

      {/* Status Tabs */}
      <PillTabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by CombatID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            options={[
              { value: "all", label: "All Disciplines" },
              { value: "MMA", label: "MMA" },
              { value: "Boxing", label: "Boxing" },
              { value: "Kickboxing", label: "Kickboxing" },
              { value: "BJJ", label: "BJJ" },
            ]}
            className="sm:w-48"
          />
        </div>
      </Card>

      {/* Fighters List */}
      <Card>
        <CardHeader
          title="Fighters"
          subtitle={`${filteredFighters.length} fighter${filteredFighters.length !== 1 ? "s" : ""} found`}
        />
        {filteredFighters.length === 0 ? (
          <NoResultsState searchTerm={searchQuery || undefined} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#151515]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fighter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    CombatID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gym
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filteredFighters.map((fighter) => {
                  const status = statusConfig[fighter.status as FighterStatus];
                  return (
                    <tr key={fighter.id} className="hover:bg-[#252525] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar alt={fighter.name} size="md" />
                          <div>
                            <p className="font-medium text-white group-hover:text-[#3b82f6] transition-colors">
                              {fighter.name}
                            </p>
                            <p className="text-sm text-gray-500">{fighter.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-400 bg-[#252525] px-2 py-0.5 rounded">
                          {fighter.id}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-white">{fighter.record}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-400">{fighter.gym}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={status.variant} dot>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{fighter.lastActive}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" href={`/commission/fighters/${fighter.id}`}>
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Documents
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-white">{mockFighters.length}</p>
          <p className="text-sm text-gray-500">Total Fighters</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-[#22c55e]">
            {mockFighters.filter((f) => f.status === "eligible").length}
          </p>
          <p className="text-sm text-gray-500">Fight Ready</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-[#f59e0b]">
            {mockFighters.filter((f) => f.status === "pending").length}
          </p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-[#ef4444]">
            {mockFighters.filter((f) => f.status === "suspended" || f.status === "ineligible").length}
          </p>
          <p className="text-sm text-gray-500">Action Needed</p>
        </div>
      </div>
    </div>
  );
}
