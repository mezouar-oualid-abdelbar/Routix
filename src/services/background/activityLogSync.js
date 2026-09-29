import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActivities } from "../../database/activities";
import { getOrCreateActivityLog, getLastCompletedDates } from "../../database/activityLogs";
import { isDueToday } from "../../utils/activityFilters";
import { todayKey } from "../../utils/dates";

const TASK_IDENTIFIER = "activity-log-sync";
const LOG_KEY = "activity_log_sync_log";
const SYNC_INTERVAL_MINUTES = 60; // Run every 1 hour

// ---------------------------------------------------------------------------
// Background task: creates activity logs for all activities due today.
// Runs every hour to ensure logs exist even if the user hasn't opened the app.
// ---------------------------------------------------------------------------
TaskManager.defineTask(TASK_IDENTIFIER, async () => {
  try {
    const now = new Date();
    const today = todayKey(now);

    // Fetch all active activities and their last completion dates
    const activities = await getActivities();
    const lastCompletedMap = await getLastCompletedDates();

    let created = 0;
    let skipped = 0;

    for (const activity of activities) {
      const lastDoneKey = lastCompletedMap[activity.id] ?? null;

      if (isDueToday(activity, now, lastDoneKey)) {
        const existing = await getOrCreateActivityLog(activity.id, today);
        // getOrCreateActivityLog uses INSERT OR IGNORE, so if it already
        // existed, created_at === updated_at. If we just created it,
        // created_at will be very close to now.
        const justCreated =
          existing &&
          existing.createdAt &&
          now.getTime() - existing.createdAt < 5000; // within 5 seconds

        if (justCreated) {
          created++;
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
    }

    // Log the sync result
    const entry = {
      timestamp: now.toISOString(),
      date: today,
      totalActivities: activities.length,
      logsCreated: created,
      skipped: skipped,
    };

    const existing = await AsyncStorage.getItem(LOG_KEY);
    const log = existing ? JSON.parse(existing) : [];
    log.push(entry);
    // Keep only last 100 entries
    if (log.length > 100) log.splice(0, log.length - 100);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(log));

    console.log(
      `[ActivityLogSync] ${today}: created ${created} logs, skipped ${skipped}`,
    );
  } catch (error) {
    console.error("[ActivityLogSync] Failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

// ---------------------------------------------------------------------------
// Registration helpers
// ---------------------------------------------------------------------------
export async function registerActivityLogSync() {
  return BackgroundTask.registerTaskAsync(TASK_IDENTIFIER, {
    minimumInterval: SYNC_INTERVAL_MINUTES,
  });
}

export async function unregisterActivityLogSync() {
  return BackgroundTask.unregisterTaskAsync(TASK_IDENTIFIER);
}

export async function isActivityLogSyncRegistered() {
  return TaskManager.isTaskRegisteredAsync(TASK_IDENTIFIER);
}

export async function getActivityLogSyncLog() {
  const raw = await AsyncStorage.getItem(LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearActivityLogSyncLog() {
  await AsyncStorage.removeItem(LOG_KEY);
}

export { TASK_IDENTIFIER, LOG_KEY, SYNC_INTERVAL_MINUTES };
