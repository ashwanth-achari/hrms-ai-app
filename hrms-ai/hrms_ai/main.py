# app.py
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
from .extractor import extract_resume_fields

class EducationItem(BaseModel):
    line: str


class ResumeResponse(BaseModel):
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    skills: List[str]
    total_experience_years: Optional[float]
    education: List[EducationItem]
    raw_text: str

ASSET_DIR = os.path.join(os.path.dirname(__file__), "assets", "resumes")

app = FastAPI(
    title="Resume Parser API",
    description="PDF resume ingestion and structured data extraction",
    version="1.0.0",
)

# Enable CORS for local/frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ocr/extract", response_model=ResumeResponse)
def parse_resume(filename: str = Query(..., description="Name of the resume PDF (e.g., candidate.pdf)")):
    print("Resume parsed:", ASSET_DIR, filename)
    file_path = os.path.join(ASSET_DIR, filename)
    print("Resume parsed:", file_path)

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Filename must end with .pdf")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file not found in assets/resumes folder")

    try:
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        data = extract_resume_fields(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")

    return data
