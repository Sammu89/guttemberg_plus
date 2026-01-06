@echo off
setlocal

REM Change to the directory of this script (the schemas folder)
set BASEDIR=%~dp0
cd /d "%BASEDIR%"

REM Create venv if missing
if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment in .venv...
    python -m venv .venv
)

if not exist ".venv\Scripts\python.exe" (
    echo Python not found or virtual environment creation failed.
    pause
    exit /b 1
)

set PYTHON=%BASEDIR%.venv\Scripts\python.exe

echo Installing/Updating dependencies...
"%PYTHON%" -m pip install --upgrade pip
"%PYTHON%" -m pip install -r "%BASEDIR%schema_ide\requirements.txt"

echo Launching Schema IDE (choose a schema JSON when prompted)...
"%PYTHON%" -m schema_ide.app

echo.
echo Done.
pause

