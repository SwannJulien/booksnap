/** `on_hold` -> `On hold` */
export function formatStatus(status) {
  if (!status) return '';
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
}
