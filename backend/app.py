# FastAPI-related imports
from fastapi import FastAPI, WebSocket, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from enum import Enum
from bson.objectid import ObjectId
from messaging import websocket_endpoint, manager

# Importing models
from models.RentModel import RentalItem


'''
Date Structure 


User 
Information: 
ID 
Name
Phone number 
Email
Age 
Password (hashed?) 
Verification info (id, passport, etc)
Personal photo (?)  
List of id’s of farmhouses saved  
List of cart in items 
List of id’s of utilities already booked  
Reviews given to user 
Sellers 
Information (Same as above) 
List of id’s of farmhouses being offered 
Reviews given to the seller (?) (maybe avg of reviews given to farmhouses/utilities being rented) 

FarmHouses/utilities 
Name 
Location 
Description 
Utilities? 
Photos 
Reviews
Dates available/ booked 
Price 
Conditions (no males, only families) 
Message? 
Id 
Messages 
From 
to

'''
class ObjectType(Enum):
    frmhs = "Farmhouses"
    usr = "Users"
    slr = "Sellers"




load_dotenv()

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.Ajar  
@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/add_user/{user_id}")
async def add_user(user: dict):
    users = db["Users"]
    users.insert_one(user)
    return {"message": "User added successfully!"}

@app.get("/get_users")
async def get_users():
    users = db["Users"]
    all_users = users.find()
    return {"users": all_users}

@app.get("/get_user/{user_id}")
async def get_user(user_id: str):
    users = db["Users"]
    user = users.find_one({"_id": user_id})
    return {"user": user}

@app.put("/update_user/{user_id}")
async def update_user(user_id: str, user: dict):
    users = db["Users"]
    users.update_one({"_id": user_id}, {"$set": user})
    return {"message": "User updated successfully!"}

@app.delete("/delete_user/{user_id}")
async def delete_user(user_id: str):
    users = db["Users"]
    users.delete_one({"_id": user_id})
    return {"message": "User deleted successfully!"}

@app.post("/add_seller/{seller_id}")
async def add_seller(seller: dict):
    sellers = db["Sellers"]
    sellers.insert_one(seller)
    return {"message": "Seller added successfully!"}

@app.get("/get_sellers")
async def get_sellers():
    sellers = db["Sellers"]
    all_sellers = sellers.find()
    return {"sellers": all_sellers}

@app.get("/get_seller/{seller_id}")
async def get_seller(seller_id: str):
    sellers = db["Sellers"]
    seller = sellers.find_one({"_id": seller_id})
    return {"seller": seller}

@app.put("/update_seller/{seller_id}")
async def update_seller(seller_id: str, seller: dict):
    sellers = db["Sellers"]
    sellers.update_one({"_id": seller_id}, {"$set": seller})
    return {"message": "Seller updated successfully!"}

@app.delete("/delete_seller/{seller_id}")
async def delete_seller(seller_id: str):
    sellers = db["Sellers"]
    sellers.delete_one({"_id": seller_id})
    return {"message": "Seller deleted successfully!"}



# We need to define the database structure for farmhouse need
@app.post("/add_farmhouse")
async def add_farmhouse(farmhouse: RentalItem):
    farmhouses = db["Farmhouses"]
    
    # Convert the Pydantic model to a dictionary
    farmhouse_dict = farmhouse.dict()
    
    # Insert the farmhouse dictionary into the database
    result = farmhouses.insert_one(farmhouse_dict)
    
    return {"message": "Farmhouse added successfully!", "id": str(result.inserted_id)}

@app.get("/get_farmhouses")
async def get_farmhouses():
    farmhouses = db["Farmhouses"]
    
    # Convert the cursor returned by `find()` to a list
    all_farmhouses = list(farmhouses.find())
    
    # MongoDB ObjectId is not JSON serializable, so convert the ObjectId to a string
    for farmhouse in all_farmhouses:
        farmhouse["_id"] = str(farmhouse["_id"])
    return {"farmhouses": all_farmhouses}

@app.get("/get_farmhouse/{farmhouse_id}")
async def get_farmhouse(farmhouse_id: str):
    farmhouses = db["Farmhouses"]
    try:
        farmhouse = farmhouses.find_one({"_id": ObjectId(farmhouse_id)})
        if farmhouse is None:
            raise HTTPException(status_code=404, detail="Farmhouse not found")
        # Convert the farmhouse data to JSON, making the ObjectId a string
        farmhouse['_id'] = str(farmhouse['_id'])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return (farmhouse)
   

@app.put("/update_farmhouse/{farmhouse_id}")
async def update_farmhouse(farmhouse_id: str, farmhouse: dict):
    farmhouses = db["Farmhouses"]
    farmhouses.update_one({"_id": farmhouse_id}, {"$set": farmhouse})
    return {"message": "Farmhouse updated successfully!"}

@app.delete("/delete_farmhouse/{farmhouse_id}")
async def delete_farmhouse(farmhouse_id: str):
    farmhouses = db["Farmhouses"]
    farmhouses.delete_one({"_id": farmhouse_id})
    return {"message": "Farmhouse deleted successfully!"}




@app.get("/get_reviews")
async def get_reviews(object_type: ObjectType, object_id: str):
    reviews = db["Reviews"]
    all_reviews = reviews.find({"object_type": object_type.value, "object_id": object_id})
    return {"reviews": all_reviews}

@app.get("/get_reviews{object_type}/{object_id}")
async def get_reviews(object_type: Enum, object_id: str):
    d = db[object_type.value]
    all_reviews = d.find({"object_id": object_id})["reviews"]
    return {"reviews": all_reviews}

@app.post("/add_review/{object_type}/{object_id}")
async def add_review(object_type: Enum, object_id: str, review: dict):
    d = db[object_type.value]
    d.update_one({"_id": object_id}, {"$push": {"reviews": review}})
    return {"message": "Review added successfully!"}

@app.put("/update_review/{object_type}/{object_id}/{review_id}")
async def update_review(object_type: Enum, object_id: str, review_id: str, review: dict):
    d = db[object_type.value]
    d.update_one({"_id": object_id, "reviews._id": review_id}, {"$set": review})
    return {"message": "Review updated successfully!"}

@app.delete("/delete_review/{object_type}/{object_id}/{review_id}")
async def delete_review(object_type: Enum, object_id: str, review_id: str):
    d = db[object_type.value]
    d.update_one({"_id": object_id}, {"$pull": {"reviews": {"_id": review_id}}})
    return {"message": "Review deleted successfully!"}


    
@app.websocket("/ws/{username}")
async def websocket_route(websocket: WebSocket, username: str):
    await websocket_endpoint(websocket, username)


# Start the FastAPI app
# You can run the app with: `uvicorn your_script_name:app --reload`
