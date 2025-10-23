# Clip Generator - Development Startup Script
# This script starts all services in separate terminal windows

Write-Host "Starting Clip Generator Services..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed. Please install Python first." -ForegroundColor Red
    exit 1
}

# Check if FFmpeg is installed
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: FFmpeg is not installed. Video processing will not work." -ForegroundColor Yellow
}

# Create required directories
Write-Host "Creating required directories..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "backend\uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\processed" | Out-Null
New-Item -ItemType Directory -Force -Path "video-processor\uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "video-processor\processed" | Out-Null

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env with your API keys before continuing." -ForegroundColor Yellow
    Read-Host "Press Enter when ready to continue"
}

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Video Processor
Write-Host "Starting Video Processor..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd video-processor; python app.py"

# Wait a bit for video processor to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "All services started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:         http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API:      http://localhost:5000" -ForegroundColor Cyan
Write-Host "Video Processor:  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop services" -ForegroundColor Yellow
