import { ensureDb } from "./connection";
import { parseJson, toJson } from "./json";
import { LOG_STATUS } from "../constants/logStatus";

// ---------------------------------------------------------------------------
// Activity execution history: WHAT HAPPENED when the user performed an
// activity. One row per activity per scheduled day (UNIQUE constraint).
// Type-specific progress details live in `data` as JSON:
//   timed:            { totalSeconds, elapsedSeconds }
//   follow_up:        { completedStepIds: [] }   (in definition order)
//   multi_activities: { completedTaskIds: [] }
//   normal:           null
// ---------------------------------------------------------------------------

export function toActivityLog(row) {
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

export async function getLogById(id) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE id = ?",
    id,
  );
  return toActivityLog(rows[0] ?? null);
}

export async function getActivityLog(activityId, logDate) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE activity_id = ? AND log_date = ?",
    activityId,
    logDate,
  );
  return toActivityLog(rows[0] ?? null);
}

export async function getOrCreateActivityLog(activityId, logDate) {
  const database = await ensureDb();
  const now = Date.now();
  // Snapshot the title so history stays readable after edits/soft-delete.
  await database.runAsync(
    `INSERT OR IGNORE INTO activity_logs
      (activity_id, log_date, status, progress, activity_title, created_at, updated_at)
     SELECT ?, ?, 'pending', 0, title, ?, ? FROM activities WHERE id = ?`,
    activityId,
    logDate,
    now,
    now,
    activityId,
  );
  return getActivityLog(activityId, logDate);
}

export async function updateActivityLog(id, patch) {
  const database = await ensureDb();
  const current = await getLogById(id);
  if (!current) return null;

  const updated = {
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
    updated.status,
    updated.progress,
    updated.startedAt ?? null,
    updated.completedAt ?? null,
    toJson(updated.data),
    updated.updatedAt,
    id,
  );

  return updated;
}

export async function getLogsForDate(logDate) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE log_date = ?",
    logDate,
  );
  return rows.map(toActivityLog);
}

export async function getLogsInRange(startDate, endDate) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE log_date >= ? AND log_date <= ? ORDER BY log_date ASC",
    startDate,
    endDate,
  );
  return rows.map(toActivityLog);
}

export async function getActivityHistory(activityId, limit = 30) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activity_logs WHERE activity_id = ? ORDER BY log_date DESC LIMIT ?",
    activityId,
    limit,
  );
  return rows.map(toActivityLog);
}

// { activityId: lastCompletedDate } — optionally only completions before a date.
export async function getLastCompletedDates(beforeDate = null) {
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
  const map = {};
  rows.forEach((row) => {
    map[row.activity_id] = row.last_date;
  });
  return map;
}
