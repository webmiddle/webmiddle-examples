// e.g. "Jan 4, 2016"
export function getFormattedDate(date) {
  const month = date.toLocaleString('en-us', { month: 'short' });
  const day = date.getDay() + 1;
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
