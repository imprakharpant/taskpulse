/**
 * Formats an ISO date string or Date object into human-readable format (e.g., Oct 15, 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No date set';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Formats date into YYYY-MM-DD for HTML input[type="date"]
 */
export const toInputDateFormat = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

/**
 * Checks if a task is overdue (due date is in the past and task is not completed)
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'COMPLETED') return false;
  const due = new Date(dueDate);
  const now = new Date();
  // Strip time for end-of-day comparison
  due.setHours(23, 59, 59, 999);
  return due < now;
};
