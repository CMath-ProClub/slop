# ✅ Getting Started Checklist

Use this checklist to set up your Clip Generator application step by step.

## Pre-Installation Checklist

- [ ] Node.js (v18+) installed - https://nodejs.org/
- [ ] Python (v3.9+) installed - https://www.python.org/
- [ ] Git installed - https://git-scm.com/
- [ ] Code editor installed (VS Code recommended)
- [ ] Internet connection available

## Installation Checklist

- [ ] Repository cloned/downloaded
- [ ] Opened project in terminal/command prompt
- [ ] Navigated to project directory (`cd slop`)

## FFmpeg Setup (Required for Video Processing)

### Windows:
- [ ] Install via Chocolatey: `choco install ffmpeg`
  - OR download from https://www.gyan.dev/ffmpeg/builds/
  - Extract to C:\ffmpeg
  - Add C:\ffmpeg\bin to System PATH
- [ ] Restart terminal
- [ ] Verify installation: `ffmpeg -version`

### Mac:
- [ ] Install via Homebrew: `brew install ffmpeg`
- [ ] Verify: `ffmpeg -version`

### Linux:
- [ ] Install: `sudo apt-get install ffmpeg`
- [ ] Verify: `ffmpeg -version`

## Dependencies Installation

- [ ] Run: `npm run install:all`
  - OR manually:
    - [ ] `cd frontend && npm install`
    - [ ] `cd ../backend && npm install`
    - [ ] `cd ../video-processor && pip install -r requirements.txt`

## API Keys Setup (Important!)

### TMDb API Key (Required)
- [ ] Create account at https://www.themoviedb.org/
- [ ] Go to Settings → API
- [ ] Request API key (free)
- [ ] Copy API key (v3 auth)

### YouTube API (Optional - for direct upload)
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project
- [ ] Enable "YouTube Data API v3"
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URI: `http://localhost:5000/api/upload/youtube/callback`
- [ ] Copy Client ID and Client Secret

### OpenAI API (Optional - for auto-captions)
- [ ] Sign up at https://platform.openai.com/
- [ ] Generate API key
- [ ] Add payment method (if needed)
- [ ] Copy API key

### AWS S3 (Optional - for cloud storage)
- [ ] Create AWS account
- [ ] Create S3 bucket
- [ ] Create IAM user with S3 permissions
- [ ] Copy Access Key ID and Secret Key

## Environment Configuration

- [ ] Copy `.env.example` to `.env`: `copy .env.example .env`
- [ ] Open `.env` in text editor
- [ ] Add TMDb API key: `TMDB_API_KEY=your_key_here`
- [ ] (Optional) Add YouTube credentials
- [ ] (Optional) Add OpenAI key
- [ ] (Optional) Add AWS credentials
- [ ] Save `.env` file

## Directory Setup

- [ ] Create backend directories:
  - [ ] `mkdir backend\uploads`
  - [ ] `mkdir backend\processed`
- [ ] Create video processor directories:
  - [ ] `mkdir video-processor\uploads`
  - [ ] `mkdir video-processor\processed`

## First Run Test

### Option 1: Using Startup Script (Easier)
- [ ] Run: `.\start-dev.ps1`
- [ ] Wait for all 3 terminal windows to open
- [ ] Check each service starts successfully

### Option 2: Manual Start
- [ ] Open 3 terminal windows
- [ ] Terminal 1: `cd backend && npm run dev`
- [ ] Terminal 2: `cd video-processor && python app.py`
- [ ] Terminal 3: `cd frontend && npm start`

## Verification Checklist

- [ ] Backend running on http://localhost:5000
  - [ ] Test: Open http://localhost:5000/health in browser
  - [ ] Should see: `{"status":"ok"}`
  
- [ ] Video processor running on http://localhost:8000
  - [ ] Test: Open http://localhost:8000/health in browser
  - [ ] Should see: `{"status":"ok","service":"video-processor"}`
  
- [ ] Frontend running on http://localhost:3000
  - [ ] Test: Open http://localhost:3000 in browser
  - [ ] Should see: Clip Generator homepage

## Functionality Test

- [ ] Open http://localhost:3000
- [ ] Click "Create Clip" button
- [ ] Search for a TV show (e.g., "Breaking Bad")
- [ ] Results appear
- [ ] Click on a show
- [ ] Configuration page loads
- [ ] Season/episode options available
- [ ] Try creating a clip
- [ ] Processing status appears
- [ ] (Wait for processing to complete)

## Troubleshooting

If something doesn't work:

- [ ] Check all services are running
- [ ] Verify all API keys are correct in `.env`
- [ ] Check terminal/console for error messages
- [ ] Review TROUBLESHOOTING.md
- [ ] Restart services if needed

## Common Issues Quick Fix

### "Port already in use"
- [ ] Kill process: `netstat -ano | findstr :PORT`
- [ ] Then: `taskkill /PID <PID> /F`

### "FFmpeg not found"
- [ ] Verify: `ffmpeg -version`
- [ ] Reinstall if needed
- [ ] Make sure it's in PATH
- [ ] Restart terminal

### "Module not found"
- [ ] Clear cache: `npm cache clean --force`
- [ ] Reinstall: `npm install`
- [ ] Or: `pip install -r requirements.txt`

### "API key invalid"
- [ ] Double-check `.env` has correct key
- [ ] No extra spaces or quotes
- [ ] Restart backend server

## Docker Setup (Alternative Method)

If you prefer using Docker:

- [ ] Docker Desktop installed
- [ ] Docker is running
- [ ] Copy `.env.example` to `.env`
- [ ] Add API keys to `.env`
- [ ] Run: `docker-compose up --build`
- [ ] Wait for all services to start
- [ ] Open http://localhost:3000

## Documentation Review

Before you start developing, review:

- [ ] README.md - Project overview
- [ ] SETUP.md - Detailed setup guide
- [ ] API.md - API endpoints documentation
- [ ] QUICK_REFERENCE.md - Quick commands
- [ ] TROUBLESHOOTING.md - Common issues

## Optional Enhancements

- [ ] Set up code editor extensions
  - VS Code: ESLint, Prettier, Python
- [ ] Configure Git
  - [ ] `git config user.name "Your Name"`
  - [ ] `git config user.email "your@email.com"`
- [ ] Set up environment-specific configs
- [ ] Configure IDE debugging

## Production Readiness (Later)

When ready for production:

- [ ] Set up proper database
- [ ] Configure cloud storage (AWS S3)
- [ ] Set up SSL/HTTPS
- [ ] Implement user authentication
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test with real video sources
- [ ] Optimize performance

## Success Criteria

You're ready to develop when:

✅ All services start without errors  
✅ Frontend loads in browser  
✅ Can search for content  
✅ Can configure clip settings  
✅ Health endpoints respond  
✅ No errors in console logs  

## Next Steps

Once setup is complete:

1. Read through the code to understand the architecture
2. Try creating different types of clips
3. Experiment with different settings
4. Review the API documentation
5. Start customizing for your needs
6. Consider contributing improvements

## Need Help?

- 📖 Read SETUP.md for detailed instructions
- 🔧 Check TROUBLESHOOTING.md for common issues
- 📚 Review API.md for endpoint details
- 💬 Open GitHub issue if stuck
- 🎯 Check QUICK_REFERENCE.md for commands

---

**Estimated Setup Time:** 30-60 minutes  
**Difficulty:** Intermediate  
**Support:** GitHub Issues

Good luck and happy coding! 🚀🎬
