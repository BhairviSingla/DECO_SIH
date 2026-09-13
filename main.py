from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os
import random


# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# Create FastAPI app
app = FastAPI(title="AquaCore API")


# -----------------------------
# Request Models
# -----------------------------

class VoiceQuery(BaseModel):
    query: str


class MarketplaceItem(BaseModel):
    name: str
    price: float
    seller: str
    category: str


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "AquaCore Backend is running!"
    }


# -----------------------------
# TANK APIs
# -----------------------------

@app.get("/api/tanks")
def get_tanks():

    response = supabase.table("tanks").select("*").execute()

    return response.data


# -----------------------------
# FORECAST API
# -----------------------------

@app.get("/api/forecast/{tank_id}")
def get_forecast(tank_id: str):

    forecast = []

    for hour in range(48):
        oxygen = round(random.uniform(4.5, 8.5), 2)
        forecast.append(oxygen)

    return {
        "tank_id": tank_id,
        "forecast_48h": forecast,
        "status": "mock_data"
    }


# -----------------------------
# DISEASE CHECK API
# -----------------------------

@app.post("/api/disease-check")
async def disease_check(file: UploadFile = File(...)):

    return {
        "filename": file.filename,
        "prediction": "healthy",
        "confidence": 0.91,
        "status": "mock_data"
    }


# -----------------------------
# MARKETPLACE - GET
# -----------------------------

@app.get("/api/marketplace")
def get_marketplace():

    response = supabase.table("items").select("*").execute()

    return response.data


# -----------------------------
# MARKETPLACE - CREATE LISTING
# -----------------------------

@app.post("/api/marketplace")
def create_marketplace_item(item: MarketplaceItem):

    new_item = {
        "name": item.name,
        "price": item.price,
        "seller": item.seller,
        "category": item.category
    }

    response = supabase.table("items").insert(new_item).execute()

    return {
        "message": "Marketplace item created successfully",
        "item": response.data
    }


# -----------------------------
# VOICE QUERY API
# -----------------------------

@app.post("/api/voice-query")
def voice_query(data: VoiceQuery):

    query = data.query.lower()

    # Get tank data from Supabase
    response = supabase.table("tanks").select("*").execute()

    tanks = response.data

    if not tanks:
        answer = "No tank data is currently available."

    else:

        # Default to Tank 1
        selected_tank = tanks[0]

        # Try to detect tank number from user query
        for tank in tanks:

            tank_name = tank["name"].lower()

            if tank_name in query:
                selected_tank = tank
                break

        # Temperature
        if "temperature" in query or "temp" in query:

            answer = (
                f"The temperature of {selected_tank['name']} "
                f"is {selected_tank['temperature']}°C."
            )

        # Oxygen
        elif "oxygen" in query:

            answer = (
                f"The oxygen level of {selected_tank['name']} "
                f"is {selected_tank['oxygen']} mg/L."
            )

        # pH
        elif "ph" in query:

            answer = (
                f"The pH level of {selected_tank['name']} "
                f"is {selected_tank['ph']}."
            )

        # Biomass
        elif "biomass" in query:

            answer = (
                f"The biomass of {selected_tank['name']} "
                f"is {selected_tank['biomass']} kg."
            )

        # Status
        elif "status" in query or "condition" in query:

            answer = (
                f"{selected_tank['name']} currently has "
                f"{selected_tank['status']} status."
            )

        else:

            answer = "Sorry, I could not understand your question."


    # Save voice query and answer to database
    history_data = {
        "query": data.query,
        "answer": answer
    }

    supabase.table("voice_history").insert(history_data).execute()


    # Return answer
    return {
        "answer": answer
    }


# -----------------------------
# VOICE HISTORY API
# -----------------------------

@app.get("/api/voice-history")
def get_voice_history():

    response = (
        supabase
        .table("voice_history")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data