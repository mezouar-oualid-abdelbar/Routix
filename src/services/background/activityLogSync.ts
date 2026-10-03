import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ensureTodayLogs } from "../activityLogs/ensureTodayLogs";

const TASK_IDENTIFIER = "activity-log-sync";
const LOG_KEY = "activity_log_sync_log";
const SYNC_INTERVAL_MINUTES = 60;

interface SyncLogEntry {
  timestamp: string;
  date: string;
  totalActivities: number;
  created: number;
  removed: number;
}

TaskManager.defineTask(TASK_IDENTIFIER, async () => {
  try {
    const result = await ensureTodayLogs(new Date());
    const entry: SyncLogEntry = {
      timestamp: new Date().toISOString(),
      ...result,
    };

    const existing = await AsyncStorage.getItem(LOG_KEY);
    const log: SyncLogEntry[] = existing ? JSON.parse(existing) : [];
    log.push(entry);
    if (log.length > 100) log.splice(0, log.length - 100);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(log));

    console.log(
      `[ActivityLogSync] ${result.date}: created ${result.created}, removed ${result.removed}`,
    );
  } catch (error) {
    console.error("[ActivityLogSync] Failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

export async function registerActivityLogSync(): Promise<void | null> {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;
  const registered = await TaskManager.isTaskRegisteredAsync(TASK_IDENTIFIER);
  if (registered) return;
  return BackgroundTask.registerTaskAsync(TASK_IDENTIFIER, {
    minimumInterval: SYNC_INTERVAL_MINUTES,
  });
}

export async function unregisterActivityLogSync(): Promise<void> {
  return BackgroundTask.unregisterTaskAsync(TASK_IDENTIFIER);
}

export async function isActivityLogSyncRegistered(): Promise<boolean> {
  return TaskManager.isTaskRegisteredAsync(TASK_IDENTIFIER);
}

export async function getActivityLogSyncLog(): Promise<SyncLogEntry[]> {
  const raw = await AsyncStorage.getItem(LOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearActivityLogSyncLog(): Promise<void> {
  await AsyncStorage.removeItem(LOG_KEY);
}

export { TASK_IDENTIFIER, LOG_KEY, SYNC_INTERVAL_MINUTES };
