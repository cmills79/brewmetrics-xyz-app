@echo off
echo Starting local web server on port 8000...
echo Open http://localhost:8000/test-ai-agent.html in your browser
python -m http.server 8000
pause
