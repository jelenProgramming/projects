@echo off
echo === Pushing jobtracker-web to GitHub ===
cd /d "C:\Users\david\PhpstormProjects\hello-world\job-tracker\jobtracker-web"

git init
git remote remove origin 2>nul
git remote add origin git@github.com:jelenProgramming/job-tracker-web.git
git add .
git commit -m "init: job tracker React frontend"
git branch -M main
git push -u origin main --force

echo.
echo === Done with jobtracker-web ===
echo.
pause
