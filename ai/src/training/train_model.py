# ai/src/training/train_model.py
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import pickle

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
LABELS_CSV = os.path.join(ROOT_DIR, "ai", "data", "dataset", "labels.csv")
MODELS_DIR = os.path.join(ROOT_DIR, "ai", "models")

def train():
    print("[INFO] Cargando dataset...")
    df = pd.read_csv(LABELS_CSV)
    print(f"[INFO] Total filas: {len(df)}")

    # Columnas de keypoints
    kp_cols = [c for c in df.columns if c.startswith("kp")]

    # Filtrar frames sin keypoints (todos 0.0)
    df_valid = df[df[kp_cols].sum(axis=1) != 0].copy()
    print(f"[INFO] Frames válidos: {len(df_valid)} ({len(df) - len(df_valid)} descartados)")

    # Encodear poomsae como número
    le = LabelEncoder()
    df_valid["poomsae_enc"] = le.fit_transform(df_valid["poomsae"])

    # Features: keypoints + poomsae_enc
    X = df_valid[kp_cols + ["poomsae_enc"]].values
    y = df_valid["score"].values

    print(f"[INFO] Features shape: {X.shape}")
    print(f"[INFO] Poomsaes: {list(le.classes_)}")
    print(f"[INFO] Score range: {y.min():.2f} - {y.max():.2f}")

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"[INFO] Train: {len(X_train)} | Test: {len(X_test)}")

    # Entrenar modelo
    print("[INFO] Entrenando modelo...")
    model = GradientBoostingRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluar
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"\n✅ MAE: {mae:.4f}")
    print(f"✅ R2:  {r2:.4f}")

    # Guardar modelo y encoder
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, "poomsae_scorer.pkl")
    encoder_path = os.path.join(MODELS_DIR, "label_encoder.pkl")

    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    with open(encoder_path, "wb") as f:
        pickle.dump(le, f)

    print(f"\n✅ Modelo guardado: {model_path}")
    print(f"✅ Encoder guardado: {encoder_path}")

if __name__ == "__main__":
    train()