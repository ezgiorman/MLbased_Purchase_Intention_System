import pickle
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from xgboost import XGBClassifier

PKL_PATH = "purchase_xgb_complete.pkl"   # dosya adın farklıysa değiştir

app = FastAPI(title="Purchase Intention Prediction API")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# ---- Load model bundle ----
with open(PKL_PATH, "rb") as f:
    saved = pickle.load(f)

model = saved["model"]
scaler = saved.get("scaler", None)
train_cols = saved["columns"]
dummies_cols = saved.get("dummies_cols", ["Month", "VisitorType"])
drop_first = saved.get("drop_first", True)


# ---- Request schema (ham feature'lar) ----
class PurchaseFeatures(BaseModel):
    Administrative: int
    Administrative_Duration: float
    Informational: int
    Informational_Duration: float
    ProductRelated: int
    ProductRelated_Duration: float
    BounceRates: float
    ExitRates: float
    PageValues: float
    SpecialDay: float
    Month: str
    OperatingSystems: int
    Browser: int
    Region: int
    TrafficType: int
    VisitorType: str
    Weekend: bool


def preprocess_one(features: PurchaseFeatures):
    df = pd.DataFrame([features.model_dump()])

    # 1) One-hot encoding (train ile aynı şekilde)
    df = pd.get_dummies(df, columns=dummies_cols, drop_first=drop_first)

    # 2) Kolon hizalama (train kolonlarıyla birebir aynı)
    df = df.reindex(columns=train_cols, fill_value=0)

    # 3) bool -> int (güvenli)
    bool_cols = df.select_dtypes(include="bool").columns
    df[bool_cols] = df[bool_cols].astype(int)

    # 4) Scaling (sen scaling ile eğittiğin için şart)
    if scaler is not None:
        X_ready = scaler.transform(df)
    else:
        X_ready = df.values

    return X_ready


@app.get("/")
def health():
    return {"status": "ok", "message": "Purchase Intention Model API is running."}


@app.post("/predict")
def predict(features: PurchaseFeatures):
    X_ready = preprocess_one(features)

    # satın alma olasılığı (Revenue=1)
    proba = float(model.predict_proba(X_ready)[0][1])
    pred = int(proba >= 0.5)

    return {
        "purchase_probability": proba,
        "predicted_label": pred
    }


@app.get("/admin", response_class=HTMLResponse)
@app.get("/dashboard", response_class=HTMLResponse)
@app.get("/realtime", response_class=HTMLResponse)
@app.get("/analytics", response_class=HTMLResponse)
def unified_page(request: Request):
    return templates.TemplateResponse("unified.html", {"request": request})


@app.get("/page/dashboard", response_class=HTMLResponse)
def page_dashboard(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/page/realtime", response_class=HTMLResponse)
def page_realtime(request: Request):
    return templates.TemplateResponse("realtime.html", {"request": request})


@app.get("/page/analytics", response_class=HTMLResponse)
def page_analytics(request: Request):
    return templates.TemplateResponse("analytics.html", {"request": request})