# FastAPI-related imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Loading environment variables 
load_dotenv()

# FastAPI setup
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup MongoDB connection
mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.Ajar  # Replace 'Ajar' with your specific database name if needed

# Example route
@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}

# Start the FastAPI app
# You can run the app with: `uvicorn your_script_name:app --reload`
