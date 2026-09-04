import * as SQLite from "expo-sqlite";

let db;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("Routix");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        time TEXT NOT NULL
    );
  
  `);

  return db;
}

export async function deleteActivity(activity) {
  await db.runAsync("DELETE FROM activities WHERE id = ?", activity.id);
}

export async function insertActivity(activity) {
  await db.runAsync(
    "INSERT INTO activities (title, time) VALUES (?, ?)",
    activity.title,
    activity.time,
  );
}

export async function updateActivity(activity) {
  await db.runAsync(
    "UPDATE activities SET title = ?, time = ? WHERE id = ?",
    activity.title,
    activity.time,
    activity.id,
  );
}
export function getDb() {
  return db;
}
