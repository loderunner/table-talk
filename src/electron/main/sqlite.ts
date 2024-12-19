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

export type SQLError = {
  error: string;
};

export function select(
  sql: string,
  ...params: any[]
): unknown[] | SQLError | void {
  if (db === undefined) {
    return;
  }
  try {
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    return rows;
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: String(err) };
  }
}

export function execute(
  sql: string,
  ...params: any[]
): { error: string } | void {
  if (db === undefined) {
    return;
  }
  try {
    const stmt = db.prepare(sql);
    stmt.run(...params);
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: String(err) };
  }
}

export function pragma(sql: string): unknown[] | SQLError | void {
  if (db === undefined) {
    return;
  }
  try {
    return db.pragma(sql) as unknown[];
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: String(err) };
  }
}
