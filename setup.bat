@echo off
echo ============================================
echo   AES Registration App - Auto Setup
echo ============================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)

echo.
echo [2/4] Checking for .env file...
if not exist ".env" (
  copy .env.example .env
  echo .env file created from template.
  echo.
  echo ============================================
  echo  ACTION REQUIRED - Open .env in Notepad
  echo  and paste your Firebase keys, then re-run
  echo  this script.
  echo ============================================
  start notepad .env
  pause
  exit /b 0
)

echo .env file found.

echo.
echo [3/4] Building the app...
call npm run build
if %errorlevel% neq 0 (
  echo ERROR: Build failed. Check your .env file has correct Firebase keys.
  pause
  exit /b 1
)

echo.
echo [4/4] Done!
echo ============================================
echo  BUILD SUCCESSFUL
echo  Your app is in the "dist" folder.
echo  
echo  To run locally, type:  npm run dev
echo  Then open: http://localhost:5173
echo ============================================
pause
