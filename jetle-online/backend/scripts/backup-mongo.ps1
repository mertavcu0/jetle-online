param(
  [string]$MongoUri = $env:MONGO_URI,
  [string]$OutDir = ".\backups\mongo"
)

if (-not $MongoUri) {
  Write-Error "MONGO_URI gerekli."
  exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path $OutDir $stamp

mongodump --uri="$MongoUri" --out="$target"

Write-Host "Mongo backup hazir:" $target
