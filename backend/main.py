from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("ml/landslide_model.pkl")


@app.get("/")
def home():
    return {"message": "Landslide Risk Monitoring API is running"}


@app.get("/predict")
def predict(
    rainfall: float,
    slope: float,
    elevation: float,
    soil: str,
    vegetation: str
):

    # Convert soil text to numbers
    soil_mapping = {
        "clay": 0,
        "loam": 1,
        "sand": 2
    }

    # Convert vegetation text to numbers
    vegetation_mapping = {
        "high": 0,
        "low": 1,
        "medium": 2
    }

    soil_value = soil_mapping[soil.lower()]
    vegetation_value = vegetation_mapping[vegetation.lower()]

    # Prepare input
    input_data = [[
        rainfall,
        slope,
        elevation,
        soil_value,
        vegetation_value
    ]]

    # Prediction probability
    probability = model.predict_proba(input_data)[0][1] * 100

    # Risk level
    if probability < 30:
        risk = "LOW"
    elif probability < 60:
        risk = "MODERATE"
    elif probability < 80:
        risk = "HIGH"
    else:
        risk = "CRITICAL"

    return {
        "landslide_probability": round(probability, 2),
        "risk_level": risk
    }