// ===============================
// INITIALIZE MAP
// ===============================

const map = L.map("map").setView([11.05, 76.99], 9);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ===============================
// SAMPLE MONITORING LOCATIONS
// ===============================
// ===============================
// SAMPLE MONITORING LOCATIONS
// ===============================

const locations = [
    [11.01, 76.95, "HIGH"],
    [11.03, 76.97, "CRITICAL"],
    [11.05, 76.99, "MODERATE"],
    [11.08, 77.02, "LOW"],
    [11.10, 77.04, "HIGH"]
];

function getRiskColor(risk) {

    if (risk === "LOW") {
        return "green";
    }

    if (risk === "MODERATE") {
        return "orange";
    }

    if (risk === "HIGH") {
        return "red";
    }

    return "darkred";
}


locations.forEach(location => {

    const color = getRiskColor(location[2]);

    L.circleMarker(
        [location[0], location[1]],
        {
            radius: 9,
            color: color,
            fillColor: color,
            fillOpacity: 0.8
        }
    )
    .addTo(map)
    .bindPopup(
        `<b>Landslide Monitoring Point</b><br>
         Risk Level: <b>${location[2]}</b>`
    );

});



// ===============================
// AI PREDICTION
// ===============================

async function predictRisk() {

    const rainfall =
        document.getElementById("rainfall").value;

    const slope =
        document.getElementById("slope").value;

    const elevation =
        document.getElementById("elevation").value;

    const soil =
        document.getElementById("soil").value;

    const vegetation =
        document.getElementById("vegetation").value;


    // Validate inputs

    if (
        rainfall === "" ||
        slope === "" ||
        elevation === "" ||
        soil === "" ||
        vegetation === ""
    ) {
        alert("Please enter all environmental parameters.");
        return;
    }


    // Create API URL

    const url =
        `http://127.0.0.1:8000/predict?` +
        `rainfall=${rainfall}` +
        `&slope=${slope}` +
        `&elevation=${elevation}` +
        `&soil=${soil}` +
        `&vegetation=${vegetation}`;


    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();


        // Display probability

        document.getElementById("probability").innerText =
            data.landslide_probability + "%";


        // Display risk

        document.getElementById("risk").innerText =
            data.risk_level;

        document.getElementById("dashboardRisk").innerText =
            data.risk_level;


        // Alert message

        const alertTitle =
            document.getElementById("alertTitle");

        const alertMessage =
            document.getElementById("alertMessage");


        if (data.risk_level === "LOW") {

            alertTitle.innerText =
                "Low Risk – Situation Stable";

            alertMessage.innerText =
                "Current environmental conditions indicate a low probability of landslide activity.";

        }

        else if (data.risk_level === "MODERATE") {

            alertTitle.innerText =
                "Moderate Risk – Monitor Conditions";

            alertMessage.innerText =
                "Environmental conditions require continued monitoring.";

        }

        else if (data.risk_level === "HIGH") {

            alertTitle.innerText =
                "High Risk – Early Warning";

            alertMessage.innerText =
                "Landslide probability is elevated. Authorities should monitor the region closely.";

        }

        else {

            alertTitle.innerText =
                "CRITICAL RISK – IMMEDIATE ATTENTION";

            alertMessage.innerText =
                "Environmental conditions indicate a critical landslide risk. Immediate assessment is recommended.";

        }

    }

    catch (error) {

        console.error(error);

        document.getElementById("risk").innerText =
            "SERVER ERROR";

        document.getElementById("alertTitle").innerText =
            "Unable to connect to AI service";

        document.getElementById("alertMessage").innerText =
            "Please make sure the FastAPI backend is running.";

    }
}