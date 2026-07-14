@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\link-shortener\linkshort-web"
if exist ".git\index.lock" del /f ".git\index.lock"
git add src/index.css
git commit -m "redesign: dark navy analytics dashboard, emerald neon accents and glow"
git push
echo ===== DONE =====
pause
