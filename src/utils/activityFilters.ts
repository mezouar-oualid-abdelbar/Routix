import { diffDays, parseKey, startOfDay } from "./dates";
import { Activity, ActivityTime } from "../database/activities";

const WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// An activity is due on a given day when:
// - schedule is "normal" (or unset)       -> always due
// - schedule is "weekly"                  -> the day is selected
// - schedule is "interval" (every N days) -> N+ days since the last
//   completion (rolling anchor; falls back to creation), and it stays
//   due until completed.
export function isDueToday(
  activity: Activity | null | undefined,
  now: Date = new Date(),
  lastDoneKey: string | null = null,
): boolean {
  if (!activity) return false;

  switch (activity.schedule) {
    case "weekly": {
      if (
        !Array.isArray(activity.scheduleData) ||
        activity.scheduleData.length === 0
      ) {
        return true;
      }
      return activity.scheduleData.includes(WEEKDAY_NAMES[now.getDay()]);
    }

    case "interval": {
      const every = parseInt(activity.scheduleData, 10);
      if (!Number.isFinite(every) || every <= 1) return true;

      const anchor =
        lastDoneKey != null
          ? parseKey(lastDoneKey)
          : activity.createdAt
            ? startOfDay(activity.createdAt)
            : null;
      if (!anchor) return true;

      return diffDays(anchor, now) >= every;
    }

    default:
      return true;
  }
}

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function sortByPriority(a: Activity, b: Activity): number {
  return (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
}

function toMinutes(time: ActivityTime | null | undefined): number | null {
  if (!time) return null;
  return (time.hours ?? 0) * 60 + (time.minutes ?? 0);
}

// Earliest reminder time first; activities without a time go last.
export function sortByTime(a: Activity, b: Activity): number {
  const timeA = toMinutes(a.time);
  const timeB = toMinutes(b.time);

  if (timeA == null && timeB == null) return sortByPriority(a, b);
  if (timeA == null) return 1;
  if (timeB == null) return -1;
  return timeA - timeB || sortByPriority(a, b);
}
