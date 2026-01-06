"use client";

import { useState } from "react";

interface Message {
  id: string;
  sender: string;
  senderType: "commission" | "promotion" | "gym" | "fighter";
  avatar: string;
  content: string;
  timestamp: string;
  unread?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: "commission" | "promotion" | "gym" | "fighter";
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockConversations: Conversation[] = [
  { id: "1", name: "Nevada Athletic Commission", type: "commission", avatar: "NAC", lastMessage: "Event approved for Jan 15th", timestamp: "2m ago", unread: 2 },
  { id: "2", name: "Elite Fight League", type: "promotion", avatar: "EFL", lastMessage: "Contract terms look good", timestamp: "15m ago", unread: 0 },
  { id: "3", name: "American Top Team", type: "gym", avatar: "ATT", lastMessage: "Marcus is ready for the fight", timestamp: "1h ago", unread: 1 },
  { id: "4", name: "Marcus Rivera", type: "fighter", avatar: "MR", lastMessage: "I'll sign the contract today", timestamp: "2h ago", unread: 0 },
  { id: "5", name: "California Commission", type: "commission", avatar: "CAC", lastMessage: "Need updated medical docs", timestamp: "3h ago", unread: 3 },
];

const mockMessages: Message[] = [
  { id: "1", sender: "Nevada Athletic Commission", senderType: "commission", avatar: "NAC", content: "We've reviewed the event application for EFL Fight Night 47.", timestamp: "10:30 AM" },
  { id: "2", sender: "You", senderType: "promotion", avatar: "EFL", content: "Thank you! Are there any concerns with the bout lineup?", timestamp: "10:32 AM" },
  { id: "3", sender: "Nevada Athletic Commission", senderType: "commission", avatar: "NAC", content: "Fighter Jake Thompson needs updated blood work. Otherwise, event approved for Jan 15th.", timestamp: "10:35 AM" },
  { id: "4", sender: "You", senderType: "promotion", avatar: "EFL", content: "Understood. We'll get that submitted by end of day.", timestamp: "10:36 AM" },
];

const typeColors = {
  commission: { bg: "bg-blue-500", text: "text-blue-500", light: "bg-blue-50" },
  promotion: { bg: "bg-purple-500", text: "text-purple-500", light: "bg-purple-50" },
  gym: { bg: "bg-emerald-500", text: "text-emerald-500", light: "bg-emerald-50" },
  fighter: { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-50" },
};

interface ChatProps {
  theme?: "light" | "dark";
  accentColor?: string;
}

export default function Chat({ theme = "light", accentColor = "#2563eb" }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const isDark = theme === "dark";
  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  const handleSend = () => {
    if (newMessage.trim()) {
      // In real app, send message to backend
      setNewMessage("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        style={{ boxShadow: `0 4px 20px ${accentColor}40` }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {totalUnread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            {totalUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed right-6 bottom-6 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
      style={{ boxShadow: `0 8px 40px ${accentColor}30` }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center gap-3">
          {activeConversation ? (
            <button
              onClick={() => setActiveConversation(null)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}
          <h3 className="font-semibold text-white">
            {activeConversation
              ? mockConversations.find(c => c.id === activeConversation)?.name
              : "Messages"}
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {activeConversation ? (
        <>
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            {mockMessages.map((msg) => {
              const isMe = msg.sender === "You";
              const colors = typeColors[msg.senderType];
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : ""}`}>
                    {!isMe && (
                      <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {msg.avatar}
                      </div>
                    )}
                    <div>
                      {!isMe && (
                        <p className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {msg.sender}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isMe
                            ? "text-white"
                            : isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900 shadow-sm"
                        }`}
                        style={isMe ? { backgroundColor: accentColor } : {}}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"} ${isMe ? "text-right" : ""}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
            <div className="flex gap-2">
              <button className={`p-2 rounded-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className={`flex-1 px-4 py-2 rounded-full text-sm ${
                  isDark
                    ? "bg-gray-800 text-white placeholder-gray-500 focus:ring-gray-600"
                    : "bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-gray-200"
                } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-full text-white"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Conversation List */
        <div className={`flex-1 overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
          {/* Search */}
          <div className={`p-3 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                className={`flex-1 bg-transparent text-sm focus:outline-none ${isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {mockConversations.map((conv) => {
              const colors = typeColors[conv.type];
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                        {conv.name}
                      </h4>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {conv.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-sm truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span
                          className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: accentColor }}
                        >
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                      {conv.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
