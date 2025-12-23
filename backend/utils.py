import asyncio
import json
import random

# Mock database of PDF Metadata
# In a real app, this would come from a Vector DB (e.g., Pinecone/pgvector)
DOCUMENTS = {
    "1": {
        "id": "1", 
        "title": "Quantum Computing Basics", 
        "page": 3, 
        "file": "sample.pdf",
        "snippet": "Quantum superposition allows qubits to exist in multiple states..."
    },
    "2": {
        "id": "2", 
        "title": "Neural Network Architecture", 
        "page": 5, 
        "file": "sample.pdf",
        "snippet": "Neural networks mimic the human brain structure..."
    },
}

async def mock_ai_generator(query: str):
    """
    Simulates a complex AI pipeline with streaming events.
    """
    
    # Event 1: Tool Call - Thinking
    yield f"data: {json.dumps({'type': 'tool', 'content': 'Thinking...'})}\n\n"
    await asyncio.sleep(0.8)

    # Event 2: Tool Call - Vector Search
    yield f"data: {json.dumps({'type': 'tool', 'content': 'Searching knowledge base...'})}\n\n"
    await asyncio.sleep(1.0)
    
    # Event 3: Tool Call - Reading Docs
    yield f"data: {json.dumps({'type': 'tool', 'content': 'Reading PDFs...'})}\n\n"
    await asyncio.sleep(0.8)

    # Event 4: Stream the Text Response
    # We break the text into small tokens to simulate LLM generation
    full_response = [
        "Based on the analysis of the uploaded documents, ",
        "Quantum computing ",
        "fundamentally differs from classical computing ",
        "by utilizing qubits. ",
        "These qubits can exist in a state of superposition [1], ", # Citation 1
        "which allows for parallel processing power ",
        "far exceeding current limits. ",
        "\n\nOn the other hand, ",
        "Neural Networks ",
        "are designed to recognize patterns ",
        "and mimic human decision-making processes [2]. ", # Citation 2
        "When combined, these technologies ",
        "create a powerful synergy for ",
        "future AI applications."
    ]

    for chunk in full_response:
        # Randomized delay to make it feel like a real LLM "thinking" between tokens
        await asyncio.sleep(random.uniform(0.05, 0.2))
        
        # Check if chunk contains a citation and send the citation event first
        if "[1]" in chunk:
            yield f"data: {json.dumps({'type': 'citation', 'data': DOCUMENTS['1']})}\n\n"
        if "[2]" in chunk:
            yield f"data: {json.dumps({'type': 'citation', 'data': DOCUMENTS['2']})}\n\n"
            
        yield f"data: {json.dumps({'type': 'text', 'content': chunk})}\n\n"

    # Event 5: Signal completion
    yield "data: [DONE]\n\n"

def extract_text_from_pdf(pdf_path: str, page_num: int):
    """
    Placeholder for actual PyPDF2 logic.
    usage: text = extract_text_from_pdf("documents/sample.pdf", 3)
    """
    try:
        # import PyPDF2
        # reader = PyPDF2.PdfReader(pdf_path)
        # return reader.pages[page_num].extract_text()
        return "Actual PDF text extraction would happen here."
    except Exception as e:
        return str(e)