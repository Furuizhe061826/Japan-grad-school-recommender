$ErrorActionPreference = "Stop"

$gitCandidates = @(
  "C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe",
  "git"
)

$git = $gitCandidates | Where-Object {
  try {
    if (Test-Path $_) { return $true }
    Get-Command $_ -ErrorAction Stop | Out-Null
    return $true
  } catch {
    return $false
  }
} | Select-Object -First 1

if (-not $git) {
  throw "Git was not found. Please install Git for Windows, or run this project inside Codex where bundled Git is available."
}

Set-Location $PSScriptRoot

& $git add --all
& $git commit -m "Add Zhesi Academy case study page"
& $git push

Write-Host ""
Write-Host "Done. GitHub has been updated, and Vercel should redeploy automatically." -ForegroundColor Green
