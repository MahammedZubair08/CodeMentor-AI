from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "tinyllama"

SYSTEM_PROMPT = """
You are a Programming Interview Assistant.

Rules:
- Only answer Data Structures and Algorithms related questions.
- Focus on coding interviews.
- First give a hint.
- Then explain approach.
- Then provide code (if asked).
- Always mention time and space complexity.
- If question is outside programming, politely refuse.
"""

conversation_memory = [SYSTEM_PROMPT]

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    global conversation_memory

    conversation_memory.append(f"Candidate: {request.message}")

    prompt = "\n".join(conversation_memory) + "\nInterviewer:"

    response = requests.post(OLLAMA_URL, json={
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    })

    reply = response.json()["response"]

    conversation_memory.append(f"Interviewer: {reply}")

    return {"reply": reply}