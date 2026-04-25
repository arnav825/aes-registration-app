@echo off
echo ============================================
echo   AES App - GitHub Upload Script
echo ============================================
echo.

set /p GITHUB_USERNAME=Enter your GitHub username: 
set /p REPO_NAME=Enter repository name (e.g. aes-registration-app): 

echo.
echo [1/5] Initializing Git...
git init

echo [2/5] Adding all files...
git add .

echo [3/5] Creating first commit...
git commit -m "AES Registration App - Initial Commit"

echo [4/5] Setting main branch...
git branch -M main

echo [5/5] Connecting to GitHub and pushing...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
git push -u origin main

echo.
echo ============================================
echo  DONE! Your code is now on GitHub at:
echo  https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo  Next step: Go to vercel.com and import
echo  this repository to deploy it live!
echo ============================================
pause
