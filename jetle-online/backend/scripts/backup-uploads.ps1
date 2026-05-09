param(
  [string]$SourceDir = ".\uploads",
  [string]$OutDir = ".\backups\uploads"
)

if (-not (Test-Path $SourceDir)) {
  Write-Error "Uploads klasoru bulunamadi: $SourceDir"
  exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $OutDir ("uploads-" + $stamp + ".zip")

Compress-Archive -Path (Join-Path $SourceDir "*") -DestinationPath $zipPath -Force

Write-Host "Uploads backup hazir:" $zipPath
