@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\invoicer-app\invoicer-web"
if exist ".git\index.lock" del /f ".git\index.lock"
git add -A
git commit -m "web frontend for the invoicer"
git remote remove origin 2>nul
git remote add origin https://github.com/jelenProgramming/invoicer-web.git
git push -u origin main
echo ===== DONE =====
pause
