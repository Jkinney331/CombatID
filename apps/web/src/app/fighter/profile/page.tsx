"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, Badge, Button, Avatar } from "@/components/ui";

// Mock fighter data
const mockFighter = {
  id: "CID-847291",
  firstName: "Marcus",
  lastName: "Williams",
  nickname: "The Hammer",
  email: "marcus.williams@email.com",
  phone: "+1 (702) 555-0147",
  dateOfBirth: "1992-03-15",
  nationality: "USA",
  city: "Las Vegas",
  state: "Nevada",
  weightClass: "Welterweight",
  weight: "170 lbs",
  height: "5'11\"",
  reach: "74\"",
  stance: "Orthodox",
  gym: "American Top Team",
  coach: "Mike Brown",
  manager: "Ali Abdelaziz",
  disciplines: ["MMA", "Wrestling", "BJJ"],
  record: {
    wins: 12,
    losses: 2,
    draws: 0,
    nc: 0,
    ko: 6,
    sub: 3,
    dec: 3,
  },
  eligibilityStatus: "eligible",
  lastMedicalDate: "2025-11-15",
  licenseExpiry: "2026-06-30",
  memberSince: "2023-01-15",
  profilePhoto: null,
  socialMedia: {
    instagram: "@marcusthehammer",
    twitter: "@mwilliams_mma",
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockFighter);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleSave = () => {
    // TODO: API call to save profile
    setIsEditing(false);
  };

  const handleDownloadCard = () => {
    // In production, this would generate a high-quality PDF
    window.print();
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your fighter profile and Combat ID
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-[#ef4444] hover:bg-[#dc2626]"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              className="bg-[#ef4444] hover:bg-[#dc2626]"
              onClick={() => setIsEditing(true)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combat ID Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader
              title="Combat ID Card"
              subtitle="Your official fighter identification"
              action={
                <Button variant="outline" size="sm" onClick={handleDownloadCard}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              }
            />
            <div className="p-4">
              {/* Combat ID Card Design */}
              <div
                ref={cardRef}
                className="relative bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] rounded-xl overflow-hidden border border-[#3a3a3a] shadow-2xl print:shadow-none"
                style={{ aspectRatio: "1.586" }}
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(239,68,68,0.1) 10px,
                      rgba(239,68,68,0.1) 20px
                    )`
                  }} />
                </div>

                {/* Card Header */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-sm tracking-wider">COMBATID</span>
                    </div>
                    <span className="text-white/80 text-xs">OFFICIAL</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="absolute inset-0 pt-12 px-4 pb-4 flex">
                  {/* Photo Section */}
                  <div className="w-24 flex-shrink-0">
                    <div className="w-20 h-24 bg-[#2a2a2a] rounded-lg border-2 border-[#ef4444]/30 overflow-hidden">
                      <Avatar alt={formData.firstName} size="lg" className="w-full h-full rounded-none" />
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        formData.eligibilityStatus === "eligible"
                          ? "bg-[#22c55e]/20 text-[#22c55e]"
                          : "bg-[#f59e0b]/20 text-[#f59e0b]"
                      }`}>
                        {formData.eligibilityStatus === "eligible" ? "ELIGIBLE" : "CONDITIONAL"}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 ml-4 flex flex-col justify-between">
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">
                        {formData.firstName} {formData.lastName}
                      </p>
                      {formData.nickname && (
                        <p className="text-[#ef4444] text-sm font-medium">"{formData.nickname}"</p>
                      )}
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div>
                          <span className="text-gray-500">Weight Class</span>
                          <p className="text-white font-medium">{formData.weightClass}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Record</span>
                          <p className="text-white font-medium">
                            {formData.record.wins}-{formData.record.losses}-{formData.record.draws}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Country</span>
                          <p className="text-white font-medium">{formData.nationality}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Age</span>
                          <p className="text-white font-medium">{calculateAge(formData.dateOfBirth)}</p>
                        </div>
                      </div>
                    </div>

                    {/* ID Number */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-gray-500 text-[10px]">COMBAT ID</span>
                        <p className="text-white font-mono font-bold text-sm tracking-wider">{formData.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 text-[10px]">VALID THRU</span>
                        <p className="text-white font-mono text-xs">{formData.licenseExpiry}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holographic Effect Strip */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ef4444] via-[#f97316] to-[#ef4444]" />
              </div>

              {/* QR Code Section */}
              <div className="mt-4 flex items-center justify-between p-3 bg-[#151515] rounded-lg border border-[#2a2a2a]">
                <div>
                  <p className="text-sm font-medium text-white">Verification QR</p>
                  <p className="text-xs text-gray-500">Scan to verify credentials</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-lg p-1">
                  {/* Placeholder QR - in production would be actual QR code */}
                  <div className="w-full h-full bg-[#1a1a1a] rounded grid grid-cols-5 grid-rows-5 gap-0.5 p-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${Math.random() > 0.5 ? "bg-white" : "bg-transparent"} rounded-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader title="Career Statistics" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white font-bold">
                  {Math.round((formData.record.wins / (formData.record.wins + formData.record.losses)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Finish Rate</span>
                <span className="text-white font-bold">
                  {Math.round(((formData.record.ko + formData.record.sub) / formData.record.wins) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">KO/TKO Wins</span>
                <span className="text-white font-bold">{formData.record.ko}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Submission Wins</span>
                <span className="text-white font-bold">{formData.record.sub}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Decision Wins</span>
                <span className="text-white font-bold">{formData.record.dec}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader title="Personal Information" />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nickname</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">"{formData.nickname}"</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{new Date(formData.dateOfBirth).toLocaleDateString()} ({calculateAge(formData.dateOfBirth)} years old)</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.nationality}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      className="flex-1 px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                      className="w-24 px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                    />
                  </div>
                ) : (
                  <p className="text-white">{formData.city}, {formData.state}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Fighting Information */}
          <Card>
            <CardHeader title="Fighting Information" />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Weight Class</label>
                {isEditing ? (
                  <select
                    value={formData.weightClass}
                    onChange={(e) => handleInputChange("weightClass", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  >
                    <option value="Strawweight">Strawweight (115 lbs)</option>
                    <option value="Flyweight">Flyweight (125 lbs)</option>
                    <option value="Bantamweight">Bantamweight (135 lbs)</option>
                    <option value="Featherweight">Featherweight (145 lbs)</option>
                    <option value="Lightweight">Lightweight (155 lbs)</option>
                    <option value="Welterweight">Welterweight (170 lbs)</option>
                    <option value="Middleweight">Middleweight (185 lbs)</option>
                    <option value="Light Heavyweight">Light Heavyweight (205 lbs)</option>
                    <option value="Heavyweight">Heavyweight (265 lbs)</option>
                  </select>
                ) : (
                  <p className="text-white">{formData.weightClass}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Walk-around Weight</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.weight}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Height</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.height}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Reach</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.reach}
                    onChange={(e) => handleInputChange("reach", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.reach}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Stance</label>
                {isEditing ? (
                  <select
                    value={formData.stance}
                    onChange={(e) => handleInputChange("stance", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  >
                    <option value="Orthodox">Orthodox</option>
                    <option value="Southpaw">Southpaw</option>
                    <option value="Switch">Switch</option>
                  </select>
                ) : (
                  <p className="text-white">{formData.stance}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Disciplines</label>
                <div className="flex flex-wrap gap-2">
                  {formData.disciplines.map((discipline) => (
                    <Badge key={discipline} variant="default">
                      {discipline}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Team Information */}
          <Card>
            <CardHeader title="Team & Management" />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Gym</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.gym}
                    onChange={(e) => handleInputChange("gym", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.gym}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Head Coach</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.coach}
                    onChange={(e) => handleInputChange("coach", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.coach}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Manager</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.manager}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader title="Social Media" />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Instagram</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.socialMedia.instagram}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Twitter/X</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleSocialChange("twitter", e.target.value)}
                    className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{formData.socialMedia.twitter}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader title="Account Information" />
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Combat ID</label>
                  <p className="text-white font-mono">{formData.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                  <p className="text-white">{new Date(formData.memberSince).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">License Expiry</label>
                  <p className="text-white">{new Date(formData.licenseExpiry).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                <button className="text-[#ef4444] text-sm hover:underline">
                  Request Account Deletion
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
