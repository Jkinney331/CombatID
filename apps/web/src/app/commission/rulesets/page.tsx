"use client";

import { useState } from "react";

// Mock ruleset data
const mockRulesets = [
  {
    id: "1",
    discipline: "Pro MMA",
    requirements: [
      { id: "r1", name: "Valid Licensing Physical", required: true },
      { id: "r2", name: "Negative Blood Tests", required: true, description: "HIV test (less than 6 months old), Hepatitis B sAg (Surface Antigen) and Hepatitis C tests (less than 1 year old)" },
      { id: "r3", name: "Valid Federal Boxing ID Card", required: true },
      { id: "r4", name: "Valid Mixed Martial Arts National ID", required: true },
    ],
  },
  {
    id: "2",
    discipline: "Pro Boxing",
    requirements: [
      { id: "r1", name: "Valid Licensing Physical", required: true },
      { id: "r2", name: "Negative Blood Tests", required: true },
      { id: "r3", name: "Valid Federal Boxing ID Card", required: true },
      { id: "r4", name: "Eye Examination", required: true },
      { id: "r5", name: "EKG (for fighters over 35)", required: false },
    ],
  },
  {
    id: "3",
    discipline: "Amateur MMA",
    requirements: [
      { id: "r1", name: "Valid Licensing Physical", required: true },
      { id: "r2", name: "Negative Blood Tests", required: true },
      { id: "r3", name: "Amateur License Registration", required: true },
    ],
  },
];

export default function RulesetsPage() {
  const [selectedRuleset, setSelectedRuleset] = useState(mockRulesets[0]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827]">Medical Requirements by Discipline</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Discipline List */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h2 className="font-semibold text-[#111827]">Disciplines</h2>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {mockRulesets.map((ruleset) => (
              <button
                key={ruleset.id}
                onClick={() => setSelectedRuleset(ruleset)}
                className={`w-full p-4 text-left transition-colors ${
                  selectedRuleset.id === ruleset.id
                    ? "bg-[#ebf5ff] border-l-4 border-[#2563EB]"
                    : "hover:bg-[#f9fafb]"
                }`}
              >
                <p className={`font-medium ${
                  selectedRuleset.id === ruleset.id ? "text-[#2563EB]" : "text-[#111827]"
                }`}>
                  {ruleset.discipline}
                </p>
                <p className="text-sm text-[#6b7280]">
                  {ruleset.requirements.length} requirements
                </p>
              </button>
            ))}
          </div>
          <div className="p-4">
            <button className="w-full px-4 py-2 border border-dashed border-[#d1d5db] rounded-lg text-[#6b7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
              + Add Discipline
            </button>
          </div>
        </div>

        {/* Requirements Detail */}
        <div className="col-span-2 bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb] flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-[#111827]">Current {selectedRuleset.discipline} Requirements</h2>
              <p className="text-sm text-[#6b7280]">Nevada Athletic Commission</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isEditing
                  ? "bg-[#10b981] text-white hover:bg-[#059669]"
                  : "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
              }`}
            >
              {isEditing ? "Save Changes" : "Edit Requirements"}
            </button>
          </div>

          <div className="p-4 space-y-4">
            {selectedRuleset.requirements.map((req, index) => (
              <div
                key={req.id}
                className="p-4 border border-[#e5e7eb] rounded-lg hover:border-[#2563EB] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      req.required ? "bg-[#2563EB] text-white" : "bg-[#e5e7eb] text-[#6b7280]"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{req.name}</p>
                      {req.description && (
                        <p className="text-sm text-[#6b7280] mt-1">{req.description}</p>
                      )}
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                        req.required
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {req.required ? "Required" : "Optional"}
                      </span>
                    </div>
                  </div>
                  {isEditing && (
                    <button className="text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isEditing && (
              <button className="w-full p-4 border border-dashed border-[#d1d5db] rounded-lg text-[#6b7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                + Add Requirement
              </button>
            )}
          </div>

          <div className="p-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
            <p className="text-sm text-[#6b7280]">
              Last updated: January 1, 2026 • Version 2.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
