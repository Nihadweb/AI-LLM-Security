@echo off
REM ============================================================
REM  Starts the VULNERABLE chatbot target on port 5000.
REM  This is what the bank chatbot AND garak both attack.
REM
REM  Default backend = Ollama tinyllama (offline, already on your PC).
REM  OPTIONAL fast mode: paste a free Groq key below to switch to Groq.
REM ============================================================

REM ---- Optional: paste a free Groq key for FAST scans (else leave blank) ----
set GROQ_API_KEY=
REM --------------------------------------------------------------------------

set OLLAMA_MODEL=tinyllama
set MAX_TOKENS=80
cd /d "%~dp0vuln-chatbot"
python server.py
if errorlevel 9009 (
  echo [!] 'python' not found on PATH. Try installing Python or use 'py server.py'.
)
pause
