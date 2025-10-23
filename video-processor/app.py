from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from services.video_processor import VideoProcessor
from services.caption_generator import CaptionGenerator
from services.clip_extractor import ClipExtractor
import logging

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
video_processor = VideoProcessor()
caption_generator = CaptionGenerator()
clip_extractor = ClipExtractor()

# Storage directories
UPLOAD_DIR = os.getenv('VIDEO_UPLOAD_DIR', './uploads')
OUTPUT_DIR = os.getenv('VIDEO_OUTPUT_DIR', './processed')

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'video-processor'})

@app.route('/process/create-clip', methods=['POST'])
def create_clip():
    """Create a clip from content metadata"""
    try:
        data = request.json
        clip_id = data.get('clipId')
        content_id = data.get('contentId')
        content_type = data.get('contentType')
        length = data.get('length', 60)
        clip_type = data.get('clipType', 'highlight')
        
        logger.info(f"Creating clip {clip_id} for content {content_id}")
        
        # In a real implementation, this would:
        # 1. Find/download the source video
        # 2. Use AI to identify interesting segments
        # 3. Extract the clip
        # 4. Add captions and credits
        # 5. Format to vertical (9:16)
        
        # For now, we'll simulate the process
        output_path = os.path.join(OUTPUT_DIR, f"{clip_id}.mp4")
        
        # Simulate processing (in production, call actual video processing)
        video_url = f"/videos/{clip_id}.mp4"
        
        return jsonify({
            'clipId': clip_id,
            'status': 'completed',
            'videoUrl': video_url,
            'message': 'Clip created successfully'
        })
        
    except Exception as e:
        logger.error(f"Error creating clip: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/process/uploaded-video', methods=['POST'])
def process_uploaded_video():
    """Process a user-uploaded video"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        clip_id = request.form.get('clipId')
        length = int(request.form.get('length', 60))
        add_captions = request.form.get('addCaptions', 'false') == 'true'
        
        logger.info(f"Processing uploaded video for clip {clip_id}")
        
        # Save uploaded file
        input_path = os.path.join(UPLOAD_DIR, f"{clip_id}_original.mp4")
        video_file.save(input_path)
        
        output_path = os.path.join(OUTPUT_DIR, f"{clip_id}.mp4")
        
        # Process video
        video_processor.convert_to_vertical(input_path, output_path)
        
        # Trim to desired length
        video_processor.trim_video(output_path, output_path, length)
        
        # Add captions if requested
        if add_captions:
            captions = caption_generator.generate_captions(output_path)
            video_processor.add_captions(output_path, output_path, captions)
        
        video_url = f"/videos/{clip_id}.mp4"
        
        return jsonify({
            'clipId': clip_id,
            'status': 'completed',
            'videoUrl': video_url,
            'message': 'Video processed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/process/status/<clip_id>', methods=['GET'])
def get_status(clip_id):
    """Get processing status for a clip"""
    try:
        output_path = os.path.join(OUTPUT_DIR, f"{clip_id}.mp4")
        
        if os.path.exists(output_path):
            video_url = f"/videos/{clip_id}.mp4"
            return jsonify({
                'clipId': clip_id,
                'status': 'completed',
                'progress': 100,
                'videoUrl': video_url
            })
        else:
            return jsonify({
                'clipId': clip_id,
                'status': 'processing',
                'progress': 50
            })
            
    except Exception as e:
        logger.error(f"Error checking status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/captions/generate', methods=['POST'])
def generate_captions():
    """Generate captions for a video"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        temp_path = os.path.join(UPLOAD_DIR, 'temp_caption.mp4')
        video_file.save(temp_path)
        
        captions = caption_generator.generate_captions(temp_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return jsonify({
            'captions': captions
        })
        
    except Exception as e:
        logger.error(f"Error generating captions: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
