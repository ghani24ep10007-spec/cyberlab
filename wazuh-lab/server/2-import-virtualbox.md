# Import Wazuh OVA di VirtualBox (PC Lab)

## 1. Pasang VirtualBox (bila belum)
Unduh https://www.virtualbox.org/wiki/Downloads (Windows hosts). Saat instal, izinkan
jaringan/virtualisasi — PC lab butuh izin administrator.

## 2. Import OVA
1. VirtualBox → **File → Import Appliance** → pilih `wazuh-4.14.8.ova`.
2. Pada dialog konfigurasi, set:
   - RAM: **8192 MB** (kurangi ke 6144 MB hanya bila PC 8 GB — tidak disarankan)
   - CPU: **4**
   - Network Adapter 1: **Bridged Adapter** → pilih NIC yang aktif (Wi-Fi/LAN kampus)
     supaya VM mendapat IP satu segmen dengan ThinkPad.
3. Import → Start VM. Tunggu boot selesai (layar login CentOS/RHEL).

## 3. Akses pertama
- Login VM: user `root` / pass `wazuh` (**segera ganti:** passwd)
- Dashboard: `https://IP-VM:443`
  - user: `wazuh-wui` / pass: `MyS3cr37P450r.*-` → ganti lewat
    `/usr/share/wazuh-indexer/bin/indexer-security-init.sh` atau dokumentasi resmi
- API untuk enrollment agent: password default `MySecretPassword`
  (cek `/var/ossec/etc/authd.pass`), samakan dengan yang dipakai `install-agent.ps1`.

Cari IP VM dari dalam: `ip a` (mis. 192.168.1.50).

## 4. Uji dari ThinkPad
```powershell
Test-NetConnection IP-VM -Port 443    # dashboard
Test-NetConnection IP-VM -Port 1515   # enrollment API
```

## 5. Keamanan wajib sebelum dipakai di lab
- Ganti semua password default di atas.
- Batasi akses dashboard ke segmen jaringan lab.
- Jangan forward port VM ke internet.
