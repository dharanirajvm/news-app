import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# load .env from repo root (adjust if your .env lives elsewhere)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
if not FIREBASE_KEY_PATH:
    print("FIREBASE_KEY_PATH not set in environment")
    raise RuntimeError("FIREBASE_KEY_PATH not set in environment (.env not loaded?)")

# make FIREBASE_KEY_PATH absolute if it's relative to this file
if not os.path.isabs(FIREBASE_KEY_PATH):
    FIREBASE_KEY_PATH = os.path.normpath(os.path.join(os.path.dirname(__file__), FIREBASE_KEY_PATH))

if not os.path.exists(FIREBASE_KEY_PATH):
    raise FileNotFoundError(f"Firebase key not found at: {FIREBASE_KEY_PATH}")

cred = credentials.Certificate(FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()