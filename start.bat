@echo off
title AevixTrack Dev Server
cd /d "%~dp0"
echo Starting AevixTrack...
call npm run dev
pause
