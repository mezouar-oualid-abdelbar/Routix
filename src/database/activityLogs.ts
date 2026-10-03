import { ensureDb } from "./connection";
import { parseJson, toJson } from "./json";
import { LOG_STATUS, LogStatus } from "../constants/logStatus";

// ---------------------------------------------------------------------------
// Activity execution history: WHAT HAPPENED when the user performed an
// activity. One row per activity per scheduled day (UNIQUE constraint).
// Type-specific progress details live in `data` as JSON:
//   timed:            { totalSeconds, elapsedSeconds }
//   follow_up:        { completedStepIds: [] }   (in definition order)
//   multi_activities: { completedTaskIds: [] }
//   normal:           null
// ---------------------------------------------------------------------------

export interface ActivityLog {
  id: number | string;
  activityId: number | string;
  logDate: string;
  status: LogStatus | string;
  progress: number;
  startedAt: number | null;
  completedAt: number | null;
  data: any;
  activityTitle: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface ActivityLogRow {
  id: number | string;
  activity_id: number | string;
  log_date: string;
  status?: LogStatus | string | null;
  progress?: number | null;
  started_at?: number | null;
  completed_at?: number | null;
  data?: string | null;
  activity_title?: string | null;
  created_at?: number | null;
  updated_at?: number | null;
}

export type ActivityLogPatch = Partial<ActivityLog>;

export function toActivityLog(
  row: ActivityLogRow | null | undefined,
): ActivityLog | null {
  if (!row) return null;
  return {
    id: row.id,
    activityId: row.activity_id,
    logDate: row.log_date,
    status: row.status ?? LOG_STATUS.PENDING,
    progress: row.progress ?? 0,
    startedAt: row.started_at ?? null,
    completedAt: row.completed_at ?? null,
    data: parseJson(row.data),
    activityTitle: row.activity_title ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

export async function getLogById(
  id: number | string,
): Promise<ActivityLog | null> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE id = ?",
    id as any,
  );
  return toActivityLog((rows as ActivityLogRow[])[0] ?? null);
}

export async function getActivityLog(
  activityId: number | string,
  logDate: string,
): Promise<ActivityLog | null> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE activity_id = ? AND log_date = ?",
    activityId as any,
    logDate,
  );
  return toActivityLog((rows as ActivityLogRow[])[0] ?? null);
}

export async function getOrCreateActivityLog(
  activityId: number | string,
  logDate: string,
): Promise<ActivityLog | null> {
  const database = await ensureDb();
  const now = Date.now();
  // Snapshot the title so history stays readable after edits/soft-delete.
  await database.runAsync(
    `INSERT OR IGNORE INTO activity_logs
      (activity_id, log_date, status, progress, activity_title, created_at, updated_at)
     SELECT ?, ?, 'pending', 0, title, ?, ? FROM activities WHERE id = ?`,
    activityId as any,
    logDate,
    now,
    now,
    activityId as any,
  );
  return getActivityLog(activityId, logDate);
}

export async function updateActivityLog(
  id: number | string,
  patch: ActivityLogPatch,
): Promise<ActivityLog | null> {
  const database = await ensureDb();
  const current = await getLogById(id);
  if (!current) return null;

  const updated: ActivityLog = {
    ...current,
    ...patch,
    data: patch.data !== undefined ? patch.data : current.data,
    updatedAt: Date.now(),
  };

  await database.runAsync(
    `UPDATE activity_logs SET
      status = ?, progress = ?, started_at = ?,
      completed_at = ?, data = ?, updated_at = ?
     WHERE id = ?`,
    updated.status as any,
    updated.progress,
    updated.startedAt ?? null,
    updated.completedAt ?? null,
    toJson(updated.data),
    updated.updatedAt as any,
    id as any,
  );

  return updated;
}

export async function deleteActivityLog(id: number | string): Promise<void> {
  const database = await ensureDb();
  await database.runAsync("DELETE FROM activity_logs WHERE id = ?", id as any);
}

export async function getLogsForDate(logDate: string): Promise<ActivityLog[]> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE log_date = ?",
    logDate,
  );
  return (rows as ActivityLogRow[])
    .map(toActivityLog)
    .filter(Boolean) as ActivityLog[];
}

export async function getLogsInRange(
  startDate: string,
  endDate: string,
): Promise<ActivityLog[]> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE log_date >= ? AND log_date <= ? ORDER BY log_date ASC",
    startDate,
    endDate,
  );
  return (rows as ActivityLogRow[])
    .map(toActivityLog)
    .filter(Boolean) as ActivityLog[];
}

export async function getActivityHistory(
  activityId: number | string,
  limit = 30,
): Promise<ActivityLog[]> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE activity_id = ? ORDER BY log_date DESC LIMIT ?",
    activityId as any,
    limit,
  );
  return (rows as ActivityLogRow[])
    .map(toActivityLog)
    .filter(Boolean) as ActivityLog[];
}

export async function getLastCompletedDate(
  activityId: number | string,
): Promise<string | null> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    `SELECT MAX(log_date) AS last_date FROM activity_logs
     WHERE activity_id = ? AND status = 'completed'`,
    activityId as any,
  );
  return (rows as any[])[0]?.last_date ?? null;
}

// { activityId: lastCompletedDate } — optionally only completions before a date.
export async function getLastCompletedDates(
  beforeDate: string | null = null,
): Promise<Record<string, string>> {
  const database = await ensureDb();
  const rows = beforeDate
    ? await database.getAllAsync(
        `SELECT activity_id, MAX(log_date) AS last_date FROM activity_logs
         WHERE status = 'completed' AND log_date < ? GROUP BY activity_id`,
        beforeDate,
      )
    : await database.getAllAsync(
        `SELECT activity_id, MAX(log_date) AS last_date FROM activity_logs
         WHERE status = 'completed' GROUP BY activity_id`,
      );
  const map: Record<string, string> = {};
  (rows as any[]).forEach((row) => {
    map[row.activity_id] = row.last_date;
  });
  return map;
}
