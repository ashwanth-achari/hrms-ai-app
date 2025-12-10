# extractor.py
import io
import re
from typing import List, Optional, Tuple

import pdfplumber


# Very basic skill dictionary – extend as needed
SKILL_KEYWORDS = {
    "python", "java", "javascript", "react", "node.js", "django", "flask",
    "fastapi", "sql", "mysql", "postgresql", "mongodb",
    "machine learning", "deep learning", "nlp", "data analysis",
    "docker", "kubernetes", "git", "aws", "azure", "gcp",
}


EMAIL_REGEX = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PHONE_REGEX = re.compile(
    r"(\+?\d[\d\s\-]{7,}\d)"  # Very loose; tune per region
)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        pages_text = [page.extract_text() or "" for page in pdf.pages]
    return "\n".join(pages_text)


def extract_email(text: str) -> Optional[str]:
    match = EMAIL_REGEX.search(text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    match = PHONE_REGEX.search(text)
    if not match:
        return None
    phone = match.group(0)
    # Normalize spaces
    phone = re.sub(r"\s+", " ", phone).strip()
    return phone


def guess_name(text: str, email: Optional[str]) -> Optional[str]:
    # Heuristic 1: first non-empty line, before words like "Resume", "Curriculum Vitae"
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if not lines:
        return None

    # Filter out typical headings
    heading_blacklist = {"resume", "curriculum vitae", "cv"}
    candidate_line = None
    for line in lines[:5]:
        lower = line.lower()
        if lower in heading_blacklist:
            continue
        candidate_line = line
        break

    # Fallback to email username
    if not candidate_line and email:
        name_part = email.split("@")[0]
        # Replace separators, capitalize
        name_part = re.sub(r"[._\-]", " ", name_part)
        return " ".join(part.capitalize() for part in name_part.split())

    return candidate_line


def extract_skills(text: str) -> List[str]:
    lower_text = text.lower()
    skills_found = set()
    for skill in SKILL_KEYWORDS:
        if skill in lower_text:
            skills_found.add(skill)
    # Return in sorted order for consistency
    return sorted(skills_found)


def estimate_experience_years(text: str) -> Optional[float]:
    """
    Super rough heuristic:
    - Look for patterns like '2018 - 2022', 'Jan 2020 – Present'
    - Count distinct years and approximate.
    For v1 we’ll keep it very simple.
    """
    years = re.findall(r"(20[0-4][0-9])", text)  # 2000–2049
    if not years:
        return None

    years_int = sorted(set(int(y) for y in years))
    if len(years_int) < 2:
        return None

    est_years = years_int[-1] - years_int[0]
    if est_years <= 0:
        return None

    return float(est_years)


def extract_education_lines(text: str, max_lines: int = 10) -> List[str]:
    """
    Naive approach:
    - Scan for lines containing keywords like 'B.Tech', 'BSc', 'MCA', 'BE', 'Bachelor', 'Master'.
    """
    edu_keywords = ["b.tech", "btech", "b.e", "be ", "b.sc", "bsc",
                    "m.tech", "mtech", "mca", "bca",
                    "bachelor", "master", "degree", "university", "college"]
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    edu_lines = []
    for line in lines:
        lower = line.lower()
        if any(k in lower for k in edu_keywords):
            edu_lines.append(line)
        if len(edu_lines) >= max_lines:
            break
    return edu_lines


def extract_resume_fields(file_bytes: bytes) -> dict:
    text = extract_text_from_pdf(file_bytes)
    email = extract_email(text)
    phone = extract_phone(text)
    name = guess_name(text, email)
    skills = extract_skills(text)
    exp_years = estimate_experience_years(text)
    edu_lines = extract_education_lines(text)

    return {
        "full_name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "total_experience_years": exp_years,
        "education": [{"line": l} for l in edu_lines],
        "raw_text": text,
    }
