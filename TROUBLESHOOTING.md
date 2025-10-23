# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Installation Issues

#### "npm install" fails
**Problem:** Dependencies fail to install

**Solutions:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

#### "pip install" fails
**Problem:** Python packages won't install

**Solutions:**
```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Use virtual environment
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Try specific versions
pip install --no-cache-dir -r requirements.txt
```

---

### 2. Server Won't Start

#### Backend won't start (Port 5000 in use)
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

#### Frontend won't start (Port 3000 in use)
**Problem:** Port 3000 already in use

**Solutions:**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or edit vite.config.js to use different port
server: {
  port: 3001
}
```

#### Python service won't start
**Problem:** Flask app fails to start

**Solutions:**
```powershell
# Check Python version (needs 3.9+)
python --version

# Make sure Flask is installed
pip install flask flask-cors

# Check for port conflicts
netstat -ano | findstr :8000
```

---

### 3. FFmpeg Issues

#### "FFmpeg not found"
**Problem:** Video processing fails with FFmpeg error

**Solutions:**
```powershell
# Check if FFmpeg is installed
ffmpeg -version

# If not installed, install with Chocolatey
choco install ffmpeg

# Or download manually
# 1. Download from https://www.gyan.dev/ffmpeg/builds/
# 2. Extract to C:\ffmpeg
# 3. Add C:\ffmpeg\bin to PATH
# 4. Restart terminal
```

#### FFmpeg processing errors
**Problem:** Video conversion fails

**Solutions:**
```powershell
# Verify FFmpeg works
ffmpeg -version

# Test basic conversion
ffmpeg -i input.mp4 -t 10 test.mp4

# Check file permissions
# Ensure uploads/ and processed/ directories exist and are writable
```

---

### 4. API Key Issues

#### TMDb API returns 401
**Problem:** "Invalid API key"

**Solutions:**
1. Check `.env` file has correct key
2. Verify key at https://www.themoviedb.org/settings/api
3. Ensure no extra spaces in `.env`:
   ```env
   TMDB_API_KEY=your_key_here  # ❌ Extra spaces
   TMDB_API_KEY=your_key_here  # ✅ Correct
   ```
4. Restart backend server after changing `.env`

#### OpenAI API errors
**Problem:** Caption generation fails

**Solutions:**
1. Verify API key at https://platform.openai.com/
2. Check billing/credits are available
3. App works without OpenAI (uses mock captions)
4. Set `OPENAI_API_KEY=` (empty) to skip

---

### 5. CORS Errors

#### "CORS policy blocked"
**Problem:** Frontend can't access backend API

**Solutions:**
```javascript
// backend/src/index.js - verify CORS config
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Check FRONTEND_URL in backend .env
FRONTEND_URL=http://localhost:3000
```

**Also:**
- Restart backend after changing CORS settings
- Clear browser cache
- Check both services are running on correct ports

---

### 6. Video Processing Issues

#### Processing takes too long
**Problem:** Video processing is very slow

**Solutions:**
1. Use shorter clips (under 1 minute)
2. Reduce video quality in `video_processor.py`:
   ```python
   video_bitrate='2M'  # Instead of 4M
   ```
3. Check CPU usage - may need better hardware
4. Consider GPU acceleration for FFmpeg

#### Processed video quality is poor
**Problem:** Output video looks bad

**Solutions:**
```python
# video-processor/services/video_processor.py
# Increase bitrate
video_bitrate='8M',  # Higher quality
audio_bitrate='256k'
```

#### Captions not appearing
**Problem:** Auto-captions don't show

**Solutions:**
1. Check OpenAI API key is set
2. Verify video has audio track
3. Check logs for transcription errors
4. Test with different video file
5. Use mock captions if OpenAI unavailable

---

### 7. Docker Issues

#### Docker containers won't start
**Problem:** `docker-compose up` fails

**Solutions:**
```powershell
# Clean up Docker
docker-compose down -v
docker system prune -a

# Rebuild images
docker-compose build --no-cache
docker-compose up

# Check Docker is running
docker --version
docker ps
```

#### Out of disk space
**Problem:** Docker build fails - no space

**Solutions:**
```powershell
# Remove unused Docker data
docker system prune -a --volumes

# Check disk space
Get-PSDrive C
```

#### Container port conflicts
**Problem:** Port already allocated

**Solutions:**
```yaml
# Edit docker-compose.yml
services:
  frontend:
    ports:
      - "3001:3000"  # Change external port
```

---

### 8. Frontend Issues

#### White screen / blank page
**Problem:** React app doesn't render

**Solutions:**
```powershell
# Check browser console for errors
# F12 → Console tab

# Clear build cache
cd frontend
rm -rf node_modules .vite dist
npm install
npm start

# Check for JavaScript errors in console
```

#### API calls failing
**Problem:** Network errors in browser

**Solutions:**
1. Check backend is running (`http://localhost:5000/health`)
2. Verify API URL in `frontend/src/services/api.js`
3. Check browser Network tab (F12)
4. Try direct API call:
   ```powershell
   curl http://localhost:5000/api/content/search?query=test
   ```

#### Search returns no results
**Problem:** Content search fails

**Solutions:**
1. Verify TMDb API key is correct
2. Check backend logs for API errors
3. Test TMDb API directly:
   ```powershell
   curl "https://api.themoviedb.org/3/search/tv?api_key=YOUR_KEY&query=breaking+bad"
   ```

---

### 9. File Upload Issues

#### "No file uploaded" error
**Problem:** Video upload fails

**Solutions:**
1. Check file size (max 500MB)
2. Verify file format (MP4, AVI, MOV, MKV)
3. Check `uploads/` directory exists and is writable
4. Review multer configuration in `clip.routes.js`

#### Upload stuck at 100%
**Problem:** Upload completes but processing doesn't start

**Solutions:**
1. Check video-processor service is running
2. Review video-processor logs
3. Verify FFmpeg is installed
4. Test with smaller video file

---

### 10. Database/Storage Issues

#### AWS S3 upload fails
**Problem:** Can't upload to S3

**Solutions:**
1. Verify AWS credentials in `.env`
2. Check S3 bucket exists and has correct permissions
3. Test AWS credentials:
   ```powershell
   aws s3 ls  # Should list buckets
   ```
4. App works without S3 (uses local storage)

#### "Clip not found" error
**Problem:** Can't retrieve processed clip

**Solutions:**
1. Check `processed/` directory exists
2. Verify clip ID is correct
3. Check file permissions
4. Review clip metadata JSON file

---

### 11. Authentication Issues

#### YouTube upload requires auth
**Problem:** YouTube OAuth not working

**Solutions:**
1. Verify YouTube API credentials
2. Check redirect URI matches:
   ```
   http://localhost:5000/api/upload/youtube/callback
   ```
3. Enable YouTube Data API v3 in Google Console
4. Clear OAuth tokens and re-authenticate

#### TikTok API errors
**Problem:** TikTok upload fails

**Solutions:**
1. TikTok API requires business account
2. Verify API keys are correct
3. Check TikTok API rate limits
4. Review TikTok API documentation for changes

---

### 12. Performance Issues

#### App is slow
**Problem:** Everything takes too long

**Solutions:**
1. **Frontend:**
   - Clear browser cache
   - Check Network tab for slow requests
   - Use production build: `npm run build`

2. **Backend:**
   - Check API rate limits
   - Implement caching
   - Use Redis for session storage

3. **Video Processing:**
   - Reduce video quality
   - Use shorter clips
   - Implement queue system
   - Consider GPU acceleration

---

## Debugging Tips

### Check All Services are Running
```powershell
# Check ports
netstat -ano | findstr "3000 5000 8000"

# Test health endpoints
curl http://localhost:5000/health
curl http://localhost:8000/health
```

### View Logs
```powershell
# Backend logs (in backend terminal)
# Video processor logs (in python terminal)
# Frontend logs (browser console - F12)
```

### Test API Directly
```powershell
# Search test
curl "http://localhost:5000/api/content/search?query=test"

# Create clip test
curl -X POST http://localhost:5000/api/clips/create `
  -H "Content-Type: application/json" `
  -d '{"contentId":"1396","length":60}'
```

### Clean Install
```powershell
# Nuclear option - start fresh
rm -rf node_modules
rm -rf venv
rm package-lock.json

npm run install:all
```

---

## Getting Help

If you're still stuck:

1. **Check logs** - errors usually have helpful messages
2. **Review documentation** - README.md, SETUP.md, API.md
3. **Search existing issues** - GitHub Issues
4. **Create new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

---

## Useful Commands Reference

```powershell
# Check versions
node --version
npm --version
python --version
ffmpeg -version

# Kill process by port
netstat -ano | findstr :PORT
taskkill /PID <PID> /F

# Clear caches
npm cache clean --force
pip cache purge

# Restart services
Ctrl+C  # Stop service
# Then restart with npm/python command

# Docker commands
docker-compose logs [service]
docker-compose restart [service]
docker-compose down && docker-compose up
```

---

**Last Updated:** October 2025  
**Version:** 1.0.0

For more help, open an issue on GitHub! 🆘
