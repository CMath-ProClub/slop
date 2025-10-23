import ffmpeg
import os
import logging

logger = logging.getLogger(__name__)

class VideoProcessor:
    """Handle video processing operations using FFmpeg"""
    
    def __init__(self):
        self.output_resolution = (1080, 1920)  # 9:16 aspect ratio
        
    def convert_to_vertical(self, input_path, output_path):
        """
        Convert video to vertical format (9:16 aspect ratio)
        """
        try:
            logger.info(f"Converting video to vertical format: {input_path}")
            
            # Get input video info
            probe = ffmpeg.probe(input_path)
            video_info = next(s for s in probe['streams'] if s['codec_type'] == 'video')
            width = int(video_info['width'])
            height = int(video_info['height'])
            
            # Calculate scaling and cropping
            target_width, target_height = self.output_resolution
            target_aspect = target_width / target_height
            source_aspect = width / height
            
            if source_aspect > target_aspect:
                # Source is wider, crop width
                new_width = int(height * target_aspect)
                x_offset = (width - new_width) // 2
                crop_filter = f"crop={new_width}:{height}:{x_offset}:0"
            else:
                # Source is taller, crop height
                new_height = int(width / target_aspect)
                y_offset = (height - new_height) // 2
                crop_filter = f"crop={width}:{new_height}:0:{y_offset}"
            
            # Process video
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.filter(stream, 'crop', crop_filter)
            stream = ffmpeg.filter(stream, 'scale', target_width, target_height)
            stream = ffmpeg.output(stream, output_path, 
                                   vcodec='libx264',
                                   acodec='aac',
                                   video_bitrate='4M',
                                   audio_bitrate='192k')
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            
            logger.info(f"Video converted successfully: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Error converting video: {str(e)}")
            raise
    
    def trim_video(self, input_path, output_path, duration):
        """
        Trim video to specified duration (in seconds)
        """
        try:
            logger.info(f"Trimming video to {duration} seconds")
            
            stream = ffmpeg.input(input_path, ss=0, t=duration)
            stream = ffmpeg.output(stream, output_path,
                                   vcodec='copy',
                                   acodec='copy')
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            
            logger.info(f"Video trimmed successfully: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Error trimming video: {str(e)}")
            raise
    
    def add_captions(self, input_path, output_path, captions):
        """
        Add captions to video
        captions format: [{'start': 0, 'end': 5, 'text': 'Hello world'}, ...]
        """
        try:
            logger.info("Adding captions to video")
            
            # Create SRT file
            srt_path = output_path.replace('.mp4', '.srt')
            self._create_srt_file(captions, srt_path)
            
            # Add subtitles to video
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.filter(stream, 'subtitles', srt_path,
                                   force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2')
            stream = ffmpeg.output(stream, output_path,
                                   vcodec='libx264',
                                   acodec='aac')
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            
            # Clean up SRT file
            os.remove(srt_path)
            
            logger.info("Captions added successfully")
            return output_path
            
        except Exception as e:
            logger.error(f"Error adding captions: {str(e)}")
            raise
    
    def add_credits_overlay(self, input_path, output_path, credits_text):
        """
        Add credits overlay to video
        """
        try:
            logger.info("Adding credits overlay")
            
            # Create overlay text
            overlay_filter = (
                f"drawtext=text='{credits_text}':"
                f"fontsize=20:fontcolor=white:"
                f"x=(w-text_w)/2:y=h-60:"
                f"box=1:boxcolor=black@0.5:boxborderw=5"
            )
            
            stream = ffmpeg.input(input_path)
            stream = ffmpeg.filter(stream, 'drawtext', 
                                   text=credits_text,
                                   fontsize=20,
                                   fontcolor='white',
                                   x='(w-text_w)/2',
                                   y='h-60',
                                   box=1,
                                   boxcolor='black@0.5')
            stream = ffmpeg.output(stream, output_path,
                                   vcodec='libx264',
                                   acodec='copy')
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            
            logger.info("Credits overlay added successfully")
            return output_path
            
        except Exception as e:
            logger.error(f"Error adding credits: {str(e)}")
            raise
    
    def _create_srt_file(self, captions, srt_path):
        """Create SRT subtitle file from captions"""
        with open(srt_path, 'w', encoding='utf-8') as f:
            for i, caption in enumerate(captions, 1):
                start_time = self._format_time(caption['start'])
                end_time = self._format_time(caption['end'])
                f.write(f"{i}\n")
                f.write(f"{start_time} --> {end_time}\n")
                f.write(f"{caption['text']}\n\n")
    
    def _format_time(self, seconds):
        """Format time in seconds to SRT format (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
