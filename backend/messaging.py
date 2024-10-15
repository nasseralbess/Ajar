from fastapi import WebSocket, WebSocketDisconnect
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from typing import List
import os

# Load environment variables
load_dotenv()

key = os.getenv("ENCRYPTION_KEY")
cipher_suite = Fernet(key)

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# WebSocket endpoint
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            encrypted_message = cipher_suite.encrypt(data.encode())
            await manager.broadcast(f"{username}: {cipher_suite.decrypt(encrypted_message).decode()}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"User {username} left the chat")
