from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
import os

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "tinyllama"
OLLAMA_TIMEOUT = 120  # seconds

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

def check_ollama_health():
    """Check if Ollama is running and accessible"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

@app.get("/health")
def health_check():
    """Health check endpoint"""
    ollama_running = check_ollama_health()
    return {
        "status": "ok",
        "ollama": "connected" if ollama_running else "disconnected"
    }

@app.post("/chat")
def chat(request: ChatRequest):
    global conversation_memory

    # Check if Ollama is running
    if not check_ollama_health():
        raise HTTPException(
            status_code=503,
            detail="Ollama service is not running. Please ensure Ollama is installed and running: ollama serve"
        )

    try:
        conversation_memory.append(f"Candidate: {request.message}")

        prompt = "\n".join(conversation_memory) + "\nInterviewer:"

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=OLLAMA_TIMEOUT
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Ollama returned status {response.status_code}"
            )

        data = response.json()
        if "response" not in data:
            raise HTTPException(
                status_code=500,
                detail="Invalid response from Ollama"
            )

        reply = data["response"]

        conversation_memory.append(f"Interviewer: {reply}")

        return {"reply": reply}

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Request to Ollama timed out. The model may be processing too long."
        )
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Make sure Ollama is running: ollama serve"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.post("/reset")
def reset_conversation():
    global conversation_memory
    conversation_memory = [SYSTEM_PROMPT]
    return {"status": "conversation reset"}

# Mount static files
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
async def root():
    return FileResponse(os.path.join(static_path, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
