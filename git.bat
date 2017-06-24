@echo off
git.exe init
git.exe add .
git.exe commit -m "%*"
git.exe push heroku master
echo "======"
exit /b