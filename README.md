# CyberLab — Sistem Belajar Cyber Security (Materi + Lab XSS/SQLi + Mini-SIEM)

Proyek akhir mata kuliah **Cyber Security** (Semester 5, S1) — Kamis 12:00–14:30 WIB,
dosen pengampu **Bapak Lasimin**.

Satu aplikasi Node.js **tanpa dependency eksternal** yang menggabungkan:

| Rute | Fungsi |
|---|---|
| `/` | Website materi kuliah: SIEM, SIEM Graph, legal/EULA, Blue vs Red Team, Kali Linux, XSS, SQLi |
| `/lab` | Lab serangan: aplikasi yang **sengaja rapuh** — SQLi di login, reflected XSS di pencarian, stored XSS di buku tamu |
| `/siem` | Dashboard mini-SIEM: logging, aturan korelasi, alert real-time, dan attack path ala SIEM Graph |

Dioptimalkan untuk **laptop RAM 8 GB**: satu proses Node.js (±60–90 MB RAM), tanpa Docker,
tanpa database server, tanpa Java.

## Prasyarat

- **Node.js ≥ 22.13** (memakai modul bawaan `node:sqlite` — tidak perlu `npm install` apa pun).
- Verifikasi: `node -v`

## Menjalankan

```bash
node server.js
# CyberLab berjalan → http://127.0.0.1:3000
```

Server **hanya bind ke 127.0.0.1** agar lab yang rentan tidak terekspos ke jaringan.
Ubah dengan environment variable `HOST`/`PORT` bila perlu.

## Alur praktikum yang disarankan

1. Buka **`/siem`** di satu tab (biarkan terbuka).
2. Buka **`/lab`**, lakukan serangan berurutan:
   - **SQLi bypass login:** username `' OR '1'='1' --`, password bebas.
   - **SQLi data theft:** username `' UNION SELECT id,username,password,role FROM users--`.
   - **Reflected XSS:** cari `<script>alert('XSS reflected')</script>`.
   - **Stored XSS:** kirim payload yang sama ke buku tamu — payload kini "menginap" dan
     berjalan di browser setiap pengunjung `/lab`.
   - **Brute force:** 5+ login gagal dari IP sama dalam 60 detik → alert `HIGH`.
3. Lihat **alert, severity, dan attack path** muncul otomatis di dashboard — persis fungsi
   SIEM (korelasi event → insiden) dan SIEM Graph (rantai kejadian per IP = attack path).
4. Simulasikan penyerang eksternal (fitur demo via header `X-Forwarded-For`):

```bash
curl -s -X POST http://127.0.0.1:3000/lab/login \
  -H "X-Forwarded-For: 45.12.12.12" \
  --data-urlencode "username=' OR '1'='1' --" --data-urlencode "password=x"
```

## Arsitektur

```
server.js          HTTP server + routing (node:http, zero dependency)
lib/db.js          node:sqlite — users, messages (buku tamu), events (log SIEM)
lib/siem.js        Deteksi & korelasi: regex pola serangan, rule brute force,
                   perangkai attack path per IP, tulis data/events.log (JSON lines)
lib/views.js       Semua halaman HTML (materi, lab, dashboard)
data/              cyberlab.db + events.log (di-gitignore)
docs/              panduan instal SIEM nyata untuk mesin yang lebih kuat
```

Setiap request dianalisis terhadap aturan deteksi (pola UNION/OR, `<script>`, event
handler, traversal, dsb.) dan dicatat ke tabel `events`. Dashboard polling API
`/api/siem/*` setiap 3 detik. `data/events.log` berformat **JSON per baris** sehingga
suatu saat bisa di-forward ke SIEM sungguhan (Filebeat/Fluent Bit → Wazuh/Splunk).

## SIEM sungguhan (Wazuh / Splunk)

Karena RAM laptop ini terbatas, panduan instalasi Wazuh (open source) dan Splunk Free
disiapkan di [`docs/siem-install-guide.md`](docs/siem-install-guide.md) — untuk dijalankan
di VM/PC lab kampus/server, lalu log CyberLab di-forward ke sana.

## Disclaimer etik & hukum

Aplikasi ini **sengaja dibuat rapuh** dan hanya boleh dieksploitasi pada instalasi lokal
milik sendiri. Menerapkan teknik yang sama pada sistem orang lain tanpa izin tertulis
adalah pelanggaran UU ITE (Indonesia) / hukum siber setempat — inilah alasan materi
"Legal & Lisensi (Broadcom EULA)" masuk kurikulum.

## Push ke GitHub

```bash
git init && git add -A && git commit -m "CyberLab: materi + lab XSS/SQLi + mini-SIEM"
# Buat repo kosong di https://github.com/new (nama: cyberlab), lalu:
git remote add origin https://github.com/ghani24ep10007-spec/cyberlab.git
git branch -M main && git push -u origin main
```
