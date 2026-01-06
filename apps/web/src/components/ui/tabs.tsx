"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: ReactNode;
  defaultTab: string;
  onChange?: (tab: string) => void;
  className?: string;
}

export function Tabs({ children, defaultTab, onChange, className = "" }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  return (
    <div
      className={`flex border-b border-[#2a2a2a] ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
}

export function Tab({ value, children, icon, badge }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
        ${isActive
          ? "text-white border-[#3b82f6]"
          : "text-gray-500 border-transparent hover:text-gray-300"
        }
      `}
    >
      {icon}
      {children}
      {badge !== undefined && (
        <span
          className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
            isActive ? "bg-[#3b82f6] text-white" : "bg-[#3a3a3a] text-gray-400"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanel must be used within Tabs");

  const { activeTab } = context;
  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}

// Pill-style tabs (alternative style)
interface PillTabsProps {
  tabs: Array<{ value: string; label: string; count?: number }>;
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function PillTabs({ tabs, activeTab, onChange, className = "" }: PillTabsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${activeTab === tab.value
              ? "bg-[#3b82f6] text-white"
              : "bg-[#252525] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
