import pickle
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


PKL_PATH = "purchase_xgb_complete.pkl"   # dosya adın farklıysa değiştir
TEST_RAW_CSV = "test_raw.csv"            # Kaggle'dan indirdiğin Revenue'suz ham dosya


def load_bundle(pkl_path: str):
    with open(pkl_path, "rb") as f:
        saved = pickle.load(f)

    model = saved["model"]
    scaler = saved.get("scaler", None)
    train_cols = saved["columns"]

    # pd.get_dummies için metadata (varsa)
    dummies_cols = saved.get("dummies_cols", ["Month", "VisitorType"])
    drop_first = saved.get("drop_first", True)

    return model, scaler, train_cols, dummies_cols, drop_first


def preprocess(df_raw: pd.DataFrame, train_cols, dummies_cols, drop_first, scaler=None):
    # Eğer yanlışlıkla Revenue geldiyse
    if "Revenue" in df_raw.columns:
        df_raw = df_raw.drop(columns=["Revenue"])

    # 1) One-hot
    X = pd.get_dummies(df_raw, columns=dummies_cols, drop_first=drop_first)

    # 2) Kolon hizalama (EN ÖNEMLİ)
    X = X.reindex(columns=train_cols, fill_value=0)

    # 3) bool -> int (güvenli)
    bool_cols = X.select_dtypes(include="bool").columns
    X[bool_cols] = X[bool_cols].astype(int)

    # 4) scale (sen scaling ile eğittiğin için gerekli)
    if scaler is not None:
        X = scaler.transform(X)
    else:
        X = X.values

    return X


def main():
    model, scaler, train_cols, dummies_cols, drop_first = load_bundle(PKL_PATH)

    df_raw = pd.read_csv(TEST_RAW_CSV)

    # Bu dosyada Revenue yok, o yüzden accuracy hesaplanamaz.
    # Ama istersen burada sadece ilk 20 tahmini basarız:
    X_ready = preprocess(df_raw, train_cols, dummies_cols, drop_first, scaler=scaler)

    preds = model.predict(X_ready)
    proba = model.predict_proba(X_ready)[:, 1]

    print("✅ İlk 20 tahmin (0/1):", preds[:20])
    print("✅ İlk 20 satın alma olasılığı:", proba[:20])


if __name__ == "__main__":
    main()