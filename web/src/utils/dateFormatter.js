const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * A LocalDate (`2023-10-12`) or ISO datetime string to a local `Date`.
 * Built field by field on purpose: `new Date('2023-10-12')` parses as UTC and shifts
 * the day for anyone west of Greenwich.
 */
export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** `2023-10-12` -> `Oct 12, 2023` */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/** Whole days between a past due date and today, floored at 1 ("Late (1 days)"). */
export function daysLate(endDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.round((today - parseDate(endDateStr)) / MS_PER_DAY));
}
