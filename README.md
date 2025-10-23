# Clip Generator - Vertical Video Clip Creator

A full-stack web application that automatically generates vertical video clips (9:16 aspect ratio) from TV shows, movies, and streamer content, optimized for TikTok and YouTube Shorts.

## Features

- 🔍 **Content Search**: Search for TV shows, movies, and streamer content
- ✂️ **Automatic Clip Extraction**: AI-powered highlight detection
- 📱 **Vertical Format**: Automatic conversion to 9:16 aspect ratio (1080x1920)
- 📝 **Auto Captions**: Speech-to-text captioning with customization
- 🎬 **Credits Overlay**: Automatic metadata overlays (show name, cast, etc.)
- 📤 **Direct Upload**: Upload directly to YouTube Shorts and TikTok
- 🎨 **Customization**: Add filters, effects, and branding

## Tech Stack

### Frontend
- React.js with hooks
- Tailwind CSS for styling
- Video.js for video preview
- Axios for API calls

### Backend
- Node.js/Express REST API
- Multer for file uploads
- JWT authentication
- Integration with external APIs

### Video Processing
- Python Flask service
- FFmpeg for video manipulation
- OpenAI Whisper for captioning
- Custom AI models for clip selection

### External APIs
- TMDb API for content metadata
- YouTube Data API v3 for uploads
- TikTok API for direct uploads
- Google Cloud Video Intelligence (optional)

## Project Structure

```
clip-generator/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   └── App.js
│   └── package.json
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   └── config/           # Configuration
│   └── package.json
├── video-processor/          # Python video processing service
│   ├── app.py                # Flask application
│   ├── services/             # Video processing logic
│   ├── models/               # AI models
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- FFmpeg installed on your system
- API keys for TMDb, YouTube, etc.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clip-generator
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Set up FFmpeg**
   - Windows: Download from https://ffmpeg.org/ and add to PATH
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev:backend
   ```

2. **Start the video processor service**
   ```bash
   npm run dev:processor
   ```

3. **Start the frontend**
   ```bash
   npm run dev:frontend
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Video Processor: http://localhost:8000

#### Production Mode with Docker

```bash
npm run docker:build
npm run docker:up
```

## API Documentation

### Content Search
```
GET /api/content/search?query={show_name}&type={tv|movie}
```

### Create Clip
```
POST /api/clips/create
Body: {
  contentId: string,
  season: number (optional),
  episode: number (optional),
  length: number (seconds),
  clipType: string,
  hashtags: string[]
}
```

### Upload to YouTube
```
POST /api/upload/youtube
Body: {
  clipId: string,
  title: string,
  description: string,
  tags: string[]
}
```

## Configuration

### API Keys Required

1. **TMDb API** (Free): https://www.themoviedb.org/settings/api
2. **YouTube Data API**: https://console.cloud.google.com/
3. **OpenAI API** (for Whisper): https://platform.openai.com/
4. **AWS S3** (optional, for cloud storage): https://aws.amazon.com/s3/

## Features Roadmap

- [x] Basic content search
- [x] Video format conversion (9:16)
- [x] Auto-captioning
- [x] Credits overlay
- [ ] AI-powered clip selection
- [ ] Direct TikTok upload
- [ ] YouTube upload with OAuth
- [ ] Custom branding/watermarks
- [ ] User accounts and saved clips
- [ ] Batch processing

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
