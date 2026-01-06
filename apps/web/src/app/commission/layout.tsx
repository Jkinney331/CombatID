"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/commission", label: "Dashboard", icon: "🏠" },
  { href: "/commission/fighters", label: "Fighters", icon: "👤" },
  { href: "/commission/events", label: "Events", icon: "📅" },
  { href: "/commission/rulesets", label: "Rulesets", icon: "📋" },
  { href: "/commission/approvals", label: "Approvals", icon: "✓" },
  { href: "/commission/settings", label: "Settings", icon: "⚙️" },
];

export default function CommissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Top Header */}
      <header className="bg-[#2563EB] text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">C</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">CombatID</h1>
                <p className="text-white/70 text-xs">Commission Portal</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Nevada Athletic Commission</span>
            <div className="w-8 h-8 bg-white/20 rounded-full" />
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
                  (item.href !== "/commission" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#2563EB] text-white"
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
