from flask import Flask, request, send_file, jsonify, after_this_request, redirect, url_for, session, Response
import fitz
import tempfile
import os
import requests
from llmFunctions import evaluate_resume
from llmFunctions import parse_resume_with_llm
import asyncio
import edge_tts
from flask_cors import CORS
import uuid


app = Flask(__name__)
CORS(app)

@app.route("/parse-resume", methods=['POST'])
def parse_resume():
  
  if 'file' not in request.files:
    return jsonify({"message" : "No file Found"}), 400
  
  uploaded_file = request.files['file']
  
  with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
    uploaded_file.save(temp.name)
    temp_path = temp.name
  
  try:
    
    doc = fitz.open(temp_path)
    resume_text = "\n".join([page.get_text() for page in doc])  # type: ignore
    doc.close()
    os.remove(temp_path)
    
    parsed_resume_data = parse_resume_with_llm(resume_text)
    
    return jsonify({"resume_data" : parsed_resume_data})
  except Exception as e:
    return jsonify({"message" : str(e)}), 500
  
  
@app.route("/evaluate-resume", methods=["POST"])
def evaluate_resume_endpoint():
    data = request.json  # type: ignore
    resume_json = data.get("resume_data")  # type: ignore
    job_title = data.get("job_title")  # type: ignore
    topics = data.get("topics")  # type: ignore

    result = evaluate_resume(resume_json, job_title, topics)
    return jsonify({"evaluation": result})



@app.route("/speak", methods=["POST"])
def speak():
  file_path = None  # Initialize file_path to prevent unbound variable error
  try:
    data = request.json  # type: ignore
    user_text = data.get("text", "Hello, how can I help you?")  # type: ignore
    voice = "en-US-JennyNeural"

    # Validate input
    if not user_text or not isinstance(user_text, str):
      return jsonify({"error": "Invalid text provided"}), 400

    # Limit text length to reduce processing time
    if len(user_text) > 1000:
      user_text = user_text[:1000]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
      file_path = temp_audio.name

    async def generate_audio():
      # Use faster settings for edge_tts
      tts = edge_tts.Communicate(
        text=user_text, 
        voice=voice,
        rate="+10%",  # Slightly faster speech
        volume="+0%"
      )
      await tts.save(file_path)

    # Run the async function
    asyncio.run(generate_audio())

    @after_this_request
    def cleanup(response):
      try:
        if file_path and os.path.exists(file_path):
          os.remove(file_path)
          print(f"Deleted: {file_path}")
      except Exception as e:
        print("Cleanup error:", e)
      return response

    # Send file with cache headers to improve performance
    return send_file(
      file_path, 
      mimetype="audio/mpeg",
      as_attachment=False,
      download_name="speech.mp3"
    )

  except Exception as e:
    # Cleanup in case of error
    try:
      if file_path and os.path.exists(file_path):
        os.remove(file_path)
    except:
      pass
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=3000, debug=True)


