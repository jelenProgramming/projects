@echo off
echo === Triggering Vercel redeploy for job-tracker-web ===
cd /d "C:\Users\david\PhpstormProjects\hello-world\job-tracker\jobtracker-web"
powershell -Command "Remove-Item -Path '.git\index.lock' -Force -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Path '.git\HEAD.lock' -Force -ErrorAction SilentlyContinue"
git config user.email "jelenprogramming@gmail.com"
git config user.name "jelenProgramming"
git commit --allow-empty -m "ci: trigger redeploy with VITE_API_URL env var"
git push origin main
echo.
echo === Done — Vercel will redeploy automatically ===
pause
