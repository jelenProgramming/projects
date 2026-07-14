@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\deutsch-trainer"
if exist ".git\index.lock" del /f ".git\index.lock"
git add src/index.css src/App.jsx
git commit -m "redesign: bold gamified violet theme, animated feedback, confetti on correct"
git push
echo ===== DONE =====
pause
