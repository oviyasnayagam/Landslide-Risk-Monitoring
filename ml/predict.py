import joblib
import pandas as pd

# Load trained model
model = joblib.load("ml/landslide_model.pkl")

# New location data
data = pd.DataFrame([{
    "rainfall": 200,
    "slope": 35,
    "elevation": 500,
    "soil": 0,
    "vegetation": 0
}])

# Predict probability
probability = model.predict_proba(data)[0][1]

# Convert to percentage
risk = probability * 100

print("Landslide Risk:", round(risk, 2), "%")

# Risk level
if risk < 30:
    print("Risk Level: LOW")
elif risk < 60:
    print("Risk Level: MODERATE")
elif risk < 80:
    print("Risk Level: HIGH")
else:
    print("Risk Level: CRITICAL")