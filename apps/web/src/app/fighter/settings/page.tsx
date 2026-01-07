"use client";

import { useState } from "react";
import { Card, CardHeader, Button, Badge } from "@/components/ui";

// Settings state
const defaultSettings = {
  notifications: {
    email: {
      fightOffers: true,
      documentReminders: true,
      contractUpdates: true,
      paymentConfirmations: true,
      promotionalEmails: false,
    },
    push: {
      fightOffers: true,
      documentReminders: true,
      contractUpdates: true,
      paymentConfirmations: true,
    },
    sms: {
      fightOffers: true,
      urgentAlerts: true,
    },
  },
  privacy: {
    profileVisibility: "verified_only",
    showRecord: true,
    showGym: true,
    showSocialMedia: true,
    allowPromotionContact: true,
  },
  preferences: {
    weightClass: "Welterweight",
    preferredLocations: ["USA", "UAE", "UK"],
    minimumPurse: "50000",
    availableFrom: "2026-02-01",
    openToShortNotice: true,
  },
  security: {
    twoFactorEnabled: true,
    loginNotifications: true,
    trustedDevices: 2,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeSection, setActiveSection] = useState("notifications");
  const [hasChanges, setHasChanges] = useState(false);

  const updateNotificationSetting = (
    channel: "email" | "push" | "sms",
    setting: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: {
          ...prev.notifications[channel],
          [setting]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const updatePrivacySetting = (setting: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: value,
      },
    }));
    setHasChanges(true);
  };

  const updatePreference = (setting: string, value: string | boolean | string[]) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [setting]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: API call to save settings
    setHasChanges(false);
  };

  const sections = [
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "privacy", label: "Privacy", icon: "shield" },
    { id: "preferences", label: "Fight Preferences", icon: "fire" },
    { id: "security", label: "Security", icon: "lock" },
    { id: "account", label: "Account", icon: "user" },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "bell":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case "shield":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "fire":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      case "lock":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case "user":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account preferences and notifications
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#f59e0b]">You have unsaved changes</span>
            <Button
              variant="primary"
              className="bg-[#ef4444] hover:bg-[#dc2626]"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-[#ef4444]/10 text-[#ef4444]"
                      : "text-gray-400 hover:bg-[#252525] hover:text-white"
                  }`}
                >
                  {renderIcon(section.icon)}
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications */}
          {activeSection === "notifications" && (
            <>
              <Card>
                <CardHeader
                  title="Email Notifications"
                  subtitle="Choose what updates you receive via email"
                />
                <div className="p-4 space-y-4">
                  {Object.entries(settings.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {key === "fightOffers" && "Get notified when promotions send you offers"}
                          {key === "documentReminders" && "Reminders for expiring documents"}
                          {key === "contractUpdates" && "Updates on contract status changes"}
                          {key === "paymentConfirmations" && "Confirmation when payments are received"}
                          {key === "promotionalEmails" && "Marketing and promotional content"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateNotificationSetting("email", key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Push Notifications"
                  subtitle="Control notifications on your devices"
                />
                <div className="p-4 space-y-4">
                  {Object.entries(settings.notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <p className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateNotificationSetting("push", key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="SMS Notifications" subtitle="Important alerts via text message" />
                <div className="p-4 space-y-4">
                  {Object.entries(settings.notifications.sms).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <p className="text-white font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateNotificationSetting("sms", key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Privacy */}
          {activeSection === "privacy" && (
            <Card>
              <CardHeader
                title="Privacy Settings"
                subtitle="Control who can see your profile and contact you"
              />
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updatePrivacySetting("profileVisibility", e.target.value)}
                    className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  >
                    <option value="public">Public - Anyone can view</option>
                    <option value="verified_only">Verified Only - Only verified promotions and commissions</option>
                    <option value="private">Private - Only you can view</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Controls who can see your profile information
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Fight Record</p>
                      <p className="text-sm text-gray-500">Display your win/loss record on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showRecord}
                        onChange={(e) => updatePrivacySetting("showRecord", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Gym Affiliation</p>
                      <p className="text-sm text-gray-500">Display your gym on your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showGym}
                        onChange={(e) => updatePrivacySetting("showGym", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Allow Promotion Contact</p>
                      <p className="text-sm text-gray-500">Let verified promotions send you offers directly</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowPromotionContact}
                        onChange={(e) => updatePrivacySetting("allowPromotionContact", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Fight Preferences */}
          {activeSection === "preferences" && (
            <Card>
              <CardHeader
                title="Fight Preferences"
                subtitle="Help promotions find the right opportunities for you"
              />
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">Primary Weight Class</label>
                  <select
                    value={settings.preferences.weightClass}
                    onChange={(e) => updatePreference("weightClass", e.target.value)}
                    className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
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
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Preferred Fight Locations</label>
                  <div className="flex flex-wrap gap-2">
                    {["USA", "UAE", "UK", "Brazil", "Japan", "Singapore", "Thailand", "Europe"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          const current = settings.preferences.preferredLocations;
                          const updated = current.includes(loc)
                            ? current.filter((l) => l !== loc)
                            : [...current, loc];
                          updatePreference("preferredLocations", updated);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settings.preferences.preferredLocations.includes(loc)
                            ? "bg-[#ef4444] text-white"
                            : "bg-[#252525] text-gray-400 hover:bg-[#3a3a3a]"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Minimum Purse Requirement</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={settings.preferences.minimumPurse}
                      onChange={(e) => updatePreference("minimumPurse", e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Only show opportunities above this amount
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Available From</label>
                  <input
                    type="date"
                    value={settings.preferences.availableFrom}
                    onChange={(e) => updatePreference("availableFrom", e.target.value)}
                    className="w-full px-4 py-3 bg-[#252525] border border-[#3a3a3a] rounded-lg text-white focus:border-[#ef4444] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Open to Short Notice Fights</p>
                    <p className="text-sm text-gray-500">Accept opportunities with less than 2 weeks notice</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.openToShortNotice}
                      onChange={(e) => updatePreference("openToShortNotice", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <>
              <Card>
                <CardHeader title="Two-Factor Authentication" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">2FA Status</p>
                        <Badge variant={settings.security.twoFactorEnabled ? "success" : "danger"}>
                          {settings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">
                      {settings.security.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Login Notifications" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Email me about new logins</p>
                      <p className="text-sm text-gray-500">Get notified when a new device logs in</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.loginNotifications}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, loginNotifications: e.target.checked },
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3a3a3a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                    </label>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Trusted Devices"
                  subtitle={`${settings.security.trustedDevices} device(s) currently trusted`}
                />
                <div className="p-4">
                  <Button variant="outline" className="text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444]/10">
                    Sign out of all other devices
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader title="Password" />
                <div className="p-4">
                  <Button variant="outline">Change Password</Button>
                </div>
              </Card>
            </>
          )}

          {/* Account */}
          {activeSection === "account" && (
            <>
              <Card>
                <CardHeader title="Combat ID" subtitle="Your unique fighter identification" />
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <code className="text-xl font-mono text-[#ef4444] bg-[#252525] px-4 py-2 rounded-lg">
                      CID-847291
                    </code>
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Connected Accounts" subtitle="Link your social and financial accounts" />
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#151515] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">IG</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Instagram</p>
                        <p className="text-sm text-gray-500">@marcusthehammer</p>
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#151515] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1da1f2] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">X</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Twitter/X</p>
                        <p className="text-sm text-gray-500">@mwilliams_mma</p>
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#151515] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#635bff] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">$</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Stripe (Payouts)</p>
                        <p className="text-sm text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Export Your Data" subtitle="Download a copy of your information" />
                <div className="p-4">
                  <Button variant="outline">Request Data Export</Button>
                </div>
              </Card>

              <Card className="border-[#ef4444]/30">
                <CardHeader title="Danger Zone" />
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Deactivate Account</p>
                      <p className="text-sm text-gray-500">Temporarily hide your profile</p>
                    </div>
                    <Button variant="outline" className="text-[#f59e0b] border-[#f59e0b]">
                      Deactivate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently remove all your data</p>
                    </div>
                    <Button variant="outline" className="text-[#ef4444] border-[#ef4444]">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
