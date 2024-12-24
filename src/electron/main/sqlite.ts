import sqlite, { Database, RunResult } from 'better-sqlite3';

let db: Database | undefined = undefined;

export function init(location: string) {
  db = sqlite(location);
}

export function getSchema() {
  if (db === undefined) {
    return;
  }
  const stmt = db.prepare<[], { sql: string }>(
    'SELECT sql FROM sqlite_master WHERE sql IS NOT NULL',
  );
  const rows = stmt.all();
  return rows.map((row) => row.sql).join('\n');
}

export type SQLError = {
  error: string;
};

export function select(sql: string): unknown[] | SQLError {
  if (db === undefined) {
    return { error: 'no database connection' };
  }
  try {
    const stmt = db.prepare(sql);
    const rows = stmt.all();
    return rows;
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

export function execute(sql: string): RunResult | SQLError {
  if (db === undefined) {
    return { error: 'no database connection' };
  }
  try {
    const stmt = db.prepare(sql);
    return stmt.run();
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
