# 🧠 InsightStream | AI-Powered Search & Citation Engine

InsightStream is a **Perplexity-style AI search engine** designed to build trust through transparency. Unlike traditional chatbots, every claim is explicitly linked to a verifiable source. The application features real-time streaming responses, Generative UI-style tool updates, and an interactive split-screen PDF viewer that highlights the exact evidence supporting each answer.

---


![Architecture](Architecture.jpg)

## ✨ Key Features

### 🎨 Cyber-Glass Aesthetics
- Modern, high-contrast UI with deep mesh gradients
- Glassmorphism cards and panels
- Fluid, physics-based animations powered by Framer Motion

### ⚡ Real-Time Streaming
- Server-Sent Events (SSE) stream responses token-by-token
- Live tool-state updates such as *"Thinking…"* and *"Reading PDF…"*
- Immediate feedback loop for a responsive, conversational feel

### 🔗 Interactive Citations
- Inline, clickable citation badges (e.g., `[1]`, `[2]`) embedded directly in AI responses
- Clear attribution for every factual claim

### 📄 Split-View Verification
- Clicking a citation slides open a PDF viewer beside the chat
- Maintains full conversational context while verifying sources

### 🖍️ Smart Highlighting
- Automatically highlights the exact text span referenced by the AI
- Eliminates manual searching within long documents

### 📱 Responsive Layout
- Flexbox-based split view that adapts smoothly to resizing and overflow
- Optimized for desktop-first research workflows

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities
- **State Management**: Zustand
- **Animations**: Framer Motion
- **PDF Rendering**: react-pdf (client-side)

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Streaming**: Server-Sent Events (SSE) via `StreamingResponse`
- **Concurrency**: Asyncio (simulated async queue for streaming tokens)

### Infrastructure
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start (Docker)

The fastest way to run the full stack is using Docker.

### Prerequisites
- Docker Desktop installed and running

### Run the Application

```bash
git clone <your-repo-url>
cd insight-stream
docker-compose up --build
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

---

## 💻 Manual Setup (Local Development)

If you prefer running services independently:

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. PDF Configuration (Required for Demo)

Ensure `sample.pdf` exists in **both** locations:

- `backend/documents/sample.pdf` – backend source document
- `frontend/public/sample.pdf` – frontend display asset

---

## 📂 Project Structure

```plaintext
insight-stream/
├── backend/
│   ├── main.py                # FastAPI entry point & SSE endpoint
│   ├── utils.py               # Mock AI generator & citation logic
│   ├── documents/             # Source PDFs for citation
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── globals.css        # Tailwind imports & glass styles
│   │   ├── layout.tsx         # Root layout & fonts
│   │   └── page.tsx           # Split-view layout controller
│   ├── components/
│   │   ├── ChatInterface.tsx  # Streaming chat & input handling
│   │   ├── MessageBubble.tsx  # Chat bubbles & citation badges
│   │   └── PDFViewer.tsx      # Slide-over glass PDF panel
│   ├── lib/
│   │   ├── store.ts           # Zustand global store
│   │   └── types.ts           # Shared TypeScript types
│   ├── public/                # Static assets (PDFs, images)
│   └── tailwind.config.ts     # Tailwind theme extensions
│
└── docker-compose.yml         # Container orchestration
```

---

## 🧠 Design Decisions & Architecture

### 1. Streaming Protocol – Server-Sent Events (SSE)

SSE was chosen over WebSockets because the data flow is strictly server-to-client during generation. SSE is simpler to implement, works over standard HTTP, and provides automatic reconnection.

**Implementation**: The backend yields structured JSON chunks (text, tool state, citations). The frontend `EventSource` listener incrementally updates the Zustand store.

---

### 2. Frontend Split-View Architecture

The PDF viewer is implemented as a **layout sibling**, not a modal.

**Implementation**: A Flex container in `page.tsx` dynamically animates widths using Framer Motion. When a citation is activated, the chat pane shrinks while the PDF panel slides in—preserving full conversational context.

---

### 3. PDF Handling & Highlighting Strategy

- **Mock RAG**: For demonstration purposes, document retrieval is simulated. The backend maps answers to predefined pages and snippets in `sample.pdf`.
- **Highlighting**: The `react-pdf` text layer is intercepted using `customTextRenderer`, wrapping matched phrases in highlighted spans based on backend-provided snippets.

---

### 4. Cyber-Glass Styling System

- High-blur backdrops (`backdrop-blur-md`)
- Semi-transparent borders (`border-white/10`)
- Layered mesh gradients for depth and hierarchy

This approach differentiates InsightStream from conventional dashboard-style AI tools.

---

## 🧪 How to Test the Demo

1. Open http://localhost:3000
2. Enter the prompt:

   > **"Explain the difference between quantum computing and neural networks."**

3. Observe live tool indicators (*Thinking…*, *Searching…*)
4. Click citation `[1]` to open the PDF viewer
5. Watch Page 3 highlight the definition of **Superposition**
6. Click `[2]` to jump directly to Page 5 for **Neural Networks**

---

## 📄 License

This project is provided as an **assignment submission** and is open for review and evaluation.

