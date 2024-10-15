import json
import random

# Define the file name
file_name = 'barcelona-listings.json'

# Load the JSON file
with open(file_name, 'r') as file:
    data = json.load(file)

# Function to modify longitude and latitude with random values
def modify_coordinates(listing):
    base_latitude = 31.948766
    base_longitude = 35.931132
    
    # Add a random value between -0.1 and 0.1 to base latitude and longitude
    listing['latitude'] = base_latitude + random.uniform(-0.3, 0.3)
    listing['longitude'] = base_longitude + random.uniform(-0.3, 0.3)
    return listing

def modifytype(listing):
    if(listing['property_type'] == "Home/Apt"):
        listing['property_type'] = "FarmHouses"
    else:
        listing['property_type'] = "DJ"
    


# Loop through all listings and modify their coordinates
for listing in data:
    modifytype(listing)

# Save the modified data back to the JSON file
with open(file_name, 'w') as file:
    json.dump(data, file, indent=4)

print("Longitude and latitude values have been updated with random adjustments.")
