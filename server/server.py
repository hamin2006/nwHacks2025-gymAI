import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from groq import Groq;
load_dotenv()


# Create a Flask app instance
app = Flask(__name__)
CORS(app)
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)
# Define a route
@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/hello', methods = ['GET'])
def hello():
    print("Hello")
    return jsonify({"message": "Hello"})

@app.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"status": "failed", "message": "Missing credentials"})
    print(data)
    username = data['username']
    password = data['password']
    if username == os.getenv("USERNAME") and password == os.getenv("PASS"):
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed", "message": "Invalid credentials"})

@app.route('/feedback', methods=['POST'])
def get_feedback():
    try:
        data = request.get_json()
        print(data)
        # Craft the OpenAI prompt
        prompt = f"""
        Analyze the quality of a set of exercises (which type is named in the json under data[i].excercise based on the following set of body landmarks:
        {data}.
        
        Provide feedback on:
        - Depth of form
        - Alignment of limbs
        - Position of the back (e.g., is it straight or leaning too far?) per the requirements of the exercise
        - Overall form
        - No strict criteria just give some feedback on the quality of the exercise
        
        Provide specific recommendations for improvement or comment on the great quality of the reps.
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a fitness coach analyzing the quality of a set of exercises. Keep the feedback constructive and helpful, but simple. Don't go into the nitty-gritty details." +
                 "Just say your reps weren't deep enough or your back was arched for a couple reps, etc. For time based exercises (like plank) you'll be provided with coordinates every second of the exercise. Start your analysis with Hi! Your Personal Trainer here!"},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
        )
        
        return jsonify({"feedback": response.choices[0].message.content})
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)  