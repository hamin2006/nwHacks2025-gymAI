import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()


# Create a Flask app instance
app = Flask(__name__)
CORS(app)
# Define a route
@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"status": "failed", "message": "Missing credentials"})
    
    username = data['username']
    password = data['password']
    if username == os.getenv("USERNAME") and password == os.getenv("PASS"):
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed", "message": "Invalid credentials"})

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)  