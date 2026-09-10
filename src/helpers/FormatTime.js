export function FormatTime(timeObj) {
  if (!timeObj) return "08:00 AM";
  const hours = timeObj.hours ?? 8;
  const minutes = timeObj.minutes ?? 0;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
}
