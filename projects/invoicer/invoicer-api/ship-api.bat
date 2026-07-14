@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\invoicer-app\invoicer-api"
if exist ".git\index.lock" del /f ".git\index.lock"
git add -A
git commit -m "use install-php-extensions for reliable php extension setup"
git push
echo ===== DONE =====
pause
