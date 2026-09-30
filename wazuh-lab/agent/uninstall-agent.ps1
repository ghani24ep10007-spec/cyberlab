# Hapus Wazuh agent dari Windows secara bersih.
# PowerShell sebagai Administrator:
#   powershell -ExecutionPolicy Bypass -File .\uninstall-agent.ps1
$ErrorActionPreference = 'Stop'
$msiPath = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
  -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -like 'Wazuh*' } |
  Select-Object -First 1).PSChildName

if (-not $msiPath) { Write-Host "Wazuh agent tidak ditemukan — tidak ada yang dihapus."; exit 0 }

Stop-Service WazuhSvc -Force -ErrorAction SilentlyContinue
Start-Process msiexec.exe -Wait -ArgumentList '/x', $msiPath, '/q', '/norestart', 'WAZUH_REMOVE_CONFIG=1'
Write-Host "Wazuh agent telah dihapus." -ForegroundColor Green
