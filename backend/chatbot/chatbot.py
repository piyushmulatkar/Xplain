import json
from pathlib import Path

from sentence_transformers import SentenceTransformer, util

CONFIDENCE_THRESHOLD = 0.80


# -----------------------------
# Load Knowledge Base
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "questionaire.json", "r", encoding="utf-8") as f:
    qa_data = json.load(f)

questions = [item["question"] for item in qa_data]


# -----------------------------
# Load Model
# -----------------------------
model = SentenceTransformer("BAAI/bge-base-en-v1.5")

question_embeddings = model.encode(
    questions,
    convert_to_tensor=True,
    normalize_embeddings=True,
)


# -----------------------------
# Search Function
# -----------------------------
def search(query):
    query_embedding = model.encode(
        query,
        convert_to_tensor=True,
        normalize_embeddings=True,
    )

    similarities = util.cos_sim(
        query_embedding,
        question_embeddings,
    )[0]

    best_index = similarities.argmax().item()
    confidence = float(similarities[best_index])

    return {
        "question": qa_data[best_index]["question"],
        "answer": qa_data[best_index]["answer"],
        "confidence": confidence,
    }