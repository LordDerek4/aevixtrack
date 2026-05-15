@echo off
title AevixTrack - Dev Server

echo Starting AevixTrack...
echo.

:: Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

:: Start the dev server and open the browser
start "" http://localhost:3000
npm run dev
