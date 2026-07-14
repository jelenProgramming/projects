@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\job-tracker\jobtracker-web"
if exist ".git\index.lock" del /f ".git\index.lock"
git add src/index.css
git commit -m "polish: soft-gradient depth, glassy topbar, gradient indigo actions"
git push
echo ===== DONE =====
pause
