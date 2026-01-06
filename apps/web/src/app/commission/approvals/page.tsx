"use client";

import { useState } from "react";

// Mock pending approvals data
const mockApprovals = [
  {
    id: "1",
    fighter: { id: "DOEJ123456", name: "John Doe", record: "3-0" },
    documentType: "Blood Test",
    uploadedAt: "2 hours ago",
    confidence: 95,
    extractedData: {
      testDate: "2025-11-03",
      provider: "Quest Diagnostics",
      results: "Negative for HIV, Hepatitis B, Hepatitis C",
    },
    status: "pending",
  },
  {
    id: "2",
    fighter: { id: "SMITHJ789", name: "Jane Smith", record: "5-1" },
    documentType: "Physical Exam",
    uploadedAt: "5 hours ago",
    confidence: 88,
    extractedData: {
      testDate: "2025-10-28",
      provider: "Sports Medicine Clinic",
      results: "Cleared for competition",
    },
    status: "pending",
  },
  {
    id: "3",
    fighter: { id: "JONESM456", name: "Mike Jones", record: "2-2" },
    documentType: "Eye Exam",
    uploadedAt: "1 day ago",
    confidence: 72,
    extractedData: {
      testDate: "2025-10-15",
      provider: "Eye Care Associates",
      results: "20/20 vision both eyes",
    },
    status: "pending",
    flags: ["Low confidence - manual review recommended"],
  },
];

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const getColor = () => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getColor()}`}>
      {confidence}% confidence
    </span>
  );
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [selectedApproval, setSelectedApproval] = useState<typeof mockApprovals[0] | null>(null);

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
    );
    setSelectedApproval(null);
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
    );
    setSelectedApproval(null);
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827]">Document Approvals</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {pendingApprovals.length} pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pending List */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          <div className="p-4 border-b border-[#e5e7eb]">
            <h2 className="font-semibold text-[#111827]">Pending Review</h2>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {pendingApprovals.map((approval) => (
              <button
                key={approval.id}
                onClick={() => setSelectedApproval(approval)}
                className={`w-full p-4 text-left hover:bg-[#f9fafb] transition-colors ${
                  selectedApproval?.id === approval.id ? "bg-[#ebf5ff]" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#111827]">
                    {approval.fighter.name}
                  </span>
                  <ConfidenceBadge confidence={approval.confidence} />
                </div>
                <p className="text-sm text-[#6b7280]">
                  {approval.documentType} • {approval.uploadedAt}
                </p>
                {approval.flags && (
                  <div className="mt-2">
                    {approval.flags.map((flag, i) => (
                      <span
                        key={i}
                        className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded"
                      >
                        ⚠️ {flag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
          {pendingApprovals.length === 0 && (
            <div className="p-8 text-center text-[#6b7280]">
              No pending approvals
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-white rounded-xl border border-[#e5e7eb]">
          {selectedApproval ? (
            <>
              <div className="p-4 border-b border-[#e5e7eb]">
                <h2 className="font-semibold text-[#111827]">Document Review</h2>
              </div>
              <div className="p-4 space-y-4">
                {/* Fighter Info */}
                <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                  <div className="w-12 h-12 bg-[#e5e7eb] rounded-full flex items-center justify-center">
                    <span className="font-medium text-[#6b7280]">
                      {selectedApproval.fighter.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">
                      {selectedApproval.fighter.name}
                    </p>
                    <p className="text-sm text-[#6b7280]">
                      {selectedApproval.fighter.id} • {selectedApproval.fighter.record}
                    </p>
                  </div>
                </div>

                {/* Document Type */}
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Document Type</p>
                  <p className="font-medium text-[#111827]">
                    {selectedApproval.documentType}
                  </p>
                </div>

                {/* AI Extracted Data */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#6b7280]">AI-Extracted Data</p>
                    <ConfidenceBadge confidence={selectedApproval.confidence} />
                  </div>
                  <div className="bg-[#f9fafb] rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6b7280]">Test Date:</span>
                      <span className="text-sm font-medium text-[#111827]">
                        {selectedApproval.extractedData.testDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6b7280]">Provider:</span>
                      <span className="text-sm font-medium text-[#111827]">
                        {selectedApproval.extractedData.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-[#6b7280]">Results:</span>
                      <p className="text-sm font-medium text-[#111827] mt-1">
                        {selectedApproval.extractedData.results}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Preview Placeholder */}
                <div>
                  <p className="text-sm text-[#6b7280] mb-2">Document Preview</p>
                  <div className="h-48 bg-[#f9fafb] rounded-lg border-2 border-dashed border-[#d1d5db] flex items-center justify-center">
                    <span className="text-[#6b7280]">📄 Document Preview</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="flex-1 px-4 py-3 bg-[#10b981] text-white font-medium rounded-lg hover:bg-[#059669] transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedApproval.id)}
                    className="flex-1 px-4 py-3 bg-[#ef4444] text-white font-medium rounded-lg hover:bg-[#dc2626] transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-[#6b7280]">
              Select a document to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
