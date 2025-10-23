# Video Processing Guide

## 🎬 How Video Generation Works

### The Reality Check

When you search for "Family Guy" or any TV show/movie in our system, **no actual video file is automatically downloaded or generated**. Here's why:

### Why Can't We Auto-Download Videos?

1. **Copyright Protection**: TV shows and movies are protected intellectual property
2. **Streaming Service Terms**: Services like Netflix, Hulu, Disney+ prohibit automated downloads
3. **Authentication Required**: Each service requires user login and doesn't provide APIs for video downloads
4. **Legal Constraints**: Automated downloading would violate DMCA and other copyright laws

## ✅ What DOES Work

### Option 1: Upload Your Own Videos (Recommended)

The video processing system **fully works** when you provide your own video files!

**What the system will do:**
- ✂️ Convert any video to vertical format (9:16 aspect ratio for TikTok/Shorts)
- 🎯 Crop and center the video intelligently
- 📝 Auto-generate captions using OpenAI Whisper AI
- ⏱️ Trim to your desired length (15-180 seconds)
- 🎨 Optimize bitrate and quality for social media
- 📤 Prepare for direct upload to YouTube Shorts or TikTok

**How to use:**
1. Go to "Create Clip" page
2. Choose "Upload Video" option
3. Select your video file (any format: MP4, MOV, AVI, etc.)
4. Configure length and caption settings
5. Click "Upload & Process"
6. Download your processed vertical clip!

### Option 2: Browse Library + Manual Video

If you want to create clips from specific TV shows/movies:

1. **Browse the library** to find the show/movie you want
2. **Manually obtain** the video file:
   - Screen record from your streaming service (legal for personal use)
   - Use your own recorded content
   - Purchase/download from legitimate sources
3. **Upload the video** using our upload feature
4. **Process** it with our automated tools

## 🛠️ What Gets Processed

When you upload a video, here's what happens behind the scenes:

### Step 1: Video Analysis
```python
# FFmpeg analyzes the video
- Resolution: 1920x1080 (or whatever you provide)
- Aspect Ratio: 16:9 (horizontal)
- Duration: 25 minutes
- Audio: Present
```

### Step 2: Vertical Conversion
```python
# Converts to 9:16 for mobile
- New Resolution: 1080x1920 (vertical)
- Crops intelligently (keeps center/action)
- Maintains quality: 4Mbps video, 192kbps audio
```

### Step 3: Caption Generation
```python
# OpenAI Whisper transcribes audio
- Extracts speech to text
- Adds timestamps
- Formats as SRT subtitles
- Burns captions into video
```

### Step 4: Optimization
```python
# Prepares for social media
- Trims to desired length
- Optimizes file size
- Adds proper metadata
- Exports as MP4
```

## 📊 Example Workflow

### Creating a Family Guy Clip (Real Process):

1. **Find Content**: Search "Family Guy" in our library ✅
2. **Get Episode**: 
   - Option A: Screen record from Hulu
   - Option B: Use a clip you already have
   - Option C: Use legally downloaded content
3. **Upload**: Use our "Upload Video" feature ✅
4. **Configure**: Set length to 60 seconds, enable captions ✅
5. **Process**: System converts to vertical, adds captions ✅
6. **Download**: Get your TikTok-ready clip! ✅
7. **Upload**: Use built-in YouTube/TikTok upload buttons ✅

## 🎥 Supported Video Formats

**Input formats (we can process):**
- MP4, MOV, AVI, MKV, WebM, FLV
- Any resolution (will convert to 1080x1920)
- Any aspect ratio (will crop to 9:16)
- With or without audio

**Output format:**
- MP4 (H.264 video codec)
- 1080x1920 resolution (9:16 vertical)
- 4Mbps video bitrate
- 192kbps audio bitrate
- Optimized for TikTok and YouTube Shorts

## 💡 Tips for Best Results

### Video Quality
- **Use high-resolution source** (1080p or higher recommended)
- **Avoid heavily compressed** videos
- **Check center framing** - our crop focuses on the center

### Audio/Captions
- **Clear audio** = better caption accuracy
- **English audio** works best (Whisper supports 90+ languages)
- **Background music** is preserved

### Length
- **TikTok**: 15-60 seconds (sweet spot: 30-45s)
- **YouTube Shorts**: up to 60 seconds
- **Instagram Reels**: 15-90 seconds

## 🔧 Technical Details

### Python Video Processor (Port 5001)
```python
# Running at http://127.0.0.1:5001
Services:
- FFmpeg: Video conversion and editing
- OpenAI Whisper: Speech-to-text for captions
- Flask: API endpoints for processing

Endpoints:
- POST /process/uploaded-video - Main processing endpoint
- POST /process/create-clip - Clip creation (needs source)
- POST /process/add-captions - Caption generation
- GET /health - Service health check
```

### Required for Real Processing
- ✅ Python 3.10+
- ✅ FFmpeg installed
- ✅ OpenAI API key (for captions)
- ✅ Source video file

## 🚀 Quick Start

### Test with Your Own Video

1. **Find any video file** on your computer
2. **Visit** http://localhost:3000/create
3. **Click "Upload Video"**
4. **Select your file**
5. **Set length** to 30 seconds
6. **Enable captions**
7. **Click "Upload & Process"**
8. **Wait 30-60 seconds** (processing time)
9. **Download** your vertical clip!

### Results
- Original: Horizontal 16:9 video
- Processed: Vertical 9:16 clip with captions
- Ready for: TikTok, YouTube Shorts, Instagram Reels

## ❓ Common Questions

**Q: Why doesn't searching for a show create a video?**
A: We can't legally auto-download copyrighted content from streaming services.

**Q: Can I use screen recordings?**
A: Yes! Screen recording for personal use is generally legal.

**Q: How long does processing take?**
A: Typically 30-90 seconds depending on video length and captions.

**Q: Do I need FFmpeg installed?**
A: Yes, the Python video processor requires FFmpeg.

**Q: Can I disable captions?**
A: Yes, just uncheck the "Auto-generate captions" option.

**Q: What if my video is already vertical?**
A: The system will still process it (no cropping needed).

## 📞 Need Help?

- Check that all services are running:
  - Frontend: http://localhost:3000
  - Backend: http://127.0.0.1:5000
  - Video Processor: http://127.0.0.1:5001

- Verify FFmpeg: Run `ffmpeg -version` in terminal
- Check OpenAI API key in `.env` file
- Look at terminal logs for error messages

---

**Bottom Line**: Upload your own videos → System processes them → Get TikTok-ready clips! 🎬✨
