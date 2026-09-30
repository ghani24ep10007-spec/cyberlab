# Unduh Wazuh OVA resmi (single-node) ke folder saat ini.
# Jalankan di PC lab: powershell -ExecutionPolicy Bypass -File .\1-download-ova.ps1
$WAZUH_VERSION = "4.14.8"
$url  = "https://packages.wazuh.com/4.x/vm/wazuh-$WAZUH_VERSION.ova"
$out  = "$PSScriptRoot\wazuh-$WAZUH_VERSION.ova"

Write-Host "Mengunduh Wazuh OVA v$WAZUH_VERSION (±4.4 GB)..." -ForegroundColor Cyan
Write-Host "URL : $url"
Write-Host "Ke  : $out"

$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing

$size = (Get-Item $out).Length / 1GB
Write-Host ("Selesai. Ukuran {0:N2} GB. Lanjut ke 2-import-virtualbox.md" -f $size) -ForegroundColor Green
