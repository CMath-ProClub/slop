# Clip Generator - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18+): https://nodejs.org/
- Python (v3.9+): https://www.python.org/
- FFmpeg: https://ffmpeg.org/download.html
- Git: https://git-scm.com/

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd slop
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and add your API keys
notepad .env
```

**Required API Keys:**
- **TMDb API Key** (Free): Get it from https://www.themoviedb.org/settings/api
- **YouTube API Keys**: Get from https://console.cloud.google.com/
- **OpenAI API Key**: Get from https://platform.openai.com/

### 3. Install FFmpeg (Windows)

**Option 1: Using Chocolatey**
```powershell
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download from https://www.gyan.dev/ffmpeg/builds/
2. Extract to C:\ffmpeg
3. Add C:\ffmpeg\bin to your PATH

### 4. Install Dependencies

```bash
# Install all dependencies at once
npm run install:all
```

Or install individually:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Video Processor
cd ../video-processor
pip install -r requirements.txt
```

### 5. Create Required Directories

```bash
# From the root directory
mkdir backend\uploads
mkdir backend\processed
mkdir video-processor\uploads
mkdir video-processor\processed
```

## Running the Application

### Development Mode (3 separate terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Video Processor:**
```bash
cd video-processor
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Video Processor: http://localhost:8000

### Using Docker (Easier!)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

## Getting Your API Keys

### TMDb API Key (Required)
1. Create an account at https://www.themoviedb.org/
2. Go to Settings → API
3. Request an API key (it's free)
4. Copy the API Key (v3 auth)
5. Add to `.env` as `TMDB_API_KEY`

### YouTube API (For Direct Upload Feature)
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create credentials (OAuth 2.0 Client ID)
5. Add authorized redirect URI: `http://localhost:5000/api/upload/youtube/callback`
6. Copy Client ID and Client Secret to `.env`

### OpenAI API Key (Optional - For Auto Captions)
1. Sign up at https://platform.openai.com/
2. Go to API Keys
3. Create a new key
4. Add to `.env` as `OPENAI_API_KEY`
5. Note: This is optional, the app will work without it using mock captions

## Testing the Application

1. Open http://localhost:3000
2. Click "Create Clip"
3. Search for a TV show or movie (e.g., "Breaking Bad")
4. Select a show from results
5. Configure your clip settings
6. Click "Create Clip"
7. Wait for processing
8. Download or upload your clip!

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### FFmpeg Not Found
- Verify FFmpeg is installed: `ffmpeg -version`
- Make sure it's in your PATH
- Restart your terminal after adding to PATH

### Python Module Not Found
```bash
cd video-processor
pip install -r requirements.txt --upgrade
```

### CORS Errors
- Make sure backend is running on port 5000
- Check FRONTEND_URL in backend .env
- Clear browser cache

### Video Processing Fails
- Check FFmpeg is installed correctly
- Ensure uploads/processed directories exist
- Check video-processor logs for errors

## Common Issues

**"Cannot find module" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Python import errors:**
```bash
# Use a virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

**Docker issues:**
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Next Steps

- Configure AWS S3 for cloud storage (optional)
- Set up TikTok API for direct uploads (optional)
- Customize the frontend theme
- Add user authentication
- Deploy to production

## Getting Help

If you run into issues:
1. Check the main README.md
2. Review the error logs
3. Ensure all API keys are correct
4. Verify all services are running
5. Open an issue on GitHub

## Production Deployment

For production deployment instructions, see DEPLOYMENT.md (coming soon).

Quick checklist:
- [ ] Set NODE_ENV=production
- [ ] Use strong secrets for JWT
- [ ] Configure HTTPS
- [ ] Set up proper CORS
- [ ] Use production database
- [ ] Configure cloud storage
- [ ] Set up monitoring
- [ ] Configure rate limiting
