import { ensureDb } from "./connection";
import { parseJson, toJson } from "./json";

// ---------------------------------------------------------------------------
// Activity definitions: WHAT an activity is (configuration, edited by user).
// Execution state lives in activityLogs.js, never here.
// ---------------------------------------------------------------------------
// type:         "normal" | "timed" | "follow_up" | "multi_activities"
// typeData:     null                          (normal)
//               { hours, minutes }            (timed duration)
//               [{ id, title }]                (follow_up steps)
//               [{ id, title, type, duration }] (multi_activities tasks)
// schedule:     "normal" | "weekly" | "interval"
// scheduleData: null | ["monday", ...] | "2"
// time:         null | { hours, minutes }
// NOTE: `status` is deprecated (kept for backward compatibility only).
// Daily execution status comes from activity_logs.
// ---------------------------------------------------------------------------

// Maps a raw DB row to the clean activity object used by the UI.
export function toActivity(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? row.discribtion ?? "",
    priority: row.priority,
    type: row.type,
    typeData: parseJson(row.type_data),
    schedule: row.schedule ?? row.schedul ?? "normal",
    scheduleData: parseJson(row.schedule_data),
    time: parseJson(row.time),
    createdAt: row.created_at ?? null,
    status: row.status ?? "pending",
    deletedAt: row.deleted_at ?? null,
  };
}

export async function getActivities() {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activities WHERE deleted_at IS NULL",
  );
  return rows.map(toActivity);
}

export async function getActivityById(id) {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activities WHERE id = ? AND deleted_at IS NULL",
    id,
  );
  return toActivity(rows[0] ?? null);
}

export async function softDeleteActivity(id) {
  const database = await ensureDb();
  await database.runAsync(
    "UPDATE activities SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
    Date.now(),
    id,
  );
}

export async function updateActivity(activity) {
  const database = await ensureDb();
  await database.runAsync(
    `UPDATE activities SET
      title = ?, description = ?, priority = ?,
      type = ?, type_data = ?,
      schedule = ?, schedule_data = ?,
      time = ?, status = ?
     WHERE id = ? AND deleted_at IS NULL`,
    activity.title,
    activity.description ?? "",
    activity.priority,
    activity.type,
    toJson(activity.typeData),
    activity.schedule,
    toJson(activity.scheduleData),
    toJson(activity.time),
    activity.status ?? "pending",
    activity.id,
  );
}

export async function createActivity(activity) {
  const database = await ensureDb();
  const result = await database.runAsync(
    `INSERT INTO activities
      (title, description, priority, type, type_data, schedule, schedule_data, time, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    activity.title,
    activity.description ?? "",
    activity.priority,
    activity.type,
    toJson(activity.typeData),
    activity.schedule,
    toJson(activity.scheduleData),
    toJson(activity.time),
    Date.now(),
  );

  return { id: result.lastInsertRowId };
}
