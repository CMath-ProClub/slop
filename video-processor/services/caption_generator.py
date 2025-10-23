import os
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

class CaptionGenerator:
    """Generate captions for videos using speech-to-text"""
    
    def __init__(self):
        self.client = None
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.client = OpenAI(api_key=api_key)
    
    def generate_captions(self, video_path):
        """
        Generate captions from video audio using Whisper
        Returns list of caption segments
        """
        try:
            if not self.client:
                logger.warning("OpenAI API key not configured, using mock captions")
                return self._generate_mock_captions()
            
            logger.info(f"Generating captions for: {video_path}")
            
            # Extract audio from video
            audio_path = self._extract_audio(video_path)
            
            # Transcribe using Whisper
            with open(audio_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["segment"]
                )
            
            # Convert to caption format
            captions = []
            for segment in transcript.segments:
                captions.append({
                    'start': segment['start'],
                    'end': segment['end'],
                    'text': segment['text'].strip()
                })
            
            # Clean up temp audio file
            os.remove(audio_path)
            
            logger.info(f"Generated {len(captions)} caption segments")
            return captions
            
        except Exception as e:
            logger.error(f"Error generating captions: {str(e)}")
            return self._generate_mock_captions()
    
    def _extract_audio(self, video_path):
        """Extract audio from video file"""
        import ffmpeg
        
        audio_path = video_path.replace('.mp4', '_audio.wav')
        
        stream = ffmpeg.input(video_path)
        stream = ffmpeg.output(stream, audio_path,
                              acodec='pcm_s16le',
                              ac=1,
                              ar='16k')
        ffmpeg.run(stream, overwrite_output=True, quiet=True)
        
        return audio_path
    
    def _generate_mock_captions(self):
        """Generate mock captions for testing"""
        return [
            {'start': 0, 'end': 3, 'text': 'Welcome to this amazing clip!'},
            {'start': 3, 'end': 6, 'text': 'Watch what happens next...'},
            {'start': 6, 'end': 9, 'text': 'This is absolutely incredible!'}
        ]
    
    def format_for_social_media(self, captions, platform='tiktok'):
        """
        Format captions specifically for social media platforms
        """
        if platform == 'tiktok':
            # TikTok style: shorter segments, more dynamic
            return self._format_for_tiktok(captions)
        elif platform == 'youtube':
            # YouTube style: longer segments
            return self._format_for_youtube(captions)
        return captions
    
    def _format_for_tiktok(self, captions):
        """Format captions for TikTok (shorter, punchier)"""
        formatted = []
        for caption in captions:
            words = caption['text'].split()
            if len(words) > 5:
                # Split into smaller chunks
                chunk_size = 5
                for i in range(0, len(words), chunk_size):
                    chunk = ' '.join(words[i:i+chunk_size])
                    duration = (caption['end'] - caption['start']) / (len(words) / chunk_size)
                    formatted.append({
                        'start': caption['start'] + (i / len(words)) * (caption['end'] - caption['start']),
                        'end': caption['start'] + ((i + chunk_size) / len(words)) * (caption['end'] - caption['start']),
                        'text': chunk
                    })
            else:
                formatted.append(caption)
        return formatted
    
    def _format_for_youtube(self, captions):
        """Format captions for YouTube (standard formatting)"""
        return captions
