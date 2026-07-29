@echo off
echo ===================================================
echo   0xAiPOEHelper (PoE 1 League 3.29) - RUNNING TESTS
echo ===================================================
echo.

echo [1/2] Testing Go Server Build (go build)...
cd go_server
call go build -o server.exe main.go
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Go Server compilation failed!
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo [SUCCESS] Go Server binary compiled cleanly!
echo.

echo [2/2] Testing Web Frontend React/Vite Build...
cd web
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web Frontend build failed!
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo [SUCCESS] Web Frontend build passed!
echo.

echo ===================================================
echo   ALL TESTS PASSED SUCCESSFULLY!
echo ===================================================
pause
