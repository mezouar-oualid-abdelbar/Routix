import * as SQLite from "expo-sqlite";
import { parseJson } from "./json";

let db = null;
let initPromise = null;

async function getColumnNames(database, table) {
  const info = await database.getAllAsync(`PRAGMA table_info(${table})`);
  return info.map((column) => column.name);
}

// Brings installs that still have the original schema up to date
// without losing stored activities.
async function migrateActivitiesTable(database) {
  const columns = await getColumnNames(database, "activities");

  if (columns.includes("discribtion") && !columns.includes("description")) {
    await database.execAsync(
      `ALTER TABLE activities RENAME COLUMN discribtion TO description;`,
    );
  }

  if (columns.includes("schedul") && !columns.includes("schedule")) {
    await database.execAsync(`ALTER TABLE activities RENAME COLUMN schedul TO schedule;`);
  }

  const names = await getColumnNames(database, "activities");
  const ensureColumn = async (name, definition) => {
    if (!names.includes(name)) {
      await database.execAsync(
        `ALTER TABLE activities ADD COLUMN ${name} ${definition};`,
      );
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

async function migrateActivityLogsTable(database) {
  const names = await getColumnNames(database, "activity_logs");
  if (!names.includes("activity_title")) {
    await database.execAsync(
      `ALTER TABLE activity_logs ADD COLUMN activity_title TEXT;`,
    );
  }
}

// Legacy timed rows saved without a duration get a 5-minute default so
// execution never runs on an incorrect fallback.
async function backfillTimedDurations(database) {
  const rows = await database.getAllAsync(
    `SELECT id, type_data FROM activities
     WHERE type = 'timed' AND deleted_at IS NULL`,
  );
  const fallback = JSON.stringify({ hours: 0, minutes: 5 });
  for (const row of rows) {
    const data = parseJson(row.type_data);
    const total = (data?.hours ?? 0) + (data?.minutes ?? 0);
    if (total <= 0) {
      await database.runAsync(`UPDATE activities SET type_data = ? WHERE id = ?`, fallback, row.id);
    }
  }
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

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL REFERENCES activities(id),
    log_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    progress INTEGER NOT NULL DEFAULT 0,
    started_at INTEGER,
    completed_at INTEGER,
    data TEXT,
    activity_title TEXT,
    created_at INTEGER,
    updated_at INTEGER,
    UNIQUE (activity_id, log_date)
  );
`);

    await migrateActivitiesTable(database);
    await migrateActivityLogsTable(database);
    await backfillTimedDurations(database);

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
export async function ensureDb() {
  if (!db) await initDatabase();
  return db;
}

export function getDb() {
  return db;
}
