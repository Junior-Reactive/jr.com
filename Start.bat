@echo off
echo.
echo ============================================================
echo   JUNIOR REACTIVE - Starting Application
echo ============================================================
echo.

cd /d D:\JR.React\backend
echo [1/2] Starting API server on port 5005...
start powershell -NoExit -Command "node server.js; Read-Host 'Press Enter to close'"

timeout /t 4 /nobreak > nul

cd /d D:\JR.React\frontend
echo [2/2] Starting React app on port 3000...
start powershell -NoExit -Command "npm start; Read-Host 'Press Enter to close'"

timeout /t 10 /nobreak > nul

echo.
echo  Application started!
echo    React:   http://localhost:3000
echo    API:     http://localhost:5005
echo    Swagger: http://localhost:5005/api-docs
echo.

start http://localhost:3000
