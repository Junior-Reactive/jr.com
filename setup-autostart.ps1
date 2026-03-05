# ============================================================
#  Junior Reactive — Auto-Start Setup
#  Registers both servers to launch automatically at login
#  using Windows Task Scheduler.
#
#  HOW TO USE (run ONCE):
#  1. Open PowerShell as Administrator
#  2. Run:
#       Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#       & "$env:USERPROFILE\Downloads\setup-autostart.ps1"
#
#  After that, both servers start automatically every time
#  you log into Windows. No more manually running Start.bat.
#
#  TO STOP AUTO-START (undo everything):
#       Unregister-ScheduledTask -TaskName "JR-Backend" -Confirm:$false
#       Unregister-ScheduledTask -TaskName "JR-Frontend" -Confirm:$false
# ============================================================

$PROJECT = "D:\JR.React"
$BACKEND  = "$PROJECT\backend"
$FRONTEND = "$PROJECT\frontend"

# ── SAFETY CHECK ─────────────────────────────────────────────
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Junior Reactive - Auto-Start Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $BACKEND)) {
    Write-Host "  ERROR: Backend folder not found: $BACKEND" -ForegroundColor Red
    Write-Host "  Edit the PROJECT variable at the top of this script." `
               -ForegroundColor Yellow
    pause; exit 1
}

if (-not (Test-Path $FRONTEND)) {
    Write-Host "  ERROR: Frontend folder not found: $FRONTEND" -ForegroundColor Red
    pause; exit 1
}

# ── REMOVE OLD TASKS IF THEY EXIST ───────────────────────────
foreach ($name in @("JR-Backend", "JR-Frontend")) {
    if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $name -Confirm:$false
        Write-Host "  Removed existing task: $name" -ForegroundColor Gray
    }
}

# ── TRIGGER: run when THIS user logs in ──────────────────────
$trigger = New-ScheduledTaskTrigger -AtLogOn

# ── SETTINGS ─────────────────────────────────────────────────
$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -StartWhenAvailable

# ── TASK 1: BACKEND (node server.js on port 5005) ────────────
Write-Host ""
Write-Host "[1/2] Registering backend task..." -ForegroundColor Yellow

$backendAction = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Minimized -Command `"Set-Location '$BACKEND'; node server.js`"" `
    -WorkingDirectory $BACKEND

Register-ScheduledTask `
    -TaskName    "JR-Backend" `
    -Description "Junior Reactive API server (port 5005)" `
    -Trigger     $trigger `
    -Action      $backendAction `
    -Settings    $settings `
    -RunLevel    Highest `
    -Force | Out-Null

Write-Host "  OK  JR-Backend registered" -ForegroundColor Green

# ── TASK 2: FRONTEND (npm start on port 3000) ────────────────
# Wait 8 seconds after login so the backend gets a head start
$frontendTrigger = New-ScheduledTaskTrigger -AtLogOn
$frontendTrigger.Delay = "PT8S"   # ISO 8601 — 8 second delay

Write-Host ""
Write-Host "[2/2] Registering frontend task (8s delay after backend)..." `
           -ForegroundColor Yellow

$frontendAction = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Minimized -Command `"Set-Location '$FRONTEND'; npm start`"" `
    -WorkingDirectory $FRONTEND

Register-ScheduledTask `
    -TaskName    "JR-Frontend" `
    -Description "Junior Reactive React app (port 3000)" `
    -Trigger     $frontendTrigger `
    -Action      $frontendAction `
    -Settings    $settings `
    -RunLevel    Highest `
    -Force | Out-Null

Write-Host "  OK  JR-Frontend registered" -ForegroundColor Green

# ── CONFIRM ───────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================================" `
           -ForegroundColor Green
Write-Host "  Auto-start setup complete!" -ForegroundColor Green
Write-Host "============================================================" `
           -ForegroundColor Green
Write-Host ""
Write-Host "  Both servers will now start automatically every time" `
           -ForegroundColor White
Write-Host "  you log into Windows. No action needed on boot." `
           -ForegroundColor White
Write-Host ""
Write-Host "  To verify the tasks were created, run:" -ForegroundColor Gray
Write-Host "  Get-ScheduledTask -TaskName 'JR-Backend','JR-Frontend'" `
           -ForegroundColor Gray
Write-Host ""
Write-Host "  To start them RIGHT NOW without rebooting:" -ForegroundColor Gray
Write-Host "  Start-ScheduledTask -TaskName 'JR-Backend'" -ForegroundColor Gray
Write-Host "  Start-ScheduledTask -TaskName 'JR-Frontend'" -ForegroundColor Gray
Write-Host ""
Write-Host "  To remove auto-start later:" -ForegroundColor Gray
Write-Host "  Unregister-ScheduledTask -TaskName 'JR-Backend' -Confirm:`$false" `
           -ForegroundColor Gray
Write-Host "  Unregister-ScheduledTask -TaskName 'JR-Frontend' -Confirm:`$false" `
           -ForegroundColor Gray
Write-Host ""
pause