# Flask-related imports
from flask import Flask, request, jsonify
from flask_cors import CORS

# Database-related imports
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Loading environment variables 
load_dotenv()

# Flask setup 
# Initialize the Flask application
app = Flask(__name__)

# Setup MongoDB connection
mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.Ajar  # You can replace 'get_default_database' with your specific database name

# Storing it into config
app.config['db'] = db

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)