import * as SQLite from "expo-sqlite";

let db = null;
let initPromise = null;

// ---------------------------------------------------------------------------
// Data shapes
// ---------------------------------------------------------------------------
// type:         "normal" | "timed" | "follow_up" | "multi_activities"
// typeData:     null                          (normal)
//               { hours, minutes }            (timed duration)
//               [{ id, title }]                (follow_up steps)
//               [{ id, title, type, duration }] (multi_activities tasks)
// schedule:     "normal" | "weekly" | "interval"
// scheduleData: null                          (normal)
//               ["monday", ...]               (weekly days)
//               "2"                           (interval, every N days)
// time:         null | { hours, minutes }     (reminder time of day)
// ---------------------------------------------------------------------------

function parseJson(value, fallback = null) {
  if (value == null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toJson(value) {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}

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

async function getColumnNames(database) {
  const info = await database.getAllAsync(`PRAGMA table_info(activities)`);
  return info.map((column) => column.name);
}

// Brings installs that still have the original schema up to date
// without losing stored activities.
async function migrateActivitiesTable(database) {
  const columns = await getColumnNames(database);

  if (columns.includes("discribtion") && !columns.includes("description")) {
    await database.execAsync(
      `ALTER TABLE activities RENAME COLUMN discribtion TO description;`,
    );
  }

  if (columns.includes("schedul") && !columns.includes("schedule")) {
    await database.execAsync(`ALTER TABLE activities RENAME COLUMN schedul TO schedule;`);
  }

  const names = await getColumnNames(database);
  const ensureColumn = async (name, definition) => {
    if (!names.includes(name)) {
      await database.execAsync(`ALTER TABLE activities ADD COLUMN ${name} ${definition};`);
      names.push(name);
    }
  };

  await ensureColumn("type_data", "TEXT");
  await ensureColumn("schedule_data", "TEXT");
  await ensureColumn("time", "TEXT");
  await ensureColumn("created_at", "INTEGER");
  await ensureColumn("status", "TEXT NOT NULL DEFAULT 'pending'");
  await ensureColumn("deleted_at", "INTEGER");
}

export async function initDatabase() {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const database = await SQLite.openDatabaseAsync("Routix");

    await database.execAsync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL,
    type TEXT NOT NULL,
    type_data TEXT,
    schedule TEXT NOT NULL,
    schedule_data TEXT,
    time TEXT,
    created_at INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    deleted_at INTEGER
  );
`);

    await migrateActivitiesTable(database);

    db = database;
    return db;
  })();

  try {
    return await initPromise;
  } catch (error) {
    initPromise = null;
    throw error;
  }
}

// Self-heals if the module was reloaded (e.g. Fast Refresh) after init.
async function ensureDb() {
  if (!db) await initDatabase();
  return db;
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

export async function updateActivityStatus(id, status) {
  const database = await ensureDb();
  await database.runAsync("UPDATE activities SET status = ? WHERE id = ?", status, id);
}

export function getDb() {
  return db;
}
