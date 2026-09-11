import * as SQLite from "expo-sqlite";

let db;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("Routix");

  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  DROP TABLE IF EXISTS activities;

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    discribtion TEXT,
    priority TEXT NOT NULL,
    type TEXT NOT NULL,
    schedul TEXT NOT NULL
  );
`);

  return db;
}

export async function deleteActivity(activity) {
  await db.runAsync("DELETE FROM activities WHERE id = ?", activity.id);
}

export async function createActivity(activity) {
  const result = await db.runAsync(
    `INSERT INTO activities
      (title, discribtion, priority, type, schedul)
     VALUES (?, ?, ?, ?, ?)`,
    activity.title,
    activity.discribtion,
    activity.priority,
    activity.type,
    activity.schedul,
  );

  return { id: result.lastInsertRowId };
}

export function getDb() {
  return db;
}
