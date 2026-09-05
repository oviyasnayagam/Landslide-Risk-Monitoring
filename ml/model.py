import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("data/landslide_data.csv")

# Convert text columns into numbers
soil_encoder = LabelEncoder()
vegetation_encoder = LabelEncoder()

data["soil"] = soil_encoder.fit_transform(data["soil"])
data["vegetation"] = vegetation_encoder.fit_transform(data["vegetation"])

# Input features
X = data[[
    "rainfall",
    "slope",
    "elevation",
    "soil",
    "vegetation"
]]

# Target
y = data["landslide"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create Random Forest model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Test
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model trained successfully!")
print("Accuracy:", accuracy)

# Save model
joblib.dump(model, "ml/landslide_model.pkl")

print("Model saved successfully!")