interface TimeObject {
  hours?: number;
  minutes?: number;
}

interface Duration {
  hours?: number;
  minutes?: number;
}

export function formatTime(timeObj: TimeObject | null | undefined): string {
  if (!timeObj) return "08:00 AM";
  const hours = timeObj.hours ?? 8;
  const minutes = timeObj.minutes ?? 0;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function formatDuration(dur: Duration | null | undefined): string {
  if (!dur) return "0m";
  const { hours, minutes } = dur;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.length > 0 ? parts.join(" ") : "0m";
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
