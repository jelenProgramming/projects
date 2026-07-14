@echo off
echo === Pushing jobtracker-api to GitHub ===
cd /d "C:\Users\david\PhpstormProjects\hello-world\job-tracker\jobtracker-api"

git init
git remote remove origin 2>nul
git remote add origin git@github.com:jelenProgramming/job-tracker.git
git add .
git commit -m "init: job tracker Laravel API"
git branch -M main
git push -u origin main --force

echo.
echo === Done with jobtracker-api ===
echo.
pause
