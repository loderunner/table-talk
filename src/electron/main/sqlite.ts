import sqlite, { Database } from 'better-sqlite3';

let db: Database | undefined = undefined;

export function init(location: string) {
  db = sqlite(location);
}

export function getSchema() {
  if (db === undefined) {
    return;
  }
  const stmt = db.prepare<[], { sql: string | null }>(
    'SELECT sql FROM sqlite_master',
  );
  const rows = stmt.all();
  return rows
    .filter((row) => row.sql !== null)
    .map((row) => row.sql)
    .join('\n');
}
