from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, travel

app = FastAPI(title="ItineraAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(travel.router)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "ItineraAI API running ✈️"}
