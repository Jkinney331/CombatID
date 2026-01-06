"use client";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "away" | "offline";
  className?: string;
}

const sizeStyles = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-xl",
};

const statusSizeStyles = {
  xs: "w-2 h-2",
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
  xl: "w-4 h-4",
};

const statusColorStyles = {
  online: "bg-[#22c55e]",
  away: "bg-[#f59e0b]",
  offline: "bg-gray-500",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color based on initials
function getAvatarColor(initials: string): string {
  const colors = [
    "from-[#3b82f6] to-[#2563eb]",
    "from-[#8b5cf6] to-[#7c3aed]",
    "from-[#ec4899] to-[#db2777]",
    "from-[#f59e0b] to-[#d97706]",
    "from-[#22c55e] to-[#16a34a]",
    "from-[#06b6d4] to-[#0891b2]",
    "from-[#ef4444] to-[#dc2626]",
  ];
  const charSum = initials.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
}

export function Avatar({ src, alt, initials, size = "md", status, className = "" }: AvatarProps) {
  const displayInitials = initials || (alt ? getInitials(alt) : "?");
  const bgGradient = getAvatarColor(displayInitials);

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className={`${sizeStyles[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center text-white font-medium`}
        >
          {displayInitials}
        </div>
      )}
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizeStyles[size]} rounded-full border-2 border-[#1a1a1a] ${statusColorStyles[status]}`}
        />
      )}
    </div>
  );
}

// Avatar group for showing multiple avatars
interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    alt?: string;
    initials?: string;
  }>;
  max?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = "sm", className = "" }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          initials={avatar.initials}
          size={size}
          className="border-2 border-[#1a1a1a]"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`${sizeStyles[size]} bg-[#3a3a3a] rounded-full flex items-center justify-center text-gray-400 font-medium border-2 border-[#1a1a1a]`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
