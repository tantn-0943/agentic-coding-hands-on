/**
 * Format a date string to "HH:mm - MM/DD/YYYY" format.
 * Returns empty string for invalid dates.
 */
export function formatTimestamp(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  return `${hours}:${minutes} - ${month}/${day}/${year}`
}
