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

    INSERT INTO activities (title, time) VALUES
        ('activity 1', '1:00 AM'),
        ('activity 2', '2:00 AM'),
        ('activity 3', '3:00 AM');

  `);

  return db;
}

export function getDb() {
  return db;
}
