/**
 * Generate a CombatID from a name
 * Format: XXXX + 6 random alphanumeric characters
 */
export function generateCombatId(name: string): string {
  const namePart = name
    .replace(/\s+/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${namePart}${randomPart}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Calculate days until a date
 */
export function daysUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is expired
 */
export function isExpired(date: Date | string): boolean {
  return daysUntil(date) < 0;
}

/**
 * Check if a date is expiring soon (within 30 days)
 */
export function isExpiringSoon(date: Date | string, days: number = 30): boolean {
  const remaining = daysUntil(date);
  return remaining >= 0 && remaining <= days;
}

/**
 * Format a fighter record
 */
export function formatRecord(wins: number, losses: number, draws: number = 0): string {
  if (draws > 0) {
    return `${wins}-${losses}-${draws}`;
  }
  return `${wins}-${losses}`;
}

/**
 * Parse a fighter record string
 */
export function parseRecord(record: string): { wins: number; losses: number; draws: number } {
  const parts = record.split('-').map(Number);
  return {
    wins: parts[0] || 0,
    losses: parts[1] || 0,
    draws: parts[2] || 0,
  };
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
}
