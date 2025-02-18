from flask import Flask, request, jsonify
from app.groqAgent import GroqAgent

import base64
from flask_cors import CORS
from dotenv import load_dotenv
from utils.helper import Helper

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


@app.route("/chat-agent", methods=['POST'])
async def chatAgent():
    
    

if "__main__" == __name__:
    app.run()