import os
import urllib.request
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama

app = FastAPI(
    title="Thirukkural AI Backend",
    description="Custom Fine-Tuned Classical Tamil Knowledge Model API"
)

# Enable CORS for Vercel and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.getenv("MODEL_DIR", "./models")
MODEL_FILENAME = os.getenv("MODEL_FILENAME", "Qwen2.5-3B-Instruct.Q4_K_M.gguf")
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)
MODEL_DOWNLOAD_URL = os.getenv("MODEL_DOWNLOAD_URL", "")

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# Download model if not present locally
if not os.path.exists(MODEL_PATH):
    if MODEL_DOWNLOAD_URL:
        print(f"[Render] Model not found locally. Downloading from {MODEL_DOWNLOAD_URL}...")
        urllib.request.urlretrieve(MODEL_DOWNLOAD_URL, MODEL_PATH)
        print("[Render] Download complete!")
    else:
        print(f"[Render Warning] Model file not found at {MODEL_PATH}. Waiting for upload or MODEL_DOWNLOAD_URL.")

llm = None
if os.path.exists(MODEL_PATH):
    print(f"[Render] Loading model from {MODEL_PATH}...")
    llm = Llama(
        model_path=MODEL_PATH,
        n_ctx=1024,
        n_threads=int(os.getenv("THREADS", "2")),
        verbose=False
    )
    print("[Render] Model successfully loaded into memory!")

PROMPT_TEMPLATE = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request in authentic classical/modern Tamil.

### Instruction:
{question}

### Input:


### Response:
"""

class QuestionRequest(BaseModel):
    question: str
    max_tokens: int = 256
    temperature: float = 0.2

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Thirukkural AI Backend",
        "model_loaded": llm is not None,
        "model_name": MODEL_FILENAME
    }

@app.post("/ask")
def ask_question(payload: QuestionRequest):
    if llm is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. Please verify model weights file on Render."
        )
    
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    formatted_prompt = PROMPT_TEMPLATE.format(question=question)
    
    try:
        output = llm(
            formatted_prompt,
            max_tokens=payload.max_tokens,
            temperature=payload.temperature,
            stop=["<|im_end|>", "<|endoftext|>", "### Instruction:"]
        )
        answer = output["choices"][0]["text"].strip()
        return {
            "question": question,
            "answer": answer,
            "model": "Thirukkural-Qwen2.5-3B-Q4_K_M"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
