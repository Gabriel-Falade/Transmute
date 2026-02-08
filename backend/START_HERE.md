# 🚀 Quick Start Guide

## Start the Backend Server

```bash
cd backend
python app.py
```

The server will start on **http://localhost:5000**

You'll see:
```
Data Alchemist API Server
============================================================
Starting server on http://localhost:5000

Available endpoints:
  - GET  /api/graph         - Complete knowledge graph
  - GET  /api/documents     - All documents
  - GET  /api/insights      - Contradictions & obsolete docs
  - GET  /api/stats         - Statistics
  - GET  /api/metrics       - Sustainability metrics
  - POST /api/wiki/generate - Generate wiki summary
  - POST /api/wiki/chat     - Chat with documents
  - GET  /api/health        - Health check
```

## Test the Wiki Endpoints

**In a new terminal:**

```bash
# Generate wiki
curl -X POST http://localhost:5000/api/wiki/generate

# Ask a question
curl -X POST http://localhost:5000/api/wiki/chat \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"What database was chosen?\"}"
```

## Warnings You Can Ignore

- `FutureWarning: google.generativeai package...` - This is fine, the library still works!
- The embedding model will load when you first use the chat (takes ~2 seconds)

## Your Full Pipeline

```bash
# 1. Process documents
python ingest.py        # → documents.json

# 2. Build graph
python build_graph.py   # → graph.json

# 3. Extract insights
python analyze.py       # → enhanced graph.json

# 4. Calculate metrics
python metrics.py       # → metrics.json

# 5. Generate wiki
python generate_wiki.py # → wiki.md

# 6. Start API server
python app.py          # → Serves everything via HTTP
```

## Frontend Integration

**In your client folder:**

1. Install react-markdown:
```bash
npm install react-markdown
```

2. Add WikiPage to your router:
```javascript
import WikiPage from './WikiPage';

<Route path="/wiki" element={<WikiPage />} />
```

3. Navigate to: `http://localhost:3000/wiki`

## All Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/graph` | GET | Full knowledge graph |
| `/api/documents` | GET | All documents with embeddings |
| `/api/insights` | GET | Contradictions + obsolete + clusters |
| `/api/stats` | GET | Statistics |
| `/api/metrics` | GET | Sustainability metrics |
| `/api/wiki/generate` | POST | Generate wiki summary |
| `/api/wiki/chat` | POST | Ask questions (RAG chatbot) |
| `/api/health` | GET | Health check |

## Quick Test

```bash
# Check health
curl http://localhost:5000/api/health

# Get stats
curl http://localhost:5000/api/stats

# Generate wiki
curl -X POST http://localhost:5000/api/wiki/generate | python -m json.tool
```

## Troubleshooting

**"Address already in use"?**
```bash
# Kill the process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Then restart
python app.py
```

**CORS errors in frontend?**
- CORS is already enabled
- Make sure backend is on port 5000
- Make sure you're using `http://localhost:5000` (not 127.0.0.1)

**Chat not working?**
- First chat message will be slow (loading embedding model)
- Check browser console for errors
- Test backend directly with curl first

---

**Ready to demo! 🎉**
