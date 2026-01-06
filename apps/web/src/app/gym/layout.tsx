"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/gym", label: "Dashboard", icon: "🏠" },
  { href: "/gym/fighters", label: "My Fighters", icon: "👥" },
  { href: "/gym/training", label: "Training", icon: "🥊" },
  { href: "/gym/opportunities", label: "Fight Opportunities", icon: "📋" },
  { href: "/gym/settings", label: "Settings", icon: "⚙️" },
];

export default function GymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Top Header */}
      <header className="bg-[#059669] text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">C</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">CombatID</h1>
                <p className="text-white/70 text-xs">Gym Portal</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm font-medium">American Top Team</span>
              <p className="text-white/70 text-xs">Miami, FL</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">AT</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#e5e7eb] min-h-[calc(100vh-72px)]">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/gym" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#059669] text-white"
                          : "text-[#374151] hover:bg-[#f3f4f6]"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-[#e5e7eb]">
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Active Fighters</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Eligible</span>
                <span className="font-medium text-[#10b981]">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Needs Attention</span>
                <span className="font-medium text-[#f59e0b]">3</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
