# API Documentation

## Base URLs

- **Backend API:** `http://localhost:5000/api`
- **Video Processor:** `http://localhost:8000`

## Authentication

Currently, the API does not require authentication for development. In production, implement JWT-based authentication.

---

## Content Endpoints

### Search Content

Search for TV shows, movies, and streamer content.

**Endpoint:** `GET /api/content/search`

**Query Parameters:**
- `query` (required): Search term
- `type` (optional): `tv`, `movie`, or `multi` (default: `multi`)
- `page` (optional): Page number (default: 1)

**Example Request:**
```bash
curl "http://localhost:5000/api/content/search?query=breaking%20bad&type=tv"
```

**Example Response:**
```json
{
  "results": [
    {
      "id": 1396,
      "title": "Breaking Bad",
      "type": "tv",
      "releaseDate": "2008-01-20",
      "overview": "When Walter White, a chemistry teacher...",
      "posterPath": "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      "backdropPath": "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
      "popularity": 369.594,
      "voteAverage": 8.9
    }
  ],
  "page": 1,
  "totalPages": 1,
  "totalResults": 1
}
```

---

### Get Content Details

Get detailed information about a specific show or movie.

**Endpoint:** `GET /api/content/:id`

**Query Parameters:**
- `type` (optional): `tv` or `movie` (default: `tv`)

**Example Request:**
```bash
curl "http://localhost:5000/api/content/1396?type=tv"
```

**Example Response:**
```json
{
  "id": 1396,
  "title": "Breaking Bad",
  "type": "tv",
  "overview": "When Walter White...",
  "releaseDate": "2008-01-20",
  "numberOfSeasons": 5,
  "numberOfEpisodes": 62,
  "seasons": [...],
  "cast": [...],
  "crew": [...]
}
```

---

### Get Season Episodes

Get all episodes for a specific season.

**Endpoint:** `GET /api/content/:id/season/:seasonNumber`

**Example Request:**
```bash
curl "http://localhost:5000/api/content/1396/season/1"
```

**Example Response:**
```json
{
  "seasonNumber": 1,
  "name": "Season 1",
  "episodes": [
    {
      "id": 62085,
      "episodeNumber": 1,
      "name": "Pilot",
      "overview": "When an unassuming...",
      "airDate": "2008-01-20",
      "runtime": 58
    }
  ]
}
```

---

## Clip Endpoints

### Create Clip

Create a new clip from content.

**Endpoint:** `POST /api/clips/create`

**Request Body:**
```json
{
  "contentId": "1396",
  "contentType": "tv",
  "season": 1,
  "episode": 1,
  "length": 60,
  "clipType": "highlight",
  "hashtags": ["breakingbad", "viral", "trending"],
  "customCaption": "Best scene ever!"
}
```

**Response:**
```json
{
  "clipId": "uuid-here",
  "status": "processing",
  "message": "Clip creation started"
}
```

---

### Upload Video

Upload and process a user's own video.

**Endpoint:** `POST /api/clips/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `video` (file): Video file
- `length` (number): Desired clip length in seconds
- `addCaptions` (boolean): Whether to add auto-captions
- `hashtags` (JSON array): Array of hashtags
- `customText` (string): Custom overlay text

**Example (using curl):**
```bash
curl -X POST \
  -F "video=@myvideo.mp4" \
  -F "length=60" \
  -F "addCaptions=true" \
  -F "hashtags=[\"funny\",\"viral\"]" \
  http://localhost:5000/api/clips/upload
```

---

### Get Clip Status

Check the processing status of a clip.

**Endpoint:** `GET /api/clips/:clipId/status`

**Example Response:**
```json
{
  "clipId": "uuid-here",
  "status": "completed",
  "progress": 100,
  "videoUrl": "/videos/uuid-here.mp4",
  "completedAt": "2024-01-20T12:00:00Z"
}
```

**Status Values:**
- `processing`: Clip is being processed
- `completed`: Clip is ready
- `failed`: Processing failed

---

### Download Clip

Download a processed clip.

**Endpoint:** `GET /api/clips/:clipId/download`

**Response:** Binary video file (MP4)

---

## Upload Endpoints

### Get YouTube Auth URL

Get the OAuth URL for YouTube authentication.

**Endpoint:** `GET /api/upload/youtube/auth-url`

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

---

### Upload to YouTube

Upload a clip to YouTube Shorts.

**Endpoint:** `POST /api/upload/youtube`

**Request Body:**
```json
{
  "clipId": "uuid-here",
  "title": "Amazing Breaking Bad Scene",
  "description": "Check out this incredible moment!",
  "tags": ["breakingbad", "shorts", "viral"],
  "accessToken": "youtube-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "youtube-video-id",
  "url": "https://youtube.com/shorts/video-id"
}
```

---

### Get TikTok Auth URL

Get the OAuth URL for TikTok authentication.

**Endpoint:** `GET /api/upload/tiktok/auth-url`

**Response:**
```json
{
  "authUrl": "https://www.tiktok.com/v2/auth/authorize?..."
}
```

---

### Upload to TikTok

Upload a clip to TikTok.

**Endpoint:** `POST /api/upload/tiktok`

**Request Body:**
```json
{
  "clipId": "uuid-here",
  "caption": "Amazing scene! #breakingbad #viral",
  "hashtags": ["breakingbad", "viral", "fyp"],
  "accessToken": "tiktok-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "videoId": "tiktok-video-id",
  "shareUrl": "https://tiktok.com/@user/video/id"
}
```

---

## Video Processor Endpoints

### Create Clip (Processor)

Internal endpoint called by backend to process clips.

**Endpoint:** `POST /process/create-clip`

**Request Body:**
```json
{
  "clipId": "uuid-here",
  "contentId": "1396",
  "contentType": "tv",
  "season": 1,
  "episode": 1,
  "length": 60,
  "clipType": "highlight"
}
```

---

### Process Uploaded Video

Internal endpoint to process user uploads.

**Endpoint:** `POST /process/uploaded-video`

**Content-Type:** `multipart/form-data`

---

### Generate Captions

Generate captions for a video.

**Endpoint:** `POST /captions/generate`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `video` (file): Video file

**Response:**
```json
{
  "captions": [
    {
      "start": 0,
      "end": 3,
      "text": "Welcome to this amazing clip!"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

**Common Status Codes:**
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side error

---

## Rate Limiting

Currently no rate limiting in development. Production should implement:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Image URLs

TMDb images are available at:
- **Base URL:** `https://image.tmdb.org/t/p/`
- **Sizes:** `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

**Example:**
```
https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg
```

---

## Webhooks (Future Feature)

Webhooks will be available to notify your application when:
- Clip processing completes
- Upload to social media succeeds/fails
- Engagement metrics are available

---

## SDK Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Search for content
const results = await api.get('/content/search', {
  params: { query: 'breaking bad', type: 'tv' }
});

// Create clip
const clip = await api.post('/clips/create', {
  contentId: '1396',
  contentType: 'tv',
  length: 60,
  clipType: 'highlight'
});
```

### Python
```python
import requests

API_BASE = 'http://localhost:5000/api'

# Search for content
response = requests.get(f'{API_BASE}/content/search', 
                       params={'query': 'breaking bad', 'type': 'tv'})
results = response.json()

# Create clip
response = requests.post(f'{API_BASE}/clips/create', json={
    'contentId': '1396',
    'contentType': 'tv',
    'length': 60,
    'clipType': 'highlight'
})
clip = response.json()
```
