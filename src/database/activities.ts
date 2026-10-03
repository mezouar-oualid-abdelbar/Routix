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

export interface ActivityTime {
  hours?: number;
  minutes?: number;
}

export interface Activity {
  id: number | string;
  title: string;
  description: string;
  priority: string;
  type: string;
  typeData: any;
  schedule: string;
  scheduleData: any;
  time: ActivityTime | null;
  createdAt: number | null;
  status: string;
  deletedAt: number | null;
}

export interface ActivityRow {
  id: number | string;
  title: string;
  description?: string | null;
  discribtion?: string | null;
  priority: string;
  type: string;
  type_data?: string | null;
  schedule?: string | null;
  schedul?: string | null;
  schedule_data?: string | null;
  time?: string | null;
  created_at?: number | null;
  status?: string | null;
  deleted_at?: number | null;
}

export type ActivityInput = Partial<Activity>;

// Maps a raw DB row to the clean activity object used by the UI.
export function toActivity(row: ActivityRow | null | undefined): Activity | null {
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

export async function getActivities(): Promise<Activity[]> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activities WHERE deleted_at IS NULL",
  );
  return (rows as ActivityRow[]).map(toActivity).filter(Boolean) as Activity[];
}

export async function getActivityById(
  id: number | string,
): Promise<Activity | null> {
  const database = await ensureDb();
  const rows = await database.getAllAsync(
    "SELECT * FROM activities WHERE id = ? AND deleted_at IS NULL",
    id as any,
  );
  return toActivity((rows as ActivityRow[])[0] ?? null);
}

export async function softDeleteActivity(id: number | string): Promise<void> {
  const database = await ensureDb();
  await database.runAsync(
    "UPDATE activities SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
    Date.now(),
    id as any,
  );
}

export async function updateActivity(activity: ActivityInput & { id: number | string }): Promise<void> {
  const database = await ensureDb();
  await database.runAsync(
    `UPDATE activities SET
      title = ?, description = ?, priority = ?,
      type = ?, type_data = ?,
      schedule = ?, schedule_data = ?,
      time = ?, status = ?
     WHERE id = ? AND deleted_at IS NULL`,
    activity.title as any,
    activity.description ?? "",
    activity.priority as any,
    activity.type as any,
    toJson(activity.typeData),
    activity.schedule as any,
    toJson(activity.scheduleData),
    toJson(activity.time),
    activity.status ?? "pending",
    activity.id as any,
  );
}

export async function createActivity(
  activity: ActivityInput,
): Promise<{ id: number }> {
  const database = await ensureDb();
  const result = await database.runAsync(
    `INSERT INTO activities
      (title, description, priority, type, type_data, schedule, schedule_data, time, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    activity.title as any,
    activity.description ?? "",
    activity.priority as any,
    activity.type as any,
    toJson(activity.typeData),
    activity.schedule as any,
    toJson(activity.scheduleData),
    toJson(activity.time),
    Date.now(),
  );

  return { id: result.lastInsertRowId };
}
