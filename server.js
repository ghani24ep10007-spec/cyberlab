'use strict';
const http = require('node:http');
const { URLSearchParams } = require('node:url');
const db = require('./lib/db');
const siem = require('./lib/siem');
const views = require('./lib/views');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

function send(res, code, html, headers = {}) {
  res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(html);
}
function json(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
function clientIp(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?').toString().split(',')[0].trim();
}
function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 65536) req.destroy(); });
    req.on('end', () => resolve(raw));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const ip = clientIp(req);
  const p = url.pathname;

  // ---------- Materi kuliah & dashboard ----------
  if (req.method === 'GET' && p === '/') { siem.analyzeRequest(req, ip); return send(res, 200, views.home()); }
  if (req.method === 'GET' && p === '/siem') { return send(res, 200, views.siem()); }

  // ---------- API mini-SIEM (endpoint ini bersih: output selalu di-escape di sisi client) ----------
  if (p.startsWith('/api/siem/')) {
    if (p === '/api/siem/events') return json(res, siem.recentEvents.all(Number(url.searchParams.get('limit')) || 40));
    if (p === '/api/siem/alerts') return json(res, siem.alerts.all(Number(url.searchParams.get('limit')) || 15));
    if (p === '/api/siem/paths') return json(res, siem.attackPaths());
    if (p === '/api/siem/stats') {
      const total = db.prepare('SELECT COUNT(*) n FROM events').get().n;
      const alerts = db.prepare("SELECT COUNT(*) n FROM events WHERE severity IN ('medium','high')").get().n;
      const high = db.prepare("SELECT COUNT(*) n FROM events WHERE severity='high'").get().n;
      const attackers = db.prepare("SELECT COUNT(DISTINCT source_ip) n FROM events WHERE severity IN ('medium','high')").get().n;
      return json(res, { total, alerts, high, attackers });
    }
    if (p === '/api/siem/reset' && req.method === 'POST') { siem.reset(); return json(res, { ok: true }); }
    return send(res, 404, '<h1>404</h1>');
  }

  // ---------- Lab serangan (SENGAJA RAPUH untuk edukasi) ----------
  if (req.method === 'GET' && p === '/lab') {
    siem.analyzeRequest(req, ip);
    const messages = db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 20').all();
    return send(res, 200, views.lab(messages));
  }

  if (req.method === 'POST' && p === '/lab/login') {
    const body = await readBody(req);
    siem.analyzeRequest(req, ip, body);
    const form = new URLSearchParams(body);
    const u = form.get('username') || '';
    const pw = form.get('password') || '';
    // --- SENGAJA RAWAN SQL INJECTION: input digabung langsung ke SQL ---
    let row;
    try {
      row = db.prepare(`SELECT * FROM users WHERE username='${u}' AND password='${pw}'`).get();
    } catch (err) {
      // Query rusak (mis. jumlah kolom UNION salah) — tetap tercatat, bukan crash.
      siem.record(ip, 'POST', '/lab/login', '', 'db_error', err.message.slice(0, 120), 'medium');
      return send(res, 200, views.loginFail());
    }
    if (row) {
      siem.noteLoginResult(ip, u, true);
      return send(res, 200, views.loginWelcome(row));
    }
    siem.noteLoginResult(ip, u, false);
    return send(res, 200, views.loginFail());
  }

  if (req.method === 'GET' && p === '/lab/search') {
    const q = url.searchParams.get('q') || '';
    siem.analyzeRequest(req, ip, q);
    // --- SENGAJA RAWAN REFLECTED XSS: q dirender tanpa escaping ---
    return send(res, 200, views.searchResult(q));
  }

  if (req.method === 'POST' && p === '/lab/guestbook') {
    const body = await readBody(req);
    siem.analyzeRequest(req, ip, body);
    const form = new URLSearchParams(body);
    // --- SENGAJA RAWAN STORED XSS: input disimpan & dirender mentah ---
    db.prepare('INSERT INTO messages (author, body) VALUES (?,?)')
      .run(form.get('author') || 'anonim', form.get('body') || '');
    res.writeHead(303, { Location: '/lab' });
    return res.end();
  }

  send(res, 404, '<h1>404 — halaman tidak ditemukan</h1><p><a href="/">Kembali</a></p>');
});

server.listen(PORT, HOST, () => {
  console.log(`CyberLab berjalan → http://${HOST}:${PORT}`);
  console.log('  /      materi kuliah   /lab  lab serangan   /siem  dashboard SIEM');
});
