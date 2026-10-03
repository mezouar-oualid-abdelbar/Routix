import { getActivities, Activity } from "../../database/activities";
import {
  deleteActivityLog,
  getOrCreateActivityLog,
  getLastCompletedDates,
  getLogsForDate,
  ActivityLog,
} from "../../database/activityLogs";
import { isDueToday } from "../../utils/activityFilters";
import { todayKey } from "../../utils/dates";
import { LOG_STATUS } from "../../constants/logStatus";

export interface EnsureTodayLogsResult {
  date: string;
  totalActivities: number;
  created: number;
  removed: number;
}

// Creates today's activity_logs rows for activities due today and removes
// untouched rows for activities that are no longer due (or were deleted).
// Returns { date, totalActivities, created, removed }.
export async function ensureTodayLogs(
  now: Date = new Date(),
): Promise<EnsureTodayLogsResult> {
  const date = todayKey(now);
  const activities = await getActivities();
  // Exclude today's completions so they don't shift interval anchors.
  const lastDoneMap = await getLastCompletedDates(date);
  const existingLogs = await getLogsForDate(date);

  const existingByActivityId: Record<string, ActivityLog> = {};
  existingLogs.forEach((log) => {
    existingByActivityId[log.activityId] = log;
  });

  let created = 0;
  for (const activity of activities) {
    if (existingByActivityId[activity.id]) continue;
    if (!isDueToday(activity, now, lastDoneMap[activity.id] ?? null)) continue;
    await getOrCreateActivityLog(activity.id, date);
    created += 1;
  }

  const activitiesById: Record<string, Activity> = {};
  activities.forEach((activity) => {
    activitiesById[activity.id] = activity;
  });

  let removed = 0;
  for (const log of existingLogs) {
    const untouched =
      log.status === LOG_STATUS.PENDING &&
      !log.startedAt &&
      (log.progress ?? 0) === 0;
    if (!untouched) continue;
    const activity = activitiesById[log.activityId];
    const due = activity
      ? isDueToday(activity, now, lastDoneMap[activity.id] ?? null)
      : false;
    if (!due) {
      await deleteActivityLog(log.id);
      removed += 1;
    }
  }

  return { date, totalActivities: activities.length, created, removed };
}

export default ensureTodayLogs;
