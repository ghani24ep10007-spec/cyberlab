# Wazuh Lab — Deployment Kit (PC Lab Kampus)

Paket instalasi **Wazuh SIEM** untuk mata kuliah Cyber Security:
**server** jalan di PC lab kampus (RAM ≥ 8 GB), **agent** jalan di ThinkPad Anda
(ringan, ±100 MB RAM), lalu log CyberLab ikut dipantau — satu cerita utuh
blue team (Wazuh) + red team (lab serangan) untuk proyek akhir.

## Ringkasan arsitektur

```
[PC LAB kampus]  Wazuh Server + Dashboard  :443/4443   (OVA/VM, RAM 8 GB dialokasikan)
      ▲ enrollment otomatis (password)
      │
[ThinkPad Anda]  Wazuh Agent (Windows)  ── memantau endpoint + mengirim log CyberLab
                                            data/events.log (JSON lines)
```

## Yang ada di folder ini

| File | Untuk | Dijalankan di |
|---|---|---|
| `server/1-download-ova.ps1` | Unduh Wazuh OVA resmi (±4.4 GB) | PC lab |
| `server/2-import-virtualbox.md` | Langkah import & setting VM VirtualBox | PC lab |
| `server/docker-alternatif.md` | Alternatif: Wazuh via Docker (tanpa VM) | PC lab |
| `agent/install-agent.ps1` | Unduh + install agent Windows senyap (butuh IP server) | ThinkPad |
| `agent/uninstall-agent.ps1` | Hapus agent bersih | ThinkPad |
| `agent/cyberlab-log-forwarding.md` | Config agent agar log CyberLab ikut dikirim ke server | ThinkPad |
| `verifikasi.md` | Checklist uji end-to-end + screenshot untuk laporan | keduanya |

## Urutan pakai (ringkas)

1. **Di PC lab**: jalankan `server/1-download-ova.ps1` (bawa di USB), import VM per
   `server/2-import-virtualbox.md`, nyalakan, catat **IP server** (mis. `192.168.x.x`).
2. **Di ThinkPad** (PowerShell sebagai Administrator):
   ```powershell
   .\install-agent.ps1 -ServerHost 192.168.x.x
   # password enrollment default OVA: MySecretPassword (ganti di server bila perlu)
   ```
3. Buka dashboard `https://IP-SERVER:443` → user `wazuh-wui` / `MyS3cr37P450r.*-`
   → Agents: ThinkPad Anda harus berstatus **Active**.
4. Teruskan log CyberLab per `agent/cyberlab-log-forwarding.md`, lalu serang `/lab`
   — event `sqli`/`xss` harus muncul di dashboard Wazuh.
5. Dokumentasikan dengan screenshot untuk laporan akhir (lihat `verifikasi.md`).

## Kebutuhan PC lab (syarat minimum resmi Wazuh)

- CPU 4 core, **RAM 8 GB tersedia khusus untuk VM** (idealnya PC 16 GB)
- Disk kosong ≥ 50 GB, VirtualBox terpasang, jaringan LAN/Wi-Fi satu segmen dengan ThinkPad
- Jika PC lab hanya punya Windows tanpa VirtualBox → pakai jalur Docker (`server/docker-alternatif.md`)

## Catatan penting

- Jangan expose server Wazuh ke internet publik; cukup jaringan lab.
- Ganti semua password default OVA segera setelah login pertama (ada di dokumen import).
- Versi pada skrip = 4.14.8; cek https://documentation.wazuh.com untuk versi terbaru
  dan sesuaikan variabel `$WAZUH_VERSION` di skrip bila perlu.
