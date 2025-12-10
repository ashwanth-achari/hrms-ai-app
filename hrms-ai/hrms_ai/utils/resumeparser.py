import re
import spacy

nlp = spacy.load("en_core_web_sm")

# --- Expandable Skill Dictionary (case-insensitive) ---
SKILL_SET = {
    "python","java","c","c++","react","angular","node","express","django","flask",
    "ml","machine learning","ai","deep learning","nlp","tensorflow","pytorch",
    "sql","mysql","postgres","mongodb","aws","azure","gcp","docker","kubernetes",
    "git","rest","graphql","html","css","javascript","typescript","flutter","react native"
}

def extract_skills(text: str):
    """
    Detect technical skills from predefined dictionary.
    Matches single words & multi-word skills (ex: 'machine learning').
    """
    text_lower = text.lower()
    skills_found = set()

    # multi-word first
    for skill in [s for s in SKILL_SET if " " in s]:
        if skill in text_lower:
            skills_found.add(skill)

    # single-word skills
    tokens = re.findall(r"[a-zA-Z\+\.]+", text_lower)
    for token in tokens:
        if token in SKILL_SET:
            skills_found.add(token)

    return sorted(skills_found)


def extract_experience(text: str):
    """
    Extract years of experience from statements like:
    - '3 years of experience'
    - '2.5 yrs exp'
    - 'Experience: 4 years'
    - 'Over 6+ years experience'
    """
    text_lower = text.lower()
    patterns = [
        r"(\d+(\.\d+)?)\s*\+?\s*(years|yrs|year|y)",
        r"experience\s*[:\-]?\s*(\d+(\.\d+)?)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            # value might be in group 1 or 2 depending on pattern
            value = match.group(1) if match.group(1) else match.group(2)
            try:
                return float(value)
            except:
                return None

    return None


def extract_summary(text: str):
    """
    Returns the most representative opening summary.
    Uses NLP to extract 2–3 initial sentences that look like an intro/bio.
    """
    doc = nlp(text)
    sentences = list(doc.sents)

    if not sentences:
        return text[:300]

    # If candidate wrote a proper opening paragraph, take first 2 sentences
    if len(sentences) >= 2:
        return (sentences[0].text + " " + sentences[1].text).strip()

    return sentences[0].text.strip()
