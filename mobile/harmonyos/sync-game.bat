@echo off
rem 同步游戏文件到鸿蒙工程 rawfile（修改游戏后构建前运行一次）
chcp 65001 >nul
cd /d "%~dp0\..\.."
set RAW=mobile\harmonyos\entry\src\main\resources\rawfile
copy /Y index.html "%RAW%\index.html" >nul
copy /Y manifest.webmanifest "%RAW%\manifest.webmanifest" >nul
copy /Y sw.js "%RAW%\sw.js" >nul
copy /Y icons\icon-192.png "%RAW%\icons\" >nul
copy /Y icons\icon-512.png "%RAW%\icons\" >nul
copy /Y icons\apple-touch-icon.png "%RAW%\icons\" >nul
echo 游戏文件已同步到鸿蒙工程 rawfile
pause
