# Data Alchemist - Backend

Transform dark data into interactive knowledge graphs with AI-powered insights.

## Quick Start

```bash
# 1. Process documents
python ingest.py

# 2. Build knowledge graph
python build_graph.py

# 3. Extract insights
python analyze.py

# 4. Start API server
python app.py
```

## Pipeline Overview

### 1. **ingest.py** - Document Processing
- Reads markdown files from `test-files/`
- Generates 384-dim embeddings (sentence-transformers)
- Outputs: `documents.json`

### 2. **build_graph.py** - Graph Construction
- Computes document similarity (cosine distance)
- Uses Gemini AI to classify relationships
- Types: `contradicts`, `updates`, `supports`, `relates_to`
- Outputs: `graph.json`

### 3. **analyze.py** - Deep Analysis
- **Contradiction Detection**: Extracts conflicting claims
- **Obsolescence Detection**: Flags outdated documents
- **Cluster Detection**: Groups related documents
- **Impact Analysis**: Scores document importance
- Outputs: Enhanced `graph.json` with insights

### 4. **app.py** - REST API
Flask server exposing graph data for frontend.

#### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/graph` | Complete knowledge graph with insights |
| `GET /api/documents` | All processed documents |
| `GET /api/insights` | Contradictions & obsolete docs |
| `GET /api/stats` | Overall statistics |
| `GET /api/health` | Health check |

**Example:**
```bash
curl http://localhost:5000/api/graph
```

## Output Structure

### graph.json
```json
{
  "nodes": [
    {
      "id": "doc_1",
      "label": "Document Title",
      "date": "2024-01-15",
      "content": "...",
      "impact_score": 5
    }
  ],
  "edges": [
    {
      "source": "doc_1",
      "target": "doc_2",
      "type": "contradicts",
      "explanation": "...",
      "similarity": 0.85
    }
  ],
  "insights": [
    {
      "type": "contradiction",
      "doc1_claim": "...",
      "doc2_claim": "...",
      "conflict_summary": "..."
    },
    {
      "type": "obsolete",
      "obsolete_doc": "doc_5",
      "superseded_by": "doc_1"
    },
    {
      "type": "cluster",
      "nodes": ["doc_1", "doc_2", "doc_3"],
      "size": 3
    }
  ]
}
```

## Configuration

### Environment Variables (.env)
```bash
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### Tuning Parameters

**build_graph.py:**
- `similarity_threshold`: Minimum similarity for edges (default: 0.4)
- `max_edges`: Maximum relationships to analyze (default: 15)

**analyze.py:**
- `max_contradictions`: Max contradictions to detail (default: 5)

## Dependencies

```bash
pip install -r requirements.txt
```

Core packages:
- `sentence-transformers` - Embeddings
- `scikit-learn` - Similarity computation
- `google-generativeai` - AI relationship classification
- `flask` + `flask-cors` - API server
- `python-dotenv` - Environment management

## Frontend Integration

Your frontend partner can consume the API:

```javascript
// Fetch graph data
const response = await fetch('http://localhost:5000/api/graph');
const graph = await response.json();

// Graph structure ready for vis.js, cytoscape.js, d3-force, etc.
graph.nodes.forEach(node => {
  // Highlight high-impact nodes
  if (node.impact_score > 3) {
    // Make it bigger/brighter
  }
});

graph.insights.forEach(insight => {
  if (insight.type === 'contradiction') {
    // Show red lightning bolt
    // Display: insight.doc1_claim vs insight.doc2_claim
  }
  if (insight.type === 'obsolete') {
    // Gray out obsolete_doc
    // Show "superseded by" arrow
  }
});
```

## Demo Tips

### For Judges
1. **Show the contradiction** - MongoDB → PostgreSQL conflict with exact claims
2. **Show obsolescence** - Budget cuts making original plan outdated
3. **Show impact scores** - Kickoff document connects to everything
4. **Show clusters** - All documents form connected project narrative

### Sustainability Story
- **Cognitive load reduction**: Automatically surface conflicts and outdated info
- **Storage optimization**: Identify redundant/obsolete documents
- **Knowledge preservation**: Transform scattered docs into queryable graph

## Sample Data

Included in `test-files/`:
- Project kickoff with MongoDB decision
- Security policy update
- Architecture review (contradicts MongoDB)
- Team retrospective
- Budget cuts (updates original plan)

**Replace with your own data** - just add .md files to `test-files/` and re-run the pipeline!

## Troubleshooting

**Issue:** `ModuleNotFoundError: No module named 'sentence_transformers'`
**Fix:** `pip install sentence-transformers`

**Issue:** API returns 404
**Fix:** Run the full pipeline first (`ingest.py` → `build_graph.py` → `analyze.py`)

**Issue:** Gemini API errors
**Fix:** Check your `.env` file has valid `GEMINI_API_KEY`

## Next Steps

- [ ] Add PDF/DOCX support (use `python-docx`, `PyPDF2`)
- [ ] Implement vector search for document queries
- [ ] Add timeline visualization data
- [ ] Export to Neo4j or other graph DBs
- [ ] Deploy API to cloud (Render, Railway, etc.)

---

Built for UGAHacks 2025 🚀
