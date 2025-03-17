/**
 * Formats a date into a relative time string (e.g. "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  // Convert to seconds
  const diffSecs = Math.floor(diffMs / 1000);
  
  // Less than a minute
  if (diffSecs < 60) {
    return 'just now';
  }
  
  // Minutes
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  
  // Hours
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  
  // Days
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  // Weeks
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  }
  
  // Months
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }
  
  // Years
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}