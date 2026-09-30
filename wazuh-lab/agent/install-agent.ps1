# Install Wazuh agent (Windows) secara senyap + enrollment ke server lab.
# Jalankan di ThinkPad, PowerShell AS ADMINISTRATOR:
#   powershell -ExecutionPolicy Bypass -File .\install-agent.ps1 -ServerHost 192.168.1.50
param(
  [Parameter(Mandatory = $true)][string]$ServerHost,
  [string]$AgentGroup = "cyberlab-students",
  [string]$EnrollmentPassword = "MySecretPassword",   # samakan dengan /var/ossec/etc/authd.pass di server
  [string]$WazuhVersion = "4.14.8",
  [string]$WazuhRevision = "1"
)

$ErrorActionPreference = 'Stop'
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) { throw "Jalankan sebagai Administrator." }

# Uji konektivitas dulu agar error jelas bila server tak ketemu
foreach ($port in 1514, 1515) {
  $t = Test-NetConnection -ComputerName $ServerHost -Port $port -WarningAction SilentlyContinue
  if (-not $t.TcpTestSucceeded) { throw "Port $port@$ServerHost tertutup — cek VM server nyala & satu jaringan." }
}

$url  = "https://packages.wazuh.com/4.x/windows/wazuh-agent-$WazuhVersion-$WazuhRevision.msi"
$out  = "$env:TEMP\wazuh-agent.msi"
Write-Host "Mengunduh agent: $url" -ForegroundColor Cyan
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing

Write-Host "Installing (senyap)..." -ForegroundColor Cyan
Start-Process msiexec.exe -Wait -ArgumentList @(
  '/i', $out, '/q', '/norestart',
  "WAZUH_MANAGER=$ServerHost",
  "WAZUH_AGENT_GROUP=$AgentGroup",
  "WAZUH_REGISTRATION_PASSWORD=$EnrollmentPassword"
)

Start-Service WazuhSvc -ErrorAction SilentlyContinue
Get-Service WazuhSvc | Format-Table Name, Status, StartType

Write-Host @"
Selesai. Verifikasi:
  1. Dashboard https://$ServerHost`:443 → Security/Agents → host ini 'Active'
  2. sc query WazuhSvc  (STATUS : RUNNING)
  3. Lanjut: cyberlab-log-forwarding.md
"@ -ForegroundColor Green
