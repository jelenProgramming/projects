@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\sql-playground"
if exist ".git\index.lock" del /f ".git\index.lock"
git add src/styles.css
git commit -m "polish: deep-teal jewel accent on editorial theme"
git push
echo ===== DONE =====
pause
