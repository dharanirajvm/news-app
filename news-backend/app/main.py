# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import news, users

app = FastAPI(title="News Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production replace with your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
def read_root():
    return {"status": "ok"}
