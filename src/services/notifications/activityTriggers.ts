import { addDays, parseKey, startOfDay, todayKey } from "../../utils/dates";
import { Activity } from "../../database/activities";

export const WEEKDAY_TO_EXPO: Record<string, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

export const INTERVAL_OCCURRENCES = 8;

export interface ActivityTimeValue {
  hours: number;
  minutes: number;
}

export interface NotificationTrigger {
  type: string;
  weekday?: number;
  hour?: number;
  minute?: number;
  date?: Date;
}

export interface NotificationOccurrence {
  occurrenceKey: string;
  trigger: NotificationTrigger;
}

export function timeOf(activity: Activity | null | undefined): ActivityTimeValue | null {
  if (!activity?.time) return null;
  return {
    hours: activity.time.hours ?? 0,
    minutes: activity.time.minutes ?? 0,
  };
}

// Build [{ occurrenceKey, trigger }] from schedule + reminder time.
// normal            -> daily repeat (treated as every day)
// weekly [days]     -> weekly repeat on each selected day
// interval "N"      -> next N occurrences from the rolling anchor
//                      (last completion, else creation), one-shot dates.
export function buildOccurrences(
  activity: Activity,
  now: Date = new Date(),
  lastDoneKey: string | null = null,
): NotificationOccurrence[] {
  const time = timeOf(activity);
  if (!time) return [];

  if (activity.schedule === "weekly") {
    const days: string[] = Array.isArray(activity.scheduleData)
      ? activity.scheduleData
      : [];
    return days
      .filter((day) => WEEKDAY_TO_EXPO[day] != null)
      .map((day) => ({
        occurrenceKey: day,
        trigger: {
          type: "weekly",
          weekday: WEEKDAY_TO_EXPO[day],
          hour: time.hours,
          minute: time.minutes,
        },
      }));
  }

  if (activity.schedule === "interval") {
    const every = parseInt(activity.scheduleData, 10);
    if (!Number.isFinite(every) || every < 1) return [];
    const anchor =
      lastDoneKey != null
        ? parseKey(lastDoneKey)
        : activity.createdAt
          ? startOfDay(new Date(activity.createdAt))
          : startOfDay(now);
    let next = addDays(anchor, every);
    const occurrences: NotificationOccurrence[] = [];
    while (occurrences.length < INTERVAL_OCCURRENCES) {
      const fire = new Date(next);
      fire.setHours(time.hours, time.minutes, 0, 0);
      if (fire > now) {
        occurrences.push({
          occurrenceKey: todayKey(fire),
          trigger: { type: "date", date: new Date(fire) },
        });
      }
      next = addDays(next, every);
    }
    return occurrences;
  }

  // "normal" (and anything unknown): every day at the set time.
  return [
    {
      occurrenceKey: "daily",
      trigger: { type: "daily", hour: time.hours, minute: time.minutes },
    },
  ];
}
