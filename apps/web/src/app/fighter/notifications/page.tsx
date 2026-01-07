"use client";

import { useState } from "react";
import { Card, CardHeader, Badge, Button, PillTabs } from "@/components/ui";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "opportunity",
    title: "New Fight Offer",
    message: "ONE Championship has sent you a bout offer for ONE 178: Bangkok",
    timestamp: "2026-01-06T10:30:00",
    read: false,
    actionUrl: "/fighter/opportunities",
    actionLabel: "View Offer",
    priority: "high",
  },
  {
    id: "2",
    type: "document",
    title: "Document Approved",
    message: "Your Physical Examination has been approved by Nevada Athletic Commission",
    timestamp: "2026-01-05T16:45:00",
    read: false,
    actionUrl: "/fighter/documents",
    actionLabel: "View Document",
    priority: "normal",
  },
  {
    id: "3",
    type: "contract",
    title: "Contract Awaiting Signature",
    message: "Your bout agreement for UFC Fight Night 252 requires your signature",
    timestamp: "2026-01-05T09:00:00",
    read: false,
    actionUrl: "/fighter/bouts",
    actionLabel: "Sign Contract",
    priority: "high",
  },
  {
    id: "4",
    type: "document",
    title: "Document Expiring Soon",
    message: "Your HIV Test will expire in 30 days. Please upload a new test result.",
    timestamp: "2026-01-04T14:20:00",
    read: true,
    actionUrl: "/fighter/documents",
    actionLabel: "Upload Document",
    priority: "warning",
  },
  {
    id: "5",
    type: "eligibility",
    title: "Eligibility Status Updated",
    message: "You are now eligible to compete in Nevada. All requirements have been met.",
    timestamp: "2026-01-03T11:15:00",
    read: true,
    actionUrl: "/fighter",
    actionLabel: "View Status",
    priority: "success",
  },
  {
    id: "6",
    type: "bout",
    title: "Bout Confirmed",
    message: "Your bout at UFC 310 against Leon Edwards has been officially confirmed",
    timestamp: "2026-01-02T18:00:00",
    read: true,
    actionUrl: "/fighter/bouts",
    actionLabel: "View Details",
    priority: "success",
  },
  {
    id: "7",
    type: "system",
    title: "Profile Verification Complete",
    message: "Your Combat ID profile has been verified. You can now receive fight offers.",
    timestamp: "2026-01-01T10:00:00",
    read: true,
    actionUrl: "/fighter/profile",
    actionLabel: "View Profile",
    priority: "normal",
  },
  {
    id: "8",
    type: "payment",
    title: "Payment Received",
    message: "Payment of $500,000 for UFC 305 has been deposited to your account",
    timestamp: "2025-12-20T09:30:00",
    read: true,
    actionUrl: null,
    actionLabel: null,
    priority: "success",
  },
  {
    id: "9",
    type: "opportunity",
    title: "Fight Offer Expired",
    message: "The bout offer from PFL for PFL 1: 2026 Season has expired",
    timestamp: "2025-12-15T23:59:00",
    read: true,
    actionUrl: null,
    actionLabel: null,
    priority: "normal",
  },
  {
    id: "10",
    type: "medical",
    title: "Medical Suspension Lifted",
    message: "Your 30-day medical suspension from UFC 305 has been lifted. You are cleared to compete.",
    timestamp: "2025-12-15T12:00:00",
    read: true,
    actionUrl: null,
    actionLabel: null,
    priority: "success",
  },
];

type NotificationType = "opportunity" | "document" | "contract" | "eligibility" | "bout" | "system" | "payment" | "medical";

const typeConfig: Record<NotificationType, { icon: JSX.Element; color: string }> = {
  opportunity: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "text-[#3b82f6]",
  },
  document: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "text-[#8b5cf6]",
  },
  contract: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: "text-[#f59e0b]",
  },
  eligibility: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "text-[#22c55e]",
  },
  bout: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    color: "text-[#ef4444]",
  },
  system: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-gray-400",
  },
  payment: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-[#22c55e]",
  },
  medical: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: "text-[#ec4899]",
  },
};

const statusTabs = [
  { value: "all", label: "All", count: mockNotifications.length },
  { value: "unread", label: "Unread", count: mockNotifications.filter(n => !n.read).length },
  { value: "action", label: "Action Required", count: mockNotifications.filter(n => n.priority === "high" || n.priority === "warning").length },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "action") return n.priority === "high" || n.priority === "warning";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const groupByDate = (notifs: typeof notifications) => {
    const groups: { [key: string]: typeof notifications } = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    notifs.forEach((n) => {
      const date = new Date(n.timestamp).toDateString();
      let key: string;
      if (date === today) key = "Today";
      else if (date === yesterday) key = "Yesterday";
      else key = new Date(n.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric" });

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    return groups;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            Stay updated on your fights, documents, and opportunities
          </p>
        </div>
        <div className="flex gap-3">
          {notifications.filter((n) => !n.read).length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button variant="outline" size="sm" href="/fighter/settings">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{notifications.filter((n) => !n.read).length}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {notifications.filter((n) => n.priority === "high" || n.priority === "warning").length}
              </p>
              <p className="text-sm text-gray-500">Action Required</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22c55e]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{notifications.filter((n) => n.read).length}</p>
              <p className="text-sm text-gray-500">Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <PillTabs tabs={statusTabs} activeTab={filter} onChange={setFilter} />

      {/* Notifications List */}
      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([date, notifs]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">{date}</h3>
            <Card>
              <div className="divide-y divide-[#2a2a2a]">
                {notifs.map((notification) => {
                  const typeInfo = typeConfig[notification.type as NotificationType];
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 flex items-start gap-4 hover:bg-[#252525] transition-colors ${
                        !notification.read ? "bg-[#ef4444]/5" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notification.priority === "high" ? "bg-[#ef4444]/10" :
                        notification.priority === "warning" ? "bg-[#f59e0b]/10" :
                        notification.priority === "success" ? "bg-[#22c55e]/10" :
                        "bg-[#252525]"
                      }`}>
                        <span className={typeInfo.color}>{typeInfo.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                              )}
                            </div>
                            <p className="text-gray-500 text-sm mt-0.5">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-3">
                          {notification.actionUrl && (
                            <Button
                              variant="primary"
                              size="sm"
                              className={`${
                                notification.priority === "high" ? "bg-[#ef4444] hover:bg-[#dc2626]" :
                                notification.priority === "warning" ? "bg-[#f59e0b] hover:bg-[#d97706]" :
                                "bg-[#3b82f6] hover:bg-[#2563eb]"
                              }`}
                              href={notification.actionUrl}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-gray-500 hover:text-white transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-gray-500 hover:text-[#ef4444] transition-colors ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <Card>
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === "unread" ? "You're all caught up!" : "No notifications to display"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
