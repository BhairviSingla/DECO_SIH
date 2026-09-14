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
    language: str = "en-IN"


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
def localize_answer(intent, tank, language):
    name = tank["name"]

    # -------------------------
    # HINDI
    # -------------------------
    if language == "hi-IN":
        if intent == "temperature":
            return f"{name} का तापमान {tank['temperature']}°C है।"
        elif intent == "oxygen":
            return f"{name} में ऑक्सीजन का स्तर {tank['oxygen']} mg/L है।"
        elif intent == "ph":
            return f"{name} का pH स्तर {tank['ph']} है।"
        elif intent == "biomass":
            return f"{name} का बायोमास {tank['biomass']} kg है।"
        elif intent == "status":
            return f"{name} की स्थिति {tank['status']} है।"
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"हाँ, {name} के लिए एक अलर्ट है। "
                    f"अमोनिया का स्तर {tank['ammonia']} ppm है, "
                    f"जो असुरक्षित है और ध्यान देने की आवश्यकता है।"
                )
            return "आपके टैंकों में वर्तमान में कोई गंभीर अलर्ट नहीं है।"

    # -------------------------
    # BENGALI
    # -------------------------
    elif language == "bn-IN":
        if intent == "temperature":
            return f"{name}-এর তাপমাত্রা {tank['temperature']}°C।"
        elif intent == "oxygen":
            return f"{name}-এ অক্সিজেনের মাত্রা {tank['oxygen']} mg/L।"
        elif intent == "ph":
            return f"{name}-এর pH মাত্রা {tank['ph']}।"
        elif intent == "biomass":
            return f"{name}-এর বায়োমাস {tank['biomass']} kg।"
        elif intent == "status":
            return f"{name}-এর অবস্থা {tank['status']}।"
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"হ্যাঁ, {name}-এর জন্য একটি সতর্কতা রয়েছে। "
                    f"অ্যামোনিয়ার মাত্রা {tank['ammonia']} ppm, "
                    f"যা অনিরাপদ এবং মনোযোগ প্রয়োজন।"
                )
            return "আপনার ট্যাঙ্কগুলিতে বর্তমানে কোনো গুরুতর সতর্কতা নেই।"

    # -------------------------
    # TELUGU
    # -------------------------
    elif language == "te-IN":
        if intent == "temperature":
            return f"{name} ఉష్ణోగ్రత {tank['temperature']}°C."
        elif intent == "oxygen":
            return f"{name}లో ఆక్సిజన్ స్థాయి {tank['oxygen']} mg/L."
        elif intent == "ph":
            return f"{name} pH స్థాయి {tank['ph']}."
        elif intent == "biomass":
            return f"{name} బయోమాస్ {tank['biomass']} kg."
        elif intent == "status":
            return f"{name} స్థితి {tank['status']}."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"అవును, {name} కోసం ఒక హెచ్చరిక ఉంది. "
                    f"అమోనియా స్థాయి {tank['ammonia']} ppm ఉంది, "
                    f"ఇది అసురక్షిత స్థాయి మరియు తక్షణ శ్రద్ధ అవసరం."
                )
            return "మీ ట్యాంకుల్లో ప్రస్తుతం ఎటువంటి తీవ్రమైన హెచ్చరికలు లేవు."

    # -------------------------
    # MARATHI
    # -------------------------
    elif language == "mr-IN":
        if intent == "temperature":
            return f"{name} चे तापमान {tank['temperature']}°C आहे."
        elif intent == "oxygen":
            return f"{name} मधील ऑक्सिजनची पातळी {tank['oxygen']} mg/L आहे."
        elif intent == "ph":
            return f"{name} ची pH पातळी {tank['ph']} आहे."
        elif intent == "biomass":
            return f"{name} चा बायोमास {tank['biomass']} kg आहे."
        elif intent == "status":
            return f"{name} ची स्थिती {tank['status']} आहे."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"होय, {name} साठी एक इशारा आहे. "
                    f"अमोनियाची पातळी {tank['ammonia']} ppm आहे, "
                    f"जी असुरक्षित आहे आणि त्वरित लक्ष देण्याची गरज आहे."
                )
            return "तुमच्या टाक्यांमध्ये सध्या कोणतेही गंभीर इशारे नाहीत."

    # -------------------------
    # TAMIL
    # -------------------------
    elif language == "ta-IN":
        if intent == "temperature":
            return f"{name} வெப்பநிலை {tank['temperature']}°C ஆகும்."
        elif intent == "oxygen":
            return f"{name} ஆக்சிஜன் அளவு {tank['oxygen']} mg/L ஆகும்."
        elif intent == "ph":
            return f"{name} pH அளவு {tank['ph']} ஆகும்."
        elif intent == "biomass":
            return f"{name} பயோமாஸ் {tank['biomass']} kg ஆகும்."
        elif intent == "status":
            return f"{name} நிலை {tank['status']} ஆகும்."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"ஆம், {name} க்கு ஒரு எச்சரிக்கை உள்ளது. "
                    f"அம்மோனியா அளவு {tank['ammonia']} ppm ஆக உள்ளது, "
                    f"இது பாதுகாப்பற்ற நிலை மற்றும் உடனடி கவனம் தேவை."
                )
            return "உங்கள் தொட்டிகளில் தற்போது தீவிரமான எச்சரிக்கைகள் எதுவும் இல்லை."

    # -------------------------
    # GUJARATI
    # -------------------------
    elif language == "gu-IN":
        if intent == "temperature":
            return f"{name} નું તાપમાન {tank['temperature']}°C છે."
        elif intent == "oxygen":
            return f"{name} માં ઓક્સિજનનું સ્તર {tank['oxygen']} mg/L છે."
        elif intent == "ph":
            return f"{name} નું pH સ્તર {tank['ph']} છે."
        elif intent == "biomass":
            return f"{name} નો બાયોમાસ {tank['biomass']} kg છે."
        elif intent == "status":
            return f"{name} ની સ્થિતિ {tank['status']} છે."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"હા, {name} માટે એક ચેતવણી છે. "
                    f"એમોનિયાનું સ્તર {tank['ammonia']} ppm છે, "
                    f"જે અસુરક્ષિત છે અને તાત્કાલિક ધ્યાનની જરૂર છે."
                )
            return "તમારી ટાંકીઓમાં હાલમાં કોઈ ગંભીર ચેતવણી નથી."

    # -------------------------
    # KANNADA
    # -------------------------
    elif language == "kn-IN":
        if intent == "temperature":
            return f"{name} ತಾಪಮಾನ {tank['temperature']}°C ಇದೆ."
        elif intent == "oxygen":
            return f"{name} ನಲ್ಲಿ ಆಮ್ಲಜನಕದ ಮಟ್ಟ {tank['oxygen']} mg/L ಇದೆ."
        elif intent == "ph":
            return f"{name} pH ಮಟ್ಟ {tank['ph']} ಇದೆ."
        elif intent == "biomass":
            return f"{name} ಬಯೋಮಾಸ್ {tank['biomass']} kg ಇದೆ."
        elif intent == "status":
            return f"{name} ಸ್ಥಿತಿ {tank['status']} ಇದೆ."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"ಹೌದು, {name} ಗೆ ಒಂದು ಎಚ್ಚರಿಕೆ ಇದೆ. "
                    f"ಅಮೋನಿಯಾ ಮಟ್ಟ {tank['ammonia']} ppm ಇದೆ, "
                    f"ಇದು ಅಸುರಕ್ಷಿತವಾಗಿದ್ದು ತಕ್ಷಣ ಗಮನ ಅಗತ್ಯವಿದೆ."
                )
            return "ನಿಮ್ಮ ಟ್ಯಾಂಕ್‌ಗಳಲ್ಲಿ ಪ್ರಸ್ತುತ ಯಾವುದೇ ಗಂಭೀರ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ."

    # -------------------------
    # MALAYALAM
    # -------------------------
    elif language == "ml-IN":
        if intent == "temperature":
            return f"{name} ലെ താപനില {tank['temperature']}°C ആണ്."
        elif intent == "oxygen":
            return f"{name} ലെ ഓക്സിജന്റെ അളവ് {tank['oxygen']} mg/L ആണ്."
        elif intent == "ph":
            return f"{name} ലെ pH നില {tank['ph']} ആണ്."
        elif intent == "biomass":
            return f"{name} ലെ ബയോമാസ് {tank['biomass']} kg ആണ്."
        elif intent == "status":
            return f"{name} ന്റെ നില {tank['status']} ആണ്."
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"അതെ, {name} ന് ഒരു മുന്നറിയിപ്പുണ്ട്. "
                    f"അമോണിയയുടെ അളവ് {tank['ammonia']} ppm ആണ്, "
                    f"ഇത് സുരക്ഷിതമല്ലാത്ത നിലയാണ്, അടിയന്തര ശ്രദ്ധ ആവശ്യമാണ്."
                )
            return "നിങ്ങളുടെ ടാങ്കുകളിൽ നിലവിൽ ഗുരുതരമായ മുന്നറിയിപ്പുകളൊന്നുമില്ല."

    # -------------------------
    # PUNJABI
    # -------------------------
    elif language == "pa-IN":
        if intent == "temperature":
            return f"{name} ਦਾ ਤਾਪਮਾਨ {tank['temperature']}°C ਹੈ।"
        elif intent == "oxygen":
            return f"{name} ਵਿੱਚ ਆਕਸੀਜਨ ਦਾ ਪੱਧਰ {tank['oxygen']} mg/L ਹੈ।"
        elif intent == "ph":
            return f"{name} ਦਾ pH ਪੱਧਰ {tank['ph']} ਹੈ।"
        elif intent == "biomass":
            return f"{name} ਦਾ ਬਾਇਓਮਾਸ {tank['biomass']} kg ਹੈ।"
        elif intent == "status":
            return f"{name} ਦੀ ਸਥਿਤੀ {tank['status']} ਹੈ।"
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"ਹਾਂ, {name} ਲਈ ਇੱਕ ਚੇਤਾਵਨੀ ਹੈ। "
                    f"ਅਮੋਨੀਆ ਦਾ ਪੱਧਰ {tank['ammonia']} ppm ਹੈ, "
                    f"ਜੋ ਅਸੁਰੱਖਿਅਤ ਹੈ ਅਤੇ ਤੁਰੰਤ ਧਿਆਨ ਦੀ ਲੋੜ ਹੈ।"
                )
            return "ਤੁਹਾਡੇ ਟੈਂਕਾਂ ਵਿੱਚ ਇਸ ਸਮੇਂ ਕੋਈ ਗੰਭੀਰ ਚੇਤਾਵਨੀ ਨਹੀਂ ਹੈ।"

    # -------------------------
    # ODIA
    # -------------------------
    elif language == "or-IN":
        if intent == "temperature":
            return f"{name} ର ତାପମାତ୍ରା {tank['temperature']}°C ଅଟେ।"
        elif intent == "oxygen":
            return f"{name} ରେ ଅମ୍ଳଜାନର ସ୍ତର {tank['oxygen']} mg/L ଅଟେ।"
        elif intent == "ph":
            return f"{name} ର pH ସ୍ତର {tank['ph']} ଅଟେ।"
        elif intent == "biomass":
            return f"{name} ର ବାୟୋମାସ୍ {tank['biomass']} kg ଅଟେ।"
        elif intent == "status":
            return f"{name} ର ସ୍ଥିତି {tank['status']} ଅଟେ।"
        elif intent == "alert":
            if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5:
                return (
                    f"ହଁ, {name} ପାଇଁ ଏକ ସତର୍କତା ଅଛି। "
                    f"ଆମୋନିଆର ସ୍ତର {tank['ammonia']} ppm ଅଟେ, "
                    f"ଯାହା ଅସୁରକ୍ଷିତ ଏବଂ ତୁରନ୍ତ ଧ୍ୟାନ ଆବଶ୍ୟକ।"
                )
            return "ଆପଣଙ୍କ ଟ୍ୟାଙ୍କଗୁଡ଼ିକରେ ବର୍ତ୍ତମାନ କୌଣସି ଗୁରୁତର ସତର୍କତା ନାହିଁ।"

    # Unsupported language / intent
    return None
# -----------------------------
# VOICE QUERY API
# -----------------------------

@app.post("/api/voice-query")
def voice_query(data: VoiceQuery):

    query = data.query.lower().strip()

    # ---------------------------------
    # MULTILINGUAL INTENT DETECTION
    # ---------------------------------

    intent = None

    # Temperature
    temperature_words = [
        # English
        "temperature", "temp",

        # Hindi
        "तापमान", "टेम्परेचर", "टेंपरेचर",

        # Bengali
        "তাপমাত্রা",

        # Telugu
        "ఉష్ణోగ్రత",

        # Marathi
        "तापमान",

        # Tamil
        "வெப்பநிலை",

        # Gujarati
        "તાપમાન",

        # Kannada
        "ತಾಪಮಾನ",

        # Malayalam
        "താപനില",

        # Punjabi
        "ਤਾਪਮਾਨ",

        # Odia
        "ତାପମାତ୍ରା"
    ]

    # Oxygen
    oxygen_words = [
        # English
        "oxygen",

        # Hindi
        "ऑक्सीजन", "आक्सीजन",

        # Bengali
        "অক্সিজেন",

        # Telugu
        "ఆక్సిజన్",

        # Marathi
        "ऑक्सिजन",

        # Tamil
        "ஆக்சிஜன்",

        # Gujarati
        "ઓક્સિજન",

        # Kannada
        "ಆಮ್ಲಜನಕ",

        # Malayalam
        "ഓക്സിജൻ",

        # Punjabi
        "ਆਕਸੀਜਨ",

        # Odia
        "ଅମ୍ଳଜାନ"
    ]

    # pH
    ph_words = [
        "ph", "pH", "पीएच", "पी एच",
        "পিএইচ",
        "పిహెచ్",
        "पीएच",
        "pH"
    ]

    # Biomass
    biomass_words = [
        # English
        "biomass",

        # Hindi
        "बायोमास",

        # Bengali
        "বায়োমাস",

        # Telugu
        "బయోమాస్",

        # Marathi
        "बायोमास",

        # Tamil
        "பயோமாஸ்",

        # Gujarati
        "બાયોમાસ",

        # Kannada
        "ಬಯೋಮಾಸ್",

        # Malayalam
        "ബയോമാസ്",

        # Punjabi
        "ਬਾਇਓਮਾਸ",

        # Odia
        "ବାୟୋମାସ"
    ]
        # Alerts
    alert_words = [
        "alert", "alerts", "warning", "warnings",
        "problem", "problems", "risk",
        "अलर्ट", "अलर्ट्स", "चेतावनी", "समस्या",
        "স্টেটাস সতর্ক", "সতর্কতা",
        "హెచ్చరిక", "హెచ్చరికలు",
        "எச்சரிக்கை",
        "ચેતવણી",
        "ಎಚ್ಚರಿಕೆ",
        "മുന്നറിയിപ്പ്",
        "ਚੇਤਾਵਨੀ",
        "ଚେତାବନୀ"
    ]

    # Status / Condition
    status_words = [
        # English
        "status", "condition", "health",

        # Hindi
        "स्टेटस", "स्थिति", "हाल", "हालत", "स्थिति क्या है",

        # Bengali
        "স্টেটাস", "অবস্থা", "পরিস্থিতি",

        # Telugu
        "స్టేటస్", "స్థితి", "పరిస్థితి",

        # Marathi
        "स्टेटस", "स्थिती", "अवस्था",

        # Tamil
        "நிலை", "ஸ்டேட்டஸ்",

        # Gujarati
        "સ્થિતિ", "સ્ટેટસ",

        # Kannada
        "ಸ್ಥಿತಿ", "ಸ್ಟೇಟಸ್",

        # Malayalam
        "നില", "സ്റ്റാറ്റസ്",

        # Punjabi
        "ਸਥਿਤੀ", "ਸਟੇਟਸ",

        # Odia
        "ସ୍ଥିତି", "ଷ୍ଟାଟସ"
    ]
        # Alerts
    alert_words = [
        # English
        "alert", "alerts", "warning", "warnings",
        "problem", "problems", "risk",

        # Hindi
        "अलर्ट", "अलर्ट्स", "चेतावनी", "समस्या",

        # Bengali
        "সতর্কতা", "সতর্ক",

        # Telugu
        "హెచ్చరిక", "హెచ్చరికలు",

        # Marathi
        "इशारा", "चेतावणी",

        # Tamil
        "எச்சரிக்கை",

        # Gujarati
        "ચેતવણી",

        # Kannada
        "ಎಚ್ಚರಿಕೆ",

        # Malayalam
        "മുന്നറിയിപ്പ്",

        # Punjabi
        "ਚੇਤਾਵਨੀ",

        # Odia
        "ଚେତାବନୀ"
    ]

       # Detect intent
    if any(word in query for word in temperature_words):
        intent = "temperature"
    elif any(word in query for word in oxygen_words):
        intent = "oxygen"
    elif any(word in query for word in ph_words):
        intent = "ph"
    elif any(word in query for word in biomass_words):
        intent = "biomass"
    elif any(word in query for word in status_words):
        intent = "status"
    elif any(word in query for word in alert_words):
        intent = "alert"

    # ---------------------------------
    # GET REAL TANK DATA
    # ---------------------------------

    response = supabase.table("tanks").select("*").execute()

    tanks = response.data

    if not tanks:

        answer = "No tank data is currently available."

    else:

        # Default to Tank 1
        selected_tank = tanks[0]

        # Detect tank number/name
        for tank in tanks:

            tank_name = tank["name"].lower()

            if tank_name in query:
                selected_tank = tank
                break


        # ---------------------------------
        # GENERATE ANSWER FROM REAL DATA
        # ---------------------------------

        if intent == "temperature":

            answer = (
                f"The temperature of {selected_tank['name']} "
                f"is {selected_tank['temperature']}°C."
            )

        elif intent == "oxygen":

            answer = (
                f"The oxygen level of {selected_tank['name']} "
                f"is {selected_tank['oxygen']} mg/L."
            )

        elif intent == "ph":

            answer = (
                f"The pH level of {selected_tank['name']} "
                f"is {selected_tank['ph']}."
            )

        elif intent == "biomass":

            answer = (
                f"The biomass of {selected_tank['name']} "
                f"is {selected_tank['biomass']} kg."
            )

        elif intent == "status":
            answer = (
                f"{selected_tank['name']} currently has "
                f"{selected_tank['status']} status."
            )

        elif intent == "alert":
            critical_tanks = [
                tank for tank in tanks
                if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5
            ]

            if critical_tanks:
                tank = critical_tanks[0]
                answer = (
                    f"Yes, there is an alert for {tank['name']}. "
                    f"Ammonia is {tank['ammonia']} ppm, "
                    f"which is at an unsafe level and requires attention."
                )
            else:
                answer = "There are currently no critical alerts for your tanks."

        else:
            answer = "Sorry, I could not understand your question."
    # ---------------------------------
    # SAVE VOICE HISTORY
    # ---------------------------------
    # ---------------------------------
    # LOCALIZE ANSWER
    # ---------------------------------

    localized_answer = localize_answer(
        intent,
        selected_tank,
        data.language
    )

    if localized_answer:
        answer = localized_answer
    history_data = {
        "query": data.query,
        "answer": answer
    }

    supabase.table("voice_history").insert(history_data).execute()


    # ---------------------------------
    # RETURN ANSWER
    # ---------------------------------

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
@app.get("/api/ai-alert")
def ai_alert():

    response = supabase.table("tanks").select("*").execute()
    tanks = response.data

    critical_tanks = [
        tank for tank in tanks
        if tank.get("ammonia") is not None and tank["ammonia"] >= 0.5
    ]

    if critical_tanks:
        tank = critical_tanks[0]

        return {
            "has_alert": True,
            "tank_name": tank["name"],
            "message": "Ammonia is at an unsafe level and needs immediate attention.",
            "prediction": "High ammonia risk"
        }

    return {
        "has_alert": False,
        "tank_name": None,
        "message": "All tanks are currently within safe ammonia levels.",
        "prediction": "No immediate risk"
    }