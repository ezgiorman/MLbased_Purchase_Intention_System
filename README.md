<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.119-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/XGBoost-3.2-FF6600?style=for-the-badge&logo=xgboost&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<h1 align="center">🛒 PurchasePredict – Intelligence Suite</h1>

<p align="center">
  <strong>An ML-powered real-time analytics dashboard that predicts<br>online purchase intention from e-commerce session data.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-usage">API Usage</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📌 About

**PurchasePredict** is an end-to-end machine learning application that predicts **whether an e-commerce visitor will make a purchase** using an **XGBoost** classifier trained on the [UCI Online Shoppers Purchasing Intention](https://archive.ics.uci.edu/ml/datasets/Online+Shoppers+Purchasing+Intention+Dataset) dataset.

User session data (page visit counts, duration, bounce rate, exit rate, page value, visitor type, etc.) is fed into the model, and a real-time **purchase probability** is returned.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Overview Dashboard** | Conversion rate, daily active sessions, average purchase probability, and monthly trend charts |
| ⚡ **Real-Time Prediction** | Instant purchase prediction and probability score via live session data input |
| 📈 **Analytics & Cohort Report** | Feature importance, monthly conversion trends, cohort heatmap, traffic source analysis |
| 🔮 **Single Prediction Form** | Detailed prediction using 17 different features |
| 🧪 **A/B Test View** | Bounce vs Exit rate comparison, segment-based behavioral metrics |
| 📱 **Responsive Design** | Mobile and desktop compatible with a modern glassmorphism interface |
| 🟢 **REST API** | Programmatic access via FastAPI-based `/predict` endpoint |

---

## 📸 Screenshots

### 📊 Overview – Dashboard
> Conversion rate, active sessions, sparkline charts, and monthly trend analysis.

![Dashboard](screenshots/dashboard.png)

---

### ⚡ Real-Time Prediction
> Recently scored sessions table and single prediction form for instant ML predictions.

![Realtime](screenshots/realtime.png)

---

### 📈 Analytics & Cohort Report
> Feature importance, most influential variables, segment breakdowns, and cohort analysis.

![Analytics](screenshots/analytics.png)

---

## 🛠 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** – High-performance async Python web framework
- **[XGBoost](https://xgboost.readthedocs.io/)** – Gradient boosting-based ML classifier
- **[scikit-learn](https://scikit-learn.org/)** – Data preprocessing and feature scaling
- **[Pandas](https://pandas.pydata.org/)** – Data manipulation and one-hot encoding
- **[Pydantic](https://docs.pydantic.dev/)** – Request/Response data validation

### Frontend
- **HTML5 / CSS3 / JavaScript** – Custom-built modern UI from scratch
- **[Chart.js](https://www.chartjs.org/)** – Interactive charts and data visualization
- **[Inter Font](https://fonts.google.com/specimen/Inter)** – Premium typography

### DevOps
- **[Uvicorn](https://www.uvicorn.org/)** – ASGI server
- **[Render](https://render.com/)** – Cloud deployment

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ezgiorman/MLbased_Purchase_Intention_System.git
cd MLbased_Purchase_Intention_System

# 2. Create a virtual environment (optional but recommended)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
uvicorn app:app --reload
```

Open your browser and navigate to **http://127.0.0.1:8000** 🎉

---

## 📡 API Usage

### `POST /predict`

Send session data to get a purchase prediction.

**Request Body:**

```json
{
  "Administrative": 3,
  "Administrative_Duration": 80.0,
  "Informational": 2,
  "Informational_Duration": 45.0,
  "ProductRelated": 30,
  "ProductRelated_Duration": 600.0,
  "BounceRates": 0.02,
  "ExitRates": 0.05,
  "PageValues": 10.0,
  "SpecialDay": 0.0,
  "Month": "Nov",
  "OperatingSystems": 2,
  "Browser": 2,
  "Region": 1,
  "TrafficType": 2,
  "VisitorType": "Returning_Visitor",
  "Weekend": false
}
```

**Response:**

```json
{
  "purchase_probability": 0.8734,
  "predicted_label": 1
}
```

| Field | Description |
|-------|-------------|
| `purchase_probability` | Purchase probability (between 0 and 1) |
| `predicted_label` | Prediction result: `1` = Will purchase, `0` = Will not purchase |

### cURL Example

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Administrative": 3,
    "Administrative_Duration": 80.0,
    "Informational": 2,
    "Informational_Duration": 45.0,
    "ProductRelated": 30,
    "ProductRelated_Duration": 600.0,
    "BounceRates": 0.02,
    "ExitRates": 0.05,
    "PageValues": 10.0,
    "SpecialDay": 0.0,
    "Month": "Nov",
    "OperatingSystems": 2,
    "Browser": 2,
    "Region": 1,
    "TrafficType": 2,
    "VisitorType": "Returning_Visitor",
    "Weekend": false
  }'
```

> 💡 **Tip:** Visit **http://127.0.0.1:8000/docs** for the auto-generated FastAPI Swagger documentation.

---

## 📂 Project Structure

```
PurchasePrediction/
├── app.py                        # FastAPI application & API endpoints
├── model_tests.py                # Model validation and test script
├── purchase_xgb_complete.pkl     # Trained XGBoost model file
├── requirements.txt              # Python dependencies
├── Procfile                      # Render deployment command
├── .gitignore
│
├── templates/
│   ├── unified.html              # Main layout (sidebar + iframe navigation)
│   ├── index.html                # Dashboard page (charts & metrics)
│   ├── realtime.html             # Real-time prediction page
│   └── analytics.html            # Analytics & cohort report page
│
├── static/
│   └── realtime.js               # Real-time prediction JS logic
│
└── screenshots/                  # README images
    ├── dashboard.png
    ├── realtime.png
    └── analytics.png
```

---

## 🧠 Model Details

| Property | Value |
|----------|-------|
| **Algorithm** | XGBoost Classifier |
| **Dataset** | UCI Online Shoppers Purchasing Intention |
| **Number of Features** | 17 (raw) → expands after one-hot encoding |
| **Preprocessing** | One-hot encoding + StandardScaler |
| **Target Variable** | `Revenue` (purchase: 1 / no purchase: 0) |

### Input Features

| Feature | Type | Description |
|---------|------|-------------|
| `Administrative` | int | Number of administrative pages visited |
| `Administrative_Duration` | float | Time spent on administrative pages (sec) |
| `Informational` | int | Number of informational pages visited |
| `Informational_Duration` | float | Time spent on informational pages (sec) |
| `ProductRelated` | int | Number of product-related pages visited |
| `ProductRelated_Duration` | float | Time spent on product-related pages (sec) |
| `BounceRates` | float | Single-page visit rate |
| `ExitRates` | float | Page exit rate |
| `PageValues` | float | Average page value |
| `SpecialDay` | float | Proximity to a special day (0–1) |
| `Month` | str | Month of the visit |
| `OperatingSystems` | int | Operating system code |
| `Browser` | int | Browser code |
| `Region` | int | Region code |
| `TrafficType` | int | Traffic source code |
| `VisitorType` | str | Visitor type (Returning / New / Other) |
| `Weekend` | bool | Whether the visit is on a weekend |

---

## ☁️ Deployment

The project is configured for deployment on **Render.com**.

### Render Settings

| Setting | Value |
|---------|-------|
| **Environment** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app:app --host 0.0.0.0 --port $PORT` |

### Manual Deployment

```bash
# Create a new Web Service on Render.com
# Connect your GitHub repository
# Set the Build and Start commands as shown above
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⭐ If you found this project useful, don't forget to give it a star!</strong>
</p>
