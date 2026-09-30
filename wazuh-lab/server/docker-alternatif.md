# Alternatif Server: Wazuh via Docker (PC Lab)

Untuk PC lab yang sudah punya **Docker Desktop** (WSL2) dan RAM ≥ 16 GB — lebih ringan
di kelola daripada VM VirtualBox.

```powershell
# PowerShell di PC lab
git clone https://github.com/wazuh/wazuh-docker.git -b v4.14.8
cd wazuh-docker\single-node
docker compose up -d
```

- Dashboard: https://localhost:4443 (user `admin` / `SecretPassword` — ganti!)
- Enrollment API: port `9200` indexer, agent connect ke port `1514/1515`.
- Agar ThinkPad bisa mengakses: jalankan di PC lab
  `docker compose ps` lalu gunakan IP LAN PC lab (port sudah di-publish).

Bila sertifikat self-signed ditolak agent, tambahkan flag `--no-ssl-verify` saat install
agent (lihat install-agent.ps1) atau salin `root-ca.pem` dari wazuh-docker.

Kebutuhan riil: ±6–8 GB RAM untuk container Wazuh — pastikan PC lab kuat, laptop Anda
cukup menjalankan agent-nya saja.
