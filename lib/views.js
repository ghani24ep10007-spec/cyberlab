'use strict';

const CSS = `
:root{--bg:#0B1220;--card:#141E31;--line:#27364F;--txt:#E8EEF7;--mut:#93A3BC;--cy:#22D3EE;--or:#F97316}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font:15px/1.6 'Segoe UI',Arial,sans-serif}
a{color:var(--cy);text-decoration:none}nav{display:flex;gap:24px;padding:16px 32px;border-bottom:1px solid var(--line);align-items:center}
nav b{font-size:17px;letter-spacing:.5px}nav a{color:var(--mut)}nav a.on,nav a:hover{color:var(--cy)}
main{max-width:1120px;margin:0 auto;padding:32px}
h1{font-size:34px;margin:8px 0 4px}h2{font-size:22px;margin:36px 0 14px}
.mut{color:var(--mut)}.kicker{color:var(--cy);font-weight:700;letter-spacing:2px;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px}
.card h3{margin:0 0 8px;font-size:17px}.card p{margin:0;color:var(--mut);font-size:14px}
.tag{display:inline-block;font-size:11px;font-weight:700;padding:2px 10px;border-radius:99px;border:1px solid var(--line);color:var(--cy);margin-bottom:10px}
.tag.or{color:var(--or)}
table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
th{color:var(--mut);font-weight:600}
.badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px}
.b-high{background:#7f1d1d;color:#fecaca}.b-medium{background:#78350f;color:#fde68a}.b-low{background:#1e3a8a;color:#bfdbfe}.b-info{background:#1f2937;color:#9ca3af}
input,button,textarea{font:inherit;padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:#0F1728;color:var(--txt)}
button{background:var(--cy);color:#06202a;font-weight:700;border:none;cursor:pointer}
button.warn{background:var(--or);color:#2a1206}
code,pre{font-family:Consolas,monospace;background:#0F1728;border:1px solid var(--line);border-radius:6px;padding:2px 6px;font-size:13px;color:#a5f3fc}
pre{padding:12px;overflow:auto}
.kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.kpi .n{font-size:34px;font-weight:800;color:var(--cy)}.kpi .l{font-size:12px;color:var(--mut)}
.chain{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}
.chain span{background:#0F1728;border:1px solid var(--line);border-radius:8px;padding:4px 10px;font-size:12px}
.chain i{color:var(--or);font-style:normal;font-weight:700}
footer{margin-top:56px;padding:20px 32px;border-top:1px solid var(--line);color:var(--mut);font-size:13px}
.alert{border:1px solid #7f1d1d;background:#7f1d1d22;border-radius:10px;padding:14px 18px;margin:18px 0;font-size:14px}
`;

const NAV = (on) => `<nav><b>CYBER<span style="color:var(--cy)">LAB</span></b>
<a href="/" class="${on === 'home' ? 'on' : ''}">Materi Kuliah</a>
<a href="/lab" class="${on === 'lab' ? 'on' : ''}">Lab Serangan</a>
<a href="/siem" class="${on === 'siem' ? 'on' : ''}">Dashboard SIEM</a>
<span style="margin-left:auto" class="mut">Cyber Security — Semester 5</span></nav>`;

const page = (title, on, body) => `<!doctype html><html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — CyberLab</title><style>${CSS}</style></head>
<body>${NAV(on)}<main>${body}</main>
<footer>CyberLab — lingkungan belajar tertutup. Semua aktivitas serangan di sini hanya boleh dipraktikkan pada sistem sendiri/lab terisolasi, sesuai materi hukum siber.</footer>
</body></html>`;

function home() {
  return page('Materi Kuliah', 'home', `
<div class="kicker">MATA KULIAH CYBER SECURITY — KAMIS 12:00–14:30 WIB</div>
<h1>Bertahan dengan SIEM, Memahami Serangan untuk Mencegahnya</h1>
<p class="mut" style="max-width:760px">Sistem belajar satu aplikasi: materi kuliah, lab latihan serangan web (XSS & SQL injection bergaya Kali Linux), dan mini-SIEM yang mendeteksi serangan Anda secara real-time. Dirancang hemat RAM (satu proses Node.js, ±60–90 MB) agar aman untuk laptop 8 GB.</p>
<div class="alert"><b>Dosen pengampu:</b> Bapak Lasimin &nbsp;•&nbsp; <b>PJ materi:</b> Ghanii (SI semester 5) &nbsp;•&nbsp; <b>Konfirmasi kelas:</b> Kamis 12:00–14:30 WIB, luring</div>
<h2>Peta Modul</h2>
<div class="grid">
<div class="card"><span class="tag">BLUE TEAM</span><h3>1. SIEM — Pusat Kendali Pertahanan</h3><p>Security Information and Event Management: mengumpulkan log seluruh sistem, mengorelasikan event menjadi pola insiden, memberi alert, dan mendukung investigasi. Contoh produk: Splunk, Wazuh, Microsoft Sentinel.</p></div>
<div class="card"><span class="tag">BLUE TEAM</span><h3>2. SIEM Graph</h3><p>Analitik berbasis graf: node = user, perangkat, IP, proses, layanan cloud; edge = login, koneksi, eksekusi, API call. Memungkinkan multi-hop reasoning: attack path, lateral movement, blast radius — melengkapi korelasi tradisional, bukan menggantikannya.</p></div>
<div class="card"><span class="tag">BLUE TEAM</span><h3>3. Legal & Lisensi (Broadcom EULA)</h3><p>Produk keamanan enterprise (mis. Symantec, kini di bawah Broadcom) dipakai di bawah End User Agreement / Foundation Agreement. Pelajaran: alat defense legal & berlisensi; alat offense legal hanya dengan izin tertulis (authorized pentest).</p></div>
<div class="card"><span class="tag or">RED TEAM</span><h3>4. Kali Linux</h3><p>Distro Debian dari Offensive Security untuk penetration testing — ratusan tool bawaan: Nmap (recon), Burp Suite & SQLmap (web exploit), Hydra (password). Sesuai arahan Pak Lasimin: red team pakai Kali.</p></div>
<div class="card"><span class="tag or">RED TEAM</span><h3>5. XSS — Cross-Site Scripting</h3><p>Menyisipkan skrip jahat ke halaman yang dilihat korban. Tipe: reflected, stored, DOM-based. Dampak: pencurian cookie/session, defacement, phishing. Pembelaan: validasi input, encoding output, Content-Security-Policy.</p></div>
<div class="card"><span class="tag or">RED TEAM</span><h3>6. SQL Injection</h3><p>Menyuntikkan SQL lewat input yang digabung langsung ke query. Dampak: bypass login, baca/ubah/hapus database. Pembelaan: parameterized query, privilege minim, WAF. Coba sendiri di Lab Serangan.</p></div>
</div>
<h2>Mulai Praktik</h2>
<div class="grid">
<div class="card"><h3><a href="/lab">→ Lab Serangan (aplikasi rapuh)</a></h3><p>Login yang rentan SQL injection, pencarian rentan reflected XSS, dan buku tamu rentan stored XSS. Sengaja dibuat rapuh untuk latihan.</p></div>
<div class="card"><h3><a href="/siem">→ Dashboard mini-SIEM</a></h3><p>Lihat setiap serangan Anda terdeteksi, dikorelasi, dan menjadi alert + attack path — demonstrasi fungsi SIEM/SIEM Graph secara nyata.</p></div>
</div>`);
}

function lab(messages) {
  const rows = messages.map((m) => `<tr><td>${m.author}</td><td>${m.body}</td><td class="mut">${m.created_at}</td></tr>`).join('');
  return page('Lab Serangan', 'lab', `
<div class="kicker" style="color:var(--or)">LINGKUNGAN TERTUTUP — HANYA UNTUK LATIHAN</div>
<h1>Lab Serangan: SQLi & XSS</h1>
<p class="mut">Tiga kerentanan klasik OWASP Top 10 ditanam dengan sengaja. Buka <a href="/siem">/siem</a> di tab lain dan amati mini-SIEM menangkap setiap percobaan Anda.</p>
<div class="grid">
<div class="card"><h3>1. Login — SQL Injection</h3>
<form method="POST" action="/lab/login"><p><input name="username" placeholder="username" style="width:100%"></p><p><input name="password" type="text" placeholder="password" style="width:100%"></p><button>Masuk</button></form>
<p style="margin-top:12px">Payload bypass:<br><code>' OR '1'='1' -- </code><br>Baca semua user:<br><code>' UNION SELECT id,username,password,role FROM users--</code></p></div>
<div class="card"><h3>2. Pencarian — Reflected XSS</h3>
<form action="/lab/search"><p><input name="q" placeholder="cari materi..." style="width:100%"></p><button>Cari</button></form>
<p style="margin-top:12px">Payload:<br><code>&lt;script&gt;alert('XSS reflected')&lt;/script&gt;</code></p></div>
<div class="card"><h3>3. Buku Tamu — Stored XSS</h3>
<form method="POST" action="/lab/guestbook"><p><input name="author" placeholder="nama" style="width:100%"></p><p><textarea name="body" rows="2" placeholder="pesan" style="width:100%"></textarea></p><button>Kirim</button></form>
<p style="margin-top:12px">Payload tersimpan & dijalankan di browser setiap pengunjung:<br><code>&lt;script&gt;alert('XSS stored!')&lt;/script&gt;</code></p></div>
</div>
<h2>Buku Tamu</h2>
<table><tr><th>Penulis</th><th>Pesan</th><th>Waktu</th></tr>${rows}</table>
<h2>Tips Red Team (simulasi dari luar laptop)</h2>
<pre># Jalankan dari WSL/Terminal lain — header X-Forwarded-For dipakai lab ini
# untuk mensimulasikan IP penyerang berbeda (fitur demo, bukan celah produksi):
curl -s -X POST http://127.0.0.1:3000/lab/login \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -H "X-Forwarded-For: 10.66.66.66" \\
  --data-urlencode "username=' OR '1'='1' --" --data-urlencode "password=x"

# Brute force (5+ gagal dalam 60 detik → alert HIGH 'brute_force'):
for i in $(seq 1 6); do curl -s -X POST http://127.0.0.1:3000/lab/login \\
  -H "X-Forwarded-For: 45.12.12.12" --data "username=admin&password=tebak$i" >/dev/null; done</pre>`);
}

function searchResult(q) {
  return page('Hasil Pencarian', 'lab', `
<h1>Hasil untuk: ${q}</h1>
<p class="mut">Halaman ini menampilkan kata kunci Anda <b>apa adanya</b> — itulah celah reflected XSS. Coba <a href="/siem">cek SIEM</a>.</p>
<div class="card"><p><a href="/lab">← kembali ke Lab</a></p></div>`);
}

function loginWelcome(user) {
  return page('Berhasil', 'lab', `
<h1>Selamat datang, ${user.username} 👋</h1>
<div class="alert">Anda masuk <b>tanpa password yang benar</b> — bukti SQL injection berhasil. Baris database yang dikembalikan:<br><br>
<code>id=${user.id} • username=${user.username} • password=${user.password} • role=${user.role}</code></div>
<p><a href="/lab">← kembali</a> &nbsp; <a href="/siem">lihat jejak di SIEM →</a></p>`);
}

function loginFail() {
  return page('Gagal', 'lab', `<h1 style="color:var(--or)">Login gagal</h1><p class="mut">Username atau password salah. <a href="/lab">Coba lagi</a> — atau lewatkan dengan SQLi ;)</p>`);
}

function siem() {
  return page('Dashboard SIEM', 'siem', `
<div class="kicker">MINI-SIEM — KORELASI & ALERT REAL-TIME</div>
<h1>Dashboard SIEM</h1>
<p class="mut">Semua request ke aplikasi ini dicatat, dikorelasikan dengan aturan deteksi (pola SQLi/XSS, brute force), dan dirangkai menjadi attack path ala SIEM Graph. Refresh otomatis 3 detik.</p>
<div class="kpi">
<div class="card"><div class="n" id="kEvents">0</div><div class="l">Total event</div></div>
<div class="card"><div class="n" id="kAlerts" style="color:var(--or)">0</div><div class="l">Alert (medium+high)</div></div>
<div class="card"><div class="n" id="kHigh">0</div><div class="l">Severity HIGH</div></div>
<div class="card"><div class="n" id="kIps">0</div><div class="l">IP penyerang teridentifikasi</div></div>
</div>
<h2>Alert Terkini</h2>
<div class="card"><table id="tAlerts"><tr><th>Waktu</th><th>IP sumber</th><th>Jenis</th><th>Detail</th><th>Severity</th></tr></table></div>
<h2>Attack Path (multi-hop per IP)</h2>
<div class="card" id="paths" style="color:var(--mut)">Belum ada jalur serangan terdeteksi.</div>
<h2>Log Event (mentah)</h2>
<div class="card"><table id="tEvents"><tr><th>Waktu</th><th>IP</th><th>Metode</th><th>Path</th><th>Jenis</th><th>Severity</th></tr></table></div>
<p style="margin-top:20px"><button class="warn" onclick="fetch('/api/siem/reset',{method:'POST'}).then(load)">Reset Log SIEM</button></p>
<script>
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const badge=s=>'<span class="badge b-'+esc(s)+'">'+esc(s).toUpperCase()+'</span>';
async function load(){
  const [ev,al,st,pa]=await Promise.all([
    fetch('/api/siem/events?limit=40').then(r=>r.json()),
    fetch('/api/siem/alerts?limit=15').then(r=>r.json()),
    fetch('/api/siem/stats').then(r=>r.json()),
    fetch('/api/siem/paths').then(r=>r.json())]);
  kEvents.textContent=st.total; kAlerts.textContent=st.alerts; kHigh.textContent=st.high; kIps.textContent=st.attackers;
  tAlerts.innerHTML='<tr><th>Waktu</th><th>IP sumber</th><th>Jenis</th><th>Detail</th><th>Severity</th></tr>'+
    (al.length?al.map(a=>'<tr><td>'+esc(a.ts)+'</td><td>'+esc(a.source_ip)+'</td><td>'+esc(a.event_type)+'</td><td>'+esc(a.detail).slice(0,90)+'</td><td>'+badge(a.severity)+'</td></tr>').join(''):'<tr><td colspan=5 style=color:#93A3BC>Belum ada alert. Serang /lab dulu!</td></tr>');
  tEvents.innerHTML='<tr><th>Waktu</th><th>IP</th><th>Metode</th><th>Path</th><th>Jenis</th><th>Severity</th></tr>'+
    ev.map(e=>'<tr><td>'+esc(e.ts)+'</td><td>'+esc(e.source_ip)+'</td><td>'+esc(e.method)+'</td><td>'+esc(e.path).slice(0,60)+'</td><td>'+esc(e.event_type)+'</td><td>'+badge(e.severity)+'</td></tr>').join('');
  paths.innerHTML=pa.length?pa.map(p=>'<div style=margin-bottom:10px><b style=color:#22D3EE>'+esc(p.ip)+'</b><div class=chain>'+
    p.nodes.map(n=>'<span>'+esc(n)+'</span>').join('<i>→</i>')+'</div></div>').join(''):'Belum ada jalur serangan terdeteksi.';
}
load(); setInterval(load,3000);
</script>`);
}

module.exports = { home, lab, searchResult, loginWelcome, loginFail, siem };
