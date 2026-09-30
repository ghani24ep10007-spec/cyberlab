'use strict';
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'cyberlab.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT,
  body TEXT,
  created_at TEXT DEFAULT (datetime('now','localtime'))
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT DEFAULT (datetime('now','localtime')),
  source_ip TEXT,
  method TEXT,
  path TEXT,
  user_agent TEXT,
  event_type TEXT,
  detail TEXT,
  severity TEXT
);
INSERT OR IGNORE INTO users (username, password, role) VALUES
  ('admin', 'AdminRahasia123!', 'admin'),
  ('dosen', 'Dosen2026', 'dosen'),
  ('mhs',   'Mahasiswa1',  'mahasiswa');
`);

module.exports = db;
