from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.api.v1.router import api_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="OpenAI Agents Dashboard API",
    description="API for the OpenAI Agents Dashboard",
    version="0.1.0",
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", '["http://localhost:5173"]')
if isinstance(origins, str):
    import json
    origins = json.loads(origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the OpenAI Agents Dashboard API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}