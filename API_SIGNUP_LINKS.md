# 🔗 API Setup Links & Instructions

This guide provides direct links to sign up for all the optional APIs that enhance your clip generator.

---

## 📺 **TMDb API** (Already Configured ✅)

**Status:** ✅ **Active and Working**
- **What it does:** Search for movies and TV shows, get metadata, images, episode information
- **Current Status:** Already configured with your credentials
- **Your API Key:** `ae95a25fc8892bec5bcae86927d49d94`

---

## 🎥 **YouTube Data API v3** - For Direct YouTube Shorts Upload

### Setup Instructions:

1. **Go to Google Cloud Console:**
   - Link: https://console.cloud.google.com/

2. **Create a New Project:**
   - Click "Select a project" → "New Project"
   - Name it: "Clip Generator"
   - Click "Create"

3. **Enable YouTube Data API v3:**
   - Link: https://console.cloud.google.com/apis/library/youtube.googleapis.com
   - Click "Enable"

4. **Create Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen first if prompted:
     - User Type: External
     - App name: "Clip Generator"
     - User support email: Your email
     - Developer contact: Your email
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:5000/api/upload/youtube/callback`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

5. **Add to .env file:**
   ```env
   YOUTUBE_CLIENT_ID=your_client_id_here
   YOUTUBE_CLIENT_SECRET=your_client_secret_here
   ```

**Direct Links:**
- Google Cloud Console: https://console.cloud.google.com/
- Enable YouTube API: https://console.cloud.google.com/apis/library/youtube.googleapis.com
- Create Credentials: https://console.cloud.google.com/apis/credentials
- YouTube API Documentation: https://developers.google.com/youtube/v3

---

## 🎵 **TikTok API** - For Direct TikTok Upload

### Setup Instructions:

1. **Go to TikTok Developers:**
   - Link: https://developers.tiktok.com/

2. **Create an Account/Login:**
   - Click "Register" or "Login"
   - Use your TikTok account

3. **Create a New App:**
   - Go to: https://developers.tiktok.com/apps
   - Click "Create an app"
   - Fill in details:
     - App name: "Clip Generator"
     - Category: "Video"
     - Description: "Video clip generator for TikTok"

4. **Configure Settings:**
   - Redirect URL: `http://localhost:5000/api/upload/tiktok/callback`
   - Enable "Content Posting API"

5. **Get Credentials:**
   - After app approval, go to app dashboard
   - **Copy Client Key and Client Secret**

6. **Add to .env file:**
   ```env
   TIKTOK_CLIENT_KEY=your_client_key_here
   TIKTOK_CLIENT_SECRET=your_client_secret_here
   ```

**Note:** TikTok API requires app approval which can take 1-3 business days.

**Direct Links:**
- TikTok Developers: https://developers.tiktok.com/
- App Management: https://developers.tiktok.com/apps
- Documentation: https://developers.tiktok.com/doc/content-posting-api-get-started

---

## 🤖 **OpenAI API** - For Auto-Generated Captions via Whisper

### Setup Instructions:

1. **Go to OpenAI Platform:**
   - Link: https://platform.openai.com/signup

2. **Create an Account:**
   - Sign up with email or Google/Microsoft
   - Verify your email

3. **Add Payment Method:**
   - Go to: https://platform.openai.com/account/billing
   - Add a credit card (required for API access)
   - You get $5 free credits for new accounts
   - Whisper API is very affordable (~$0.006 per minute)

4. **Create API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "Clip Generator"
   - **Copy the API key** (you won't see it again!)

5. **Add to .env file:**
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

**Direct Links:**
- Sign Up: https://platform.openai.com/signup
- API Keys: https://platform.openai.com/api-keys
- Billing: https://platform.openai.com/account/billing
- Whisper API Pricing: https://openai.com/api/pricing/
- Documentation: https://platform.openai.com/docs/guides/speech-to-text

**What Whisper Does:**
- Automatically transcribes speech from videos
- Generates accurate captions/subtitles
- Supports 99 languages
- Very fast and affordable

---

## ☁️ **AWS S3** - For Cloud Storage (Optional)

### Setup Instructions:

1. **Go to AWS Console:**
   - Link: https://aws.amazon.com/console/

2. **Create an Account:**
   - Sign up for AWS Free Tier
   - Credit card required but free tier includes:
     - 5GB storage
     - 20,000 GET requests
     - 2,000 PUT requests per month

3. **Create S3 Bucket:**
   - Go to: https://s3.console.aws.amazon.com/s3/buckets
   - Click "Create bucket"
   - Bucket name: "clip-generator-storage" (must be globally unique)
   - Region: Choose closest to you
   - Uncheck "Block all public access" if you want public video URLs
   - Click "Create bucket"

4. **Create IAM User:**
   - Go to: https://console.aws.amazon.com/iam/
   - Click "Users" → "Add users"
   - Username: "clip-generator"
   - Access type: "Programmatic access"
   - Permissions: Attach "AmazonS3FullAccess" policy
   - Click through and **copy Access Key ID and Secret Access Key**

5. **Add to .env file:**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key_id
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=clip-generator-storage
   ```

**Direct Links:**
- AWS Console: https://aws.amazon.com/console/
- S3 Buckets: https://s3.console.aws.amazon.com/s3/buckets
- IAM Users: https://console.aws.amazon.com/iam/
- Free Tier: https://aws.amazon.com/free/
- S3 Documentation: https://docs.aws.amazon.com/s3/

**Why Use S3?**
- Reliable cloud storage
- Videos accessible from anywhere
- Automatic backups
- CDN integration for fast delivery

---

## 🎬 **FFmpeg** - For Video Processing (Required for Full Functionality)

### Windows Installation:

1. **Download FFmpeg:**
   - Link: https://www.gyan.dev/ffmpeg/builds/
   - Download "ffmpeg-release-essentials.zip"

2. **Extract and Install:**
   - Extract to `C:\ffmpeg`
   - Add to PATH:
     - Search "Environment Variables" in Windows
     - Edit "Path" in System variables
     - Add: `C:\ffmpeg\bin`
     - Click OK

3. **Verify Installation:**
   ```powershell
   ffmpeg -version
   ```

**Alternative - Using Chocolatey:**
```powershell
choco install ffmpeg
```

**Direct Links:**
- FFmpeg Builds: https://www.gyan.dev/ffmpeg/builds/
- Official Site: https://ffmpeg.org/
- Documentation: https://ffmpeg.org/documentation.html

---

## 📊 **Quick Reference: What Each API Does**

| API | Purpose | Cost | Required? |
|-----|---------|------|-----------|
| **TMDb** | Search movies/TV shows | Free | ✅ Yes (Already set up!) |
| **YouTube** | Upload to YouTube Shorts | Free | ⭐ Optional |
| **TikTok** | Upload to TikTok | Free | ⭐ Optional |
| **OpenAI Whisper** | Auto-captions | ~$0.006/min | ⭐ Optional |
| **AWS S3** | Cloud storage | Free tier generous | ⭐ Optional |
| **FFmpeg** | Video processing | Free | ⚠️ Needed for full features |

---

## 🚀 **Current Status**

✅ **Working Now:**
- TMDb search for movies/TV shows
- Top 500 TV shows library
- Top 1000 movies library  
- Top 100 streamers list
- Frontend UI
- Backend API

⏳ **Add These For Full Features:**
- YouTube upload (add credentials above)
- TikTok upload (add credentials above)
- Auto-captions (add OpenAI key above)
- Cloud storage (add AWS credentials above)
- Video processing (install FFmpeg above)

---

## 📝 **Your Current .env File**

After adding new API keys, your `.env` file should look like this:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# TMDb API (Already configured ✅)
TMDB_API_KEY=ae95a25fc8892bec5bcae86927d49d94
TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9...

# YouTube API (Add these)
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here

# TikTok API (Add these)
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here

# OpenAI API (Add this)
OPENAI_API_KEY=sk-your_api_key_here

# AWS S3 (Add these if using cloud storage)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=clip-generator-storage
```

---

## 🆘 **Need Help?**

- **TMDb Issues:** Check https://www.themoviedb.org/settings/api
- **YouTube Issues:** https://developers.google.com/youtube/v3/getting-started
- **TikTok Issues:** https://developers.tiktok.com/doc/content-posting-api-troubleshooting
- **OpenAI Issues:** https://help.openai.com/
- **AWS Issues:** https://docs.aws.amazon.com/

---

## 📚 **Additional Resources**

### Video Processing Tutorials:
- FFmpeg Guide: https://ffmpeg.org/ffmpeg.html
- Video Formats: https://trac.ffmpeg.org/wiki/Encode/H.264

### OAuth Flow Guides:
- YouTube OAuth: https://developers.google.com/identity/protocols/oauth2
- TikTok OAuth: https://developers.tiktok.com/doc/oauth-user-access-token-management

### Caption/Subtitle Formats:
- SRT Format: https://www.3playmedia.com/blog/create-srt-file/
- WebVTT Format: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API

---

**Last Updated:** October 22, 2025
**Your TMDb Status:** ✅ Active and working
