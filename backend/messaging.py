from fastapi import WebSocket, WebSocketDisconnect
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from typing import List, Dict
from pymongo import MongoClient
import os

# Load environment variables
load_dotenv()

key = os.getenv("ENCRYPTION_KEY")
cipher_suite = Fernet(key)

mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.Ajar

# WebSocket manager
class ConnectionManager:
    def __init__(self, mgr_id: int):
        self.mgr_id = mgr_id
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

        # Store message in MongoDB
        db.chats.insert_one({"mgr_id": self.mgr_id, "message": message})

    async def get_message_history(self) -> List[str]:
        # Retrieve message history from MongoDB
        messages = db.chats.find({"mgr_id": self.mgr_id})
        return [message["message"] for message in messages]

# Dictionary to store multiple ConnectionManager instances
managers: Dict[int, ConnectionManager] = {}

# Get or create a ConnectionManager instance
def get_manager(mgr_id: int) -> ConnectionManager:
    if mgr_id not in managers:
        managers[mgr_id] = ConnectionManager(mgr_id)
    return managers[mgr_id]

# WebSocket endpoint
async def websocket_endpoint(websocket: WebSocket, username: str, mgr: int):
    manager = get_manager(mgr)
    await manager.connect(websocket)
    
    # Send previous messages to the new connection
    history = await manager.get_message_history()
    for message in history:
        await websocket.send_text(message)
        
    try:
        while True:
            data = await websocket.receive_text()
            encrypted_message = cipher_suite.encrypt(data.encode())
            await manager.broadcast(f"{username}: {cipher_suite.decrypt(encrypted_message).decode()}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"User {username} left the chat")
