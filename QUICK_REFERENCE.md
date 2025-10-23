# 🚀 Clip Generator - Quick Reference Card

## 📦 Installation (One Command)
```powershell
npm run install:all
```

## 🔧 Setup
1. Copy `.env.example` to `.env`
2. Add your TMDb API key (get free at themoviedb.org)
3. Install FFmpeg (required for video processing)

## ▶️ Start Development
```powershell
.\start-dev.ps1
```

Or manually (3 terminals):
```powershell
cd backend && npm run dev        # Terminal 1
cd video-processor && python app.py  # Terminal 2
cd frontend && npm start         # Terminal 3
```

## 🐳 Docker (Easier!)
```powershell
docker-compose up --build
```

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Video Processor: http://localhost:8000

## 📚 Key Commands

### Frontend
```powershell
cd frontend
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

### Backend
```powershell
cd backend
npm run dev        # Start with nodemon
npm start          # Start production
npm test           # Run tests
```

### Video Processor
```powershell
cd video-processor
python app.py      # Start Flask server
pip install -r requirements.txt  # Install dependencies
```

## 🔑 Essential API Keys

| Service | Required? | Get It From |
|---------|-----------|-------------|
| TMDb | ✅ Yes | themoviedb.org/settings/api |
| YouTube | ❌ Optional | console.cloud.google.com |
| OpenAI | ❌ Optional | platform.openai.com |
| AWS S3 | ❌ Optional | aws.amazon.com |

## 📁 Project Structure
```
slop/
├── frontend/        → React app (port 3000)
├── backend/         → Express API (port 5000)
├── video-processor/ → Python service (port 8000)
└── docker-compose.yml
```

## 🔄 Development Workflow
1. Search for content (TV show/movie)
2. Configure clip settings
3. Wait for processing
4. Preview/Download/Upload

## 🛠️ Common Issues

### Port Already in Use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### FFmpeg Not Found
```powershell
ffmpeg -version  # Check if installed
# Add to PATH if needed
```

### Module Not Found
```powershell
rm -rf node_modules
npm install
```

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP.md | Detailed setup guide |
| API.md | API documentation |
| CONTRIBUTING.md | How to contribute |
| PROJECT_SUMMARY.md | Complete overview |

## 🔍 Testing the App

1. Open http://localhost:3000
2. Click "Create Clip"
3. Search "Breaking Bad"
4. Select show → Configure → Create
5. Wait for processing
6. Download your clip!

## 💡 Pro Tips

1. **Get TMDb API key first** - it's free and required
2. **Use Docker** for easiest setup
3. **Check all 3 services are running** before testing
4. **FFmpeg must be installed** for video processing
5. **Start backend first** then video processor, then frontend

## 🆘 Need Help?

1. Read SETUP.md for detailed instructions
2. Check API.md for endpoint documentation
3. Review error logs in terminal
4. Open GitHub issue if stuck

## 🎯 Quick Test

```powershell
# Check if services are running
curl http://localhost:5000/health
curl http://localhost:8000/health

# Search for content
curl "http://localhost:5000/api/content/search?query=breaking+bad"
```

## 📊 Tech Stack

**Frontend:** React + Vite + Tailwind  
**Backend:** Node.js + Express  
**Processing:** Python + FFmpeg  
**APIs:** TMDb, YouTube, TikTok, OpenAI

## 🔐 Environment Variables (.env)

```env
# Required
TMDB_API_KEY=your_key_here

# Optional
YOUTUBE_CLIENT_ID=your_id_here
YOUTUBE_CLIENT_SECRET=your_secret_here
OPENAI_API_KEY=your_key_here
```

## 📦 NPM Scripts (Root)

```powershell
npm run install:all      # Install all dependencies
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:processor    # Start processor only
npm run docker:build     # Build Docker images
npm run docker:up        # Start with Docker
```

## 🎬 Video Output Specs

- **Format:** MP4 (H.264)
- **Resolution:** 1080x1920 (9:16)
- **Max Length:** 3 minutes (180s)
- **Features:** Captions + Credits
- **Optimized for:** TikTok & YouTube Shorts

## 🌟 Key Features

✅ Content search (TV/Movies)  
✅ Auto vertical format  
✅ Custom clip length  
✅ Auto captions  
✅ Credits overlay  
✅ YouTube upload  
✅ TikTok upload  
✅ Download clips  

---

**Version:** 1.0.0  
**Last Updated:** October 2025  

Happy clip creating! 🎥✨
