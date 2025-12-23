from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from utils import mock_ai_generator  # Import the advanced generator

app = FastAPI()

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stream")
async def stream(request: Request, query: str):
    """
    Streaming endpoint that uses the generator from utils.py.
    The generator handles:
    1. Tool call events (Thinking, Searching)
    2. Text chunks (Typing effect)
    3. Citation events (Metadata for the frontend)
    """
    return StreamingResponse(
        mock_ai_generator(query), 
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    # Reload=True allows you to see changes without restarting manually
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)