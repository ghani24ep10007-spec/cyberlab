# Meneruskan Log CyberLab ke Wazuh (via agent Windows)

CyberLab menulis log event dalam format **JSON per baris** di:

```
D:\BACKEND_DEV\Semester_5\cyberlab\data\events.log
```

Contoh baris:

```json
{"ts":"2026-10-01T05:00:00.000Z","source_ip":"45.12.12.12","method":"POST","path":"/lab/login","event_type":"sqli","detail":"pola terdeteksi: ...","severity":"high"}
```

## 1. Edit konfigurasi agent

Buka `C:\Program Files (x86)\ossec-agent\ossec.conf` (Notepad sebagai Administrator),
tambahkan di dalam `<ossec_config>`:

```xml
<localfile>
  <log_format>json</log_format>
  <location>D:\BACKEND_DEV\Semester_5\cyberlab\data\events.log</location>
  <label key="system">cyberlab</label>
</localfile>
```

## 2. Restart agent

```powershell
Restart-Service WazuhSvc
```

## 3. Buat rule di server (opsional, agar alert Wazuh selaras mini-SIEM)

Tambahkan di server: `/var/ossec/etc/rules/local_rules.xml`

```xml
<group name="cyberlab,">
  <rule id="100010" level="12">
    <decoded_name>json</decoded_name>
    <field name="event_type">^sqli$</field>
    <description>CyberLab: SQL injection attempt</description>
  </rule>
  <rule id="100011" level="12">
    <decoded_name>json</decoded_name>
    <field name="event_type">^xss$</field>
    <description>CyberLab: XSS attempt</description>
  </rule>
  <rule id="100012" level="10">
    <decoded_name>json</decoded_name>
    <field name="event_type">^brute_force$</field>
    <description>CyberLab: brute force login</description>
  </rule>
</group>
```

Lalu `systemctl restart wazuh-manager` di server.

## 4. Uji

1. Serang `/lab` (payload SQLi/XSS ada di halaman lab CyberLab).
2. Dashboard Wazuh → **Analytics → Security events** → filter `rule.groups: cyberlab`
   atau keyword `sqli`.
3. Screenshot untuk laporan akhir (lihat `../verifikasi.md`).

Nilai edukasi: Anda baru saja membuat **dua lapis SIEM** — mini-SIEM lokal (deteksi
real-time di aplikasi) dan Wazuh (log management enterprise) — persis alur materi
kuliahan Pak Lasimin.
