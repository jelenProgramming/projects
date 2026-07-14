@echo off
cd /d "C:\Users\david\PhpstormProjects\hello-world\devcard"
if exist ".git\index.lock" del /f ".git\index.lock"
git add src/index.css
git commit -m "polish: github purple-to-blue glow, gradient stat numbers, glowing avatar ring"
git push
echo ===== DONE =====
pause
