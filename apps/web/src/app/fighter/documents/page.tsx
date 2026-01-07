"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";

// Mock documents data
const mockDocuments = [
  {
    id: "1",
    type: "PHYSICAL_EXAM",
    name: "Annual Physical Examination",
    status: "APPROVED",
    uploadedAt: "2025-08-15",
    expiresAt: "2026-08-15",
    reviewedBy: "Dr. Smith, Nevada AC",
  },
  {
    id: "2",
    type: "HIV_TEST",
    name: "HIV Test (Negative)",
    status: "APPROVED",
    uploadedAt: "2025-10-01",
    expiresAt: "2026-04-01",
    reviewedBy: "LabCorp",
  },
  {
    id: "3",
    type: "HEPATITIS_B_TEST",
    name: "Hepatitis B Test",
    status: "APPROVED",
    uploadedAt: "2025-10-01",
    expiresAt: "2026-10-01",
    reviewedBy: "LabCorp",
  },
  {
    id: "4",
    type: "HEPATITIS_C_TEST",
    name: "Hepatitis C Test",
    status: "APPROVED",
    uploadedAt: "2025-10-01",
    expiresAt: "2026-10-01",
    reviewedBy: "LabCorp",
  },
  {
    id: "5",
    type: "EYE_EXAM",
    name: "Eye Examination",
    status: "EXPIRING_SOON",
    uploadedAt: "2025-01-20",
    expiresAt: "2026-01-20",
    reviewedBy: "Dr. Johnson",
  },
  {
    id: "6",
    type: "PHOTO_ID",
    name: "Government Photo ID",
    status: "APPROVED",
    uploadedAt: "2025-06-01",
    expiresAt: "2028-06-01",
    reviewedBy: "Nevada AC",
  },
  {
    id: "7",
    type: "FIGHTER_LICENSE",
    name: "Fighter License",
    status: "APPROVED",
    uploadedAt: "2025-12-01",
    expiresAt: "2026-12-01",
    reviewedBy: "Nevada AC",
  },
  {
    id: "8",
    type: "EKG",
    name: "EKG/Cardiac Examination",
    status: "PENDING",
    uploadedAt: "2026-01-05",
    expiresAt: null,
    reviewedBy: null,
  },
];

const documentTypes = [
  { value: "PHYSICAL_EXAM", label: "Physical Examination" },
  { value: "HIV_TEST", label: "HIV Test" },
  { value: "HEPATITIS_B_TEST", label: "Hepatitis B Test" },
  { value: "HEPATITIS_C_TEST", label: "Hepatitis C Test" },
  { value: "EYE_EXAM", label: "Eye Examination" },
  { value: "EKG", label: "EKG/Cardiac Exam" },
  { value: "NEUROLOGICAL_EXAM", label: "Neurological Exam" },
  { value: "PHOTO_ID", label: "Photo ID" },
  { value: "FIGHTER_LICENSE", label: "Fighter License" },
  { value: "MEDICAL_CLEARANCE", label: "Medical Clearance" },
  { value: "BRAIN_MRI", label: "Brain MRI" },
  { value: "OTHER", label: "Other Document" },
];

type DocStatus = "APPROVED" | "PENDING" | "REJECTED" | "EXPIRING_SOON" | "EXPIRED";

const statusConfig: Record<DocStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  APPROVED: { label: "Approved", variant: "success" },
  PENDING: { label: "Pending Review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "danger" },
  EXPIRING_SOON: { label: "Expiring Soon", variant: "warning" },
  EXPIRED: { label: "Expired", variant: "danger" },
};

export default function DocumentsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const filteredDocs = mockDocuments.filter((doc) => {
    if (filter === "all") return true;
    if (filter === "pending") return doc.status === "PENDING";
    if (filter === "expiring") return doc.status === "EXPIRING_SOON" || doc.status === "EXPIRED";
    if (filter === "approved") return doc.status === "APPROVED";
    return true;
  });

  const stats = {
    total: mockDocuments.length,
    approved: mockDocuments.filter((d) => d.status === "APPROVED").length,
    pending: mockDocuments.filter((d) => d.status === "PENDING").length,
    expiring: mockDocuments.filter((d) => d.status === "EXPIRING_SOON" || d.status === "EXPIRED").length,
  };

  const getDaysUntilExpiration = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    return Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Documents</h1>
          <p className="text-gray-500 mt-1">Manage your compliance documents and certifications</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "all"
              ? "bg-[#ef4444]/10 border-[#ef4444]/30"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"
          }`}
        >
          <p className="text-gray-500 text-sm">Total Documents</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "approved"
              ? "bg-[#22c55e]/10 border-[#22c55e]/30"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"
          }`}
        >
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-[#22c55e] mt-1">{stats.approved}</p>
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "pending"
              ? "bg-[#f59e0b]/10 border-[#f59e0b]/30"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"
          }`}
        >
          <p className="text-gray-500 text-sm">Pending Review</p>
          <p className="text-2xl font-bold text-[#f59e0b] mt-1">{stats.pending}</p>
        </button>

        <button
          onClick={() => setFilter("expiring")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "expiring"
              ? "bg-[#ef4444]/10 border-[#ef4444]/30"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"
          }`}
        >
          <p className="text-gray-500 text-sm">Needs Attention</p>
          <p className="text-2xl font-bold text-[#ef4444] mt-1">{stats.expiring}</p>
        </button>
      </div>

      {/* Document List */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h3 className="font-semibold text-white">
            {filter === "all" ? "All Documents" :
             filter === "approved" ? "Approved Documents" :
             filter === "pending" ? "Pending Documents" :
             "Documents Needing Attention"}
          </h3>
        </div>
        <div className="divide-y divide-[#2a2a2a]">
          {filteredDocs.map((doc) => {
            const status = statusConfig[doc.status as DocStatus];
            const daysUntil = getDaysUntilExpiration(doc.expiresAt);

            return (
              <div key={doc.id} className="p-4 hover:bg-[#252525] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      doc.status === "APPROVED" ? "bg-[#22c55e]/20" :
                      doc.status === "PENDING" ? "bg-[#f59e0b]/20" :
                      "bg-[#ef4444]/20"
                    }`}>
                      <svg className={`w-6 h-6 ${
                        doc.status === "APPROVED" ? "text-[#22c55e]" :
                        doc.status === "PENDING" ? "text-[#f59e0b]" :
                        "text-[#ef4444]"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{doc.name}</h4>
                        <Badge variant={status.variant} dot>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        {doc.expiresAt && (
                          <span className={daysUntil && daysUntil < 30 ? "text-[#f59e0b]" : ""}>
                            Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                            {daysUntil !== null && ` (${daysUntil} days)`}
                          </span>
                        )}
                      </div>
                      {doc.reviewedBy && (
                        <p className="text-xs text-gray-600 mt-1">Reviewed by: {doc.reviewedBy}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {(doc.status === "EXPIRING_SOON" || doc.status === "EXPIRED" || doc.status === "REJECTED") && (
                      <button
                        onClick={() => setShowUpload(true)}
                        className="px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Re-upload
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-lg w-full">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
              <h3 className="font-semibold text-white">Upload Document</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Document Type Select */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent"
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-[#ef4444] bg-[#ef4444]/10"
                    : "border-[#3a3a3a] hover:border-[#ef4444]"
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => setDragActive(false)}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#252525] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">
                  Drag and drop your document here, or
                </p>
                <button className="text-[#ef4444] hover:underline font-medium">
                  browse files
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  Supports PDF, JPG, PNG up to 10MB
                </p>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Issue Date (if applicable)
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add any relevant notes..."
                  className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg font-medium transition-colors">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
