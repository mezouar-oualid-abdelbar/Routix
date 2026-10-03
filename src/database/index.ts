export { initDatabase, ensureDb, getDb } from "./connection";
export {
  toActivity,
  getActivities,
  getActivityById,
  softDeleteActivity,
  updateActivity,
  createActivity,
} from "./activities";
export type { Activity, ActivityRow, ActivityInput, ActivityTime } from "./activities";
export {
  toActivityLog,
  getLogById,
  getActivityLog,
  getOrCreateActivityLog,
  updateActivityLog,
  deleteActivityLog,
  getLogsForDate,
  getLogsInRange,
  getLastCompletedDate,
  getLastCompletedDates,
  getActivityHistory,
} from "./activityLogs";
export type { ActivityLog, ActivityLogRow, ActivityLogPatch } from "./activityLogs";
