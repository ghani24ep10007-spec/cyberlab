# Checklist Verifikasi End-to-End (untuk laporan proyek akhir)

Lakukan berurutan; setiap langkah = 1 screenshot bernomor untuk laporan.

| # | Uji | Lokasi | Hasil diharapkan |
|---|---|---|---|
| 1 | VM/server Wazuh nyala | PC lab | `https://IP:443` menampilkan login |
| 2 | Agent terdaftar | Dashboard → Agents | ThinkPad **Active**, grup `cyberlab-students` |
| 3 | CyberLab jalan | ThinkPad | `node server.js` → http://127.0.0.1:3000 |
| 4 | Serangan SQLi terdeteksi mini-SIEM | `/siem` | alert `sqli` severity HIGH |
| 5 | Event yang sama masuk Wazuh | Analytics → Security events | rule `100010` / message CyberLab |
| 6 | Serangan XSS | `/lab` → payload | alert `xss` di kedua dashboard |
| 7 | Brute force (6x login gagal) | curl / manual | alert `brute_force` |
| 8 | Attack path | `/siem` + Wazuh → Threat Hunting | rantai IP → sqli → login_ok |
| 9 | Beban RAM ThinkPad | Task Manager | agent ±100 MB, CyberLab ±40 MB |

## Format penulisan hasil di laporan

- Bandingkan deteksi mini-SIEM vs Wazuh: aturan, latency, visualisasi.
- Kaitkan dengan materi: korelasi event, attack path, blast radius (SIEM Graph),
  dan peran blue team.
- Cantumkan disclaimer etik: semua serangan dilakukan pada lab milik sendiri.
