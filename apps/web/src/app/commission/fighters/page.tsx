"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data
const mockFighters = [
  { id: "DOEJ123456", name: "John Doe", record: "3-0", gym: "ATT", country: "USA", status: "Ready To Fight", disciplines: ["MMA", "Kickboxing"] },
  { id: "JOHNSONJ789", name: "Jake Johnson", record: "2-0", gym: "CKB", country: "NZL", status: "Able to Train", disciplines: ["MMA"] },
  { id: "SANTOSC456", name: "Carlos Santos", record: "5-2", gym: "KC", country: "USA", status: "Medical Suspension", disciplines: ["MMA", "Boxing"] },
  { id: "MARTINJ321", name: "James Martin", record: "3-3", gym: "ATT", country: "JPN", status: "Ineligible", disciplines: ["MMA"] },
  { id: "MILLK654", name: "Kevin Mill", record: "15-3", gym: "CDB", country: "BRA", status: "Contracted", disciplines: ["MMA", "BJJ"] },
  { id: "WOWY987", name: "William Owy", record: "7-1", gym: "GYM", country: "DAG", status: "Ready To Fight", disciplines: ["MMA"] },
];

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status) {
      case "Ready To Fight":
        return "bg-green-100 text-green-800";
      case "Able to Train":
        return "bg-yellow-100 text-yellow-800";
      case "Medical Suspension":
        return "bg-red-100 text-red-800";
      case "Ineligible":
        return "bg-red-100 text-red-800";
      case "Contracted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
}

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827]">Fighter Search</h1>
        <p className="text-[#6b7280]">
          RESULTS FOR: <span className="font-medium text-[#111827]">NEVADA, MMA, WELTERWEIGHT</span>
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by CombatID or name..."
              className="w-full px-4 py-2 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
          >
            <option value="all">All Disciplines</option>
            <option value="MMA">MMA</option>
            <option value="Boxing">Boxing</option>
            <option value="Kickboxing">Kickboxing</option>
            <option value="BJJ">BJJ</option>
          </select>
          <select
            className="px-4 py-2 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Ready To Fight">Ready To Fight</option>
            <option value="Able to Train">Able to Train</option>
            <option value="Medical Suspension">Medical Suspension</option>
            <option value="Ineligible">Ineligible</option>
          </select>
        </div>
      </div>

      {/* Fighters List */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                Fighter
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                CombatID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                Gym
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {filteredFighters.map((fighter) => (
              <tr key={fighter.id} className="hover:bg-[#f9fafb]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#e5e7eb] rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-[#6b7280]">
                        {fighter.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{fighter.name}</p>
                      <p className="text-sm text-[#6b7280]">{fighter.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm text-[#111827]">{fighter.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-[#111827]">{fighter.record}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[#6b7280]">{fighter.gym}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={fighter.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link href={`/commission/fighters/${fighter.id}`} className="text-[#2563EB] hover:text-[#1d4ed8] font-medium text-sm">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFighters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#6b7280]">No fighters found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
