from flask import Flask, request, jsonify

# Create a Flask app instance
app = Flask(__name__)

# Define a route
@app.route('/')
def home():
    return "Flask server is running!"

# Example API endpoint
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        "message": "Hello from Flask!",
        "status": "success"
    })

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)