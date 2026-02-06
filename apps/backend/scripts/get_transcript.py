import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def get_transcript(video_id):
    """
    Fetches the transcript for a given YouTube video ID using youtube_transcript_api.
    Outputs the transcript as a JSON string to stdout.
    """
    try:
        # Fetch the transcript
        # We can specify languages if needed, e.g., languages=['en']
        # For now, we let it pick the default (usually manually created or auto-generated english)
        # Note: The installed version requires instantiation and returns a FetchedTranscript object
        api = YouTubeTranscriptApi()
        fetched_transcript = api.fetch(video_id)
        transcript = fetched_transcript.to_raw_data()
        
        # Output the transcript as JSON
        print(json.dumps(transcript))
        
    except (TranscriptsDisabled, NoTranscriptFound):
        error_msg = {"error": "Transcript not available for this video."}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        error_msg = {"error": str(e)}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python get_transcript.py <VIDEO_ID>", file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]
    get_transcript(video_id)
