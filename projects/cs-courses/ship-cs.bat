@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\cs-courses"
if exist ".git\index.lock" del /f ".git\index.lock"
git add -u
git commit -m "add Functions and Mappings and Real Numbers topics to Analysis"
git push
echo ===== DONE =====
pause
