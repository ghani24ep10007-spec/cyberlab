'use strict';
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');

const logFile = path.join(__dirname, '..', 'data', 'events.log');

const ATTACK_PATTERNS = [
  { type: 'sqli', severity: 'high', re: /\bunion\b[\s\S]*\bselect\b/i },
  { type: 'sqli', severity: 'high', re: /(['"])\s*(or|and)\s*\1?\s*\d+\s*=\s*\d+/i },
  { type: 'sqli', severity: 'high', re: /\b(drop|delete|update|insert)\b.*(--|;)/i },
  { type: 'sqli', severity: 'medium', re: /information_schema/i },
  { type: 'sqli', severity: 'medium', re: /\b(sleep|benchmark)\s*\(/i },
  { type: 'sqli', severity: 'medium', re: /--\s*$|\/\*.*\*\// },
  { type: 'xss', severity: 'high', re: /<script[^>]*>/i },
  { type: 'xss', severity: 'high', re: /<svg[^>]*onload/i },
  { type: 'xss', severity: 'medium', re: /on(error|load|click|mouseover|focus)\s*=/i },
  { type: 'xss', severity: 'medium', re: /javascript:/i },
  { type: 'xss', severity: 'low', re: /\b(alert|prompt|confirm)\s*\(/i },
  { type: 'traversal', severity: 'high', re: /\.\.\/|\.\.\\/ },
];

const insertEvent = db.prepare(
  'INSERT INTO events (source_ip, method, path, user_agent, event_type, detail, severity) VALUES (?,?,?,?,?,?,?)'
);
const countRecent = db.prepare(
  "SELECT COUNT(*) AS n FROM events WHERE event_type='login_fail' AND source_ip=? AND ts > datetime('now','localtime','-60 seconds')"
);

function record(sourceIp, method, urlPath, userAgent, eventType, detail, severity) {
  insertEvent.run(sourceIp, method, urlPath, userAgent, eventType, detail, severity);
  const line = JSON.stringify({ ts: new Date().toISOString(), source_ip: sourceIp, method, path: urlPath, event_type: eventType, detail, severity });
  fs.appendFile(logFile, line + '\n', () => {});
}

// Analisis setiap request: cocokkan pola serangan pada path + query + body.
function analyzeRequest(req, ip, bodyText) {
  const url = req.url || '/';
  const haystack = url + '\n' + (bodyText || '');
  const method = req.method;

  record(ip, method, url.slice(0, 300), (req.headers['user-agent'] || '').slice(0, 120),
    'http_request', 'akses halaman', 'info');

  for (const p of ATTACK_PATTERNS) {
    if (p.re.test(haystack)) {
      record(ip, method, url.slice(0, 300), (req.headers['user-agent'] || '').slice(0, 120),
        p.type, 'pola terdeteksi: ' + p.re.source, p.severity);
      break;
    }
  }
}

function noteLoginResult(ip, username, ok) {
  if (ok) {
    record(ip, 'POST', '/lab/login', '', 'login_ok', 'login berhasil: ' + username, 'info');
    return;
  }
  record(ip, 'POST', '/lab/login', '', 'login_fail', 'login gagal: ' + username, 'low');
  const { n } = countRecent.get(ip);
  if (n >= 5) {
    record(ip, 'POST', '/lab/login', '', 'brute_force', n + ' percobaan login gagal dari IP ini dalam 60 detik', 'high');
  }
}

const alerts = db.prepare(
  "SELECT id, ts, source_ip, event_type, detail, severity FROM events WHERE severity IN ('medium','high') ORDER BY id DESC LIMIT ?"
);
const recentEvents = db.prepare(
  'SELECT id, ts, source_ip, method, path, event_type, detail, severity FROM events ORDER BY id DESC LIMIT ?'
);
const statsQuery = db.prepare(
  'SELECT event_type, COUNT(*) AS n FROM events GROUP BY event_type ORDER BY n DESC'
);
const attackerQuery = db.prepare(
  "SELECT source_ip, COUNT(*) AS n FROM events WHERE severity IN ('medium','high') GROUP BY source_ip ORDER BY n DESC LIMIT 10"
);
const chainQuery = db.prepare(
  'SELECT ts, event_type, detail FROM events WHERE source_ip=? ORDER BY id ASC LIMIT 50'
);
const ipsQuery = db.prepare(
  "SELECT DISTINCT source_ip FROM events WHERE severity IN ('medium','high')"
);

// Kill-chain per IP penyerang — meniru konsep SIEM Graph: node = entitas, edge = urutan kejadian.
function attackPaths() {
  const paths = [];
  for (const { source_ip } of ipsQuery.all()) {
    const chain = chainQuery.all(source_ip);
    if (!chain.length) continue;
    const kinds = new Set(chain.map((e) => e.event_type));
    const order = ['http_request', 'sqli', 'xss', 'login_fail', 'brute_force', 'login_ok', 'traversal'];
    const nodes = ['IP:' + source_ip, ...order.filter((k) => kinds.has(k))];
    paths.push({ ip: source_ip, nodes, events: chain.slice(-10) });
  }
  return paths.sort((a, b) => b.nodes.length - a.nodes.length).slice(0, 5);
}

function reset() {
  db.exec("DELETE FROM events");
}

module.exports = { analyzeRequest, noteLoginResult, record, alerts, recentEvents, statsQuery, attackerQuery, attackPaths, reset };
