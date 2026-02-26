# PurchasePredict – Intelligence Suite

E-ticaret oturum verilerinden satın alma niyeti tahmini yapan ML destekli analiz paneli.

## Teknolojiler
- **Backend**: FastAPI + XGBoost
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Model**: XGBoost Classifier (eğitilmiş .pkl dosyası)

## Kurulum

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

## Deployment
Render.com üzerinde deploy edilmek için hazırlanmıştır.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
