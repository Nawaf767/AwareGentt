@echo off
echo Starting AwareGent Backend...
cd /d "%~dp0backend"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
