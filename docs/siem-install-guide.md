# Panduan SIEM Sungguhan — Wazuh & Splunk (untuk VM / PC Lab / Server)

Mini-SIEM di CyberLab memakai konsep yang sama dengan produk industri. Untuk pengalaman
penuh, jalankan salah satu berikut di mesin dengan **RAM ≥ 8 GB tersedia** (mis. PC lab
kampus atau VM cloud) — jangan di laptop 8 GB yang sudah terpakai ±78%.

## Opsi 1 — Wazuh (open source, rekomendasi kuliah)

Komponen: Wazuh server + indexer + dashboard. Kebutuhan minimal riil: 4 vCPU, 8 GB RAM,
30 GB disk.

### A. Install cepat (single node, Docker)

```bash
# Docker + compose plugin wajib ada
git clone https://github.com/wazuh/wazuh-docker.git -b v4.9.0
cd wazuh-docker/single-node
docker compose up -d
# Dashboard: https://localhost:4443  (user: admin, pass: SecretPassword)
```

### B. Forward log CyberLab ke Wazuh

Log CyberLab sudah JSON-per-baris di `data/events.log`. Tambahkan di
`wazuh.yml` agent (monitoring langsung file):

```yaml
logs:
  - name: cyberlab-events
    location: /var/ossec/etc/shared/events.log   # salin/sync file log ke sini
    decoder: json
```

atau kirim via Filebeat → Wazuh indexer sesuai template wazuh-docker.

## Opsi 2 — Splunk Free (produk yang dibuka di kelas)

```bash
# Windows: unduh installer dari splunk.com (butuh akun) — Free: 1 indeks 505 MB/hari
# atau Docker:
docker run -d -p 8000:8000 -p 9997:9997 \
  -e SPLUNK_START_ARGS=--accept-license \
  -e SPLUNK_PASSWORD=CyberLab2026 \
  --name splunk splunk/splunk:latest
# Buka http://localhost:8000
```

Input log CyberLab: Settings → Add Data → Monitor → pilih file `data/events.log`,
aktifkan JSON parsing. Contoh pencarian (mirip aturan di lib/siem.js):

```
index=cyberlab event_type=sqli | table ts, source_ip, detail, severity
index=cyberlab | stats count by source_ip, event_type | sort -count
```

## Opsi 3 — Splunk/ELK ringan di cloud

VM 8 GB di GCP/AWS free-tier kampus + `splunk` atau `elk-single-node` via docker compose;
akses dashboard lewat SSH tunnel `ssh -L 8000:localhost:8000 user@vm`.

## Catatan keamanan

- Jangan pernah expose instalasi lab (CyberLab, DVWA, Wazuh demo) ke internet publik.
- Gunakan password berbeda dari kredensial asli; semua kredensial di repo ini fiktif.
- Dokumentasikan hasil (screenshot alert SIEM) sebagai bukti kerja proyek akhir.
