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
    if (confidence >= 90) return "bg-[#22c55e]/20 text-[#22c55e]";
    if (confidence >= 75) return "bg-[#f59e0b]/20 text-[#f59e0b]";
    return "bg-[#ef4444]/20 text-[#ef4444]";
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
        <h1 className="text-2xl font-bold text-white">Document Approvals</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] rounded-full text-sm font-medium">
            {pendingApprovals.length} pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pending List */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="font-semibold text-white">Pending Review</h2>
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {pendingApprovals.map((approval) => (
              <button
                key={approval.id}
                onClick={() => setSelectedApproval(approval)}
                className={`w-full p-4 text-left hover:bg-[#252525] transition-colors ${
                  selectedApproval?.id === approval.id ? "bg-[#3b82f6]/10" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">
                    {approval.fighter.name}
                  </span>
                  <ConfidenceBadge confidence={approval.confidence} />
                </div>
                <p className="text-sm text-gray-500">
                  {approval.documentType} • {approval.uploadedAt}
                </p>
                {approval.flags && (
                  <div className="mt-2">
                    {approval.flags.map((flag, i) => (
                      <span
                        key={i}
                        className="text-xs text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded"
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
            <div className="p-8 text-center text-gray-500">
              No pending approvals
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          {selectedApproval ? (
            <>
              <div className="p-4 border-b border-[#2a2a2a]">
                <h2 className="font-semibold text-white">Document Review</h2>
              </div>
              <div className="p-4 space-y-4">
                {/* Fighter Info */}
                <div className="flex items-center gap-3 p-3 bg-[#252525] rounded-lg">
                  <div className="w-12 h-12 bg-[#3a3a3a] rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-400">
                      {selectedApproval.fighter.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {selectedApproval.fighter.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedApproval.fighter.id} • {selectedApproval.fighter.record}
                    </p>
                  </div>
                </div>

                {/* Document Type */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Document Type</p>
                  <p className="font-medium text-white">
                    {selectedApproval.documentType}
                  </p>
                </div>

                {/* AI Extracted Data */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">AI-Extracted Data</p>
                    <ConfidenceBadge confidence={selectedApproval.confidence} />
                  </div>
                  <div className="bg-[#252525] rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Test Date:</span>
                      <span className="text-sm font-medium text-white">
                        {selectedApproval.extractedData.testDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Provider:</span>
                      <span className="text-sm font-medium text-white">
                        {selectedApproval.extractedData.provider}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Results:</span>
                      <p className="text-sm font-medium text-white mt-1">
                        {selectedApproval.extractedData.results}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Preview Placeholder */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">Document Preview</p>
                  <div className="h-48 bg-[#252525] rounded-lg border-2 border-dashed border-[#3a3a3a] flex items-center justify-center">
                    <span className="text-gray-500">📄 Document Preview</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedApproval.id)}
                    className="flex-1 px-4 py-3 bg-[#22c55e] text-white font-medium rounded-lg hover:bg-[#16a34a] transition-colors"
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
            <div className="p-8 text-center text-gray-500">
              Select a document to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
