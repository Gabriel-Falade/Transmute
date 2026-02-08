# Data Alchemist - Complete Output Guide

This document shows exactly what your backend returns at each stage.

---

## 1️⃣ DOCUMENTS.JSON (58 KB)

**Created by:** `ingest.py`
**Purpose:** Processed documents with embeddings

### Structure:
```json
[
  {
    "id": "doc_1",
    "title": "Project Alpha - Kickoff",
    "date": "2024-01-15",
    "content": "# Project Alpha - Kickoff\n**Date:** 2024-01-15...",
    "word_count": 70,
    "filename": "2024-01-project-kickoff.md",
    "embedding": [
      -0.0014668942894786596,
      0.07418826967477798,
      ... 384 dimensions total
    ]
  },
  // ... 4 more documents
]
```

### What Each Field Means:
- `id`: Unique identifier (doc_1, doc_2, etc.)
- `title`: Extracted from first # heading
- `date`: Extracted from filename or frontmatter
- `content`: Full markdown text
- `word_count`: Number of words
- `filename`: Original file name
- `embedding`: 384-dimensional vector (for similarity computation)

---

## 2️⃣ GRAPH.JSON (5.8 KB)

**Created by:** `build_graph.py` (basic), enhanced by `analyze.py`
**Purpose:** Complete knowledge graph with insights

### Full Structure:

```json
{
  "nodes": [
    {
      "id": "doc_1",
      "label": "Project Alpha - Kickoff",
      "date": "2024-01-15",
      "content": "...",
      "word_count": 70,
      "impact_score": 5  // ← Added by analyze.py
    }
  ],

  "edges": [
    {
      "source": "doc_1",
      "target": "doc_3",
      "type": "contradicts",
      "explanation": "Document 2 contradicts Document 1 by recommending...",
      "similarity": 0.5342563472103934
    }
  ],

  "metadata": {
    "total_documents": 5,
    "total_relationships": 4,
    "similarity_threshold": 0.4,
    "clusters": 1,              // ← Added by analyze.py
    "most_impactful": "doc_1"   // ← Added by analyze.py
  },

  "insights": [
    // Contradiction insights
    {
      "type": "contradiction",
      "nodes": ["doc_1", "doc_3"],
      "doc1_title": "Project Alpha - Kickoff",
      "doc2_title": "Architecture Review - March",
      "doc1_date": "2024-01-15",
      "doc2_date": "2024-03-20",
      "doc1_claim": "Database: MongoDB (document store)",
      "doc2_claim": "The team now recommends migrating to PostgreSQL...",
      "conflict_summary": "Document 1 states the project will use MongoDB..."
    },

    // Obsolescence insights
    {
      "type": "obsolete",
      "nodes": ["doc_1", "doc_5"],
      "obsolete_doc": "doc_5",
      "obsolete_title": "Emergency Budget Meeting",
      "obsolete_date": "2024-05-12",
      "superseded_by": "doc_1",
      "superseded_title": "Project Alpha - Kickoff",
      "superseded_date": "2024-01-15",
      "reason": "Document 2 updates the budget and timeline..."
    },

    // Cluster insights
    {
      "type": "cluster",
      "nodes": ["doc_1", "doc_5", "doc_4", "doc_2", "doc_3"],
      "size": 5,
      "documents": [
        "Project Alpha - Kickoff",
        "Emergency Budget Meeting",
        "Q1 Retrospective",
        "Security Policy Update",
        "Architecture Review - March"
      ]
    }
  ]
}
```

### What's In Your Current Graph:

#### Nodes (5 documents):
| ID | Title | Date | Impact Score | Meaning |
|----|-------|------|--------------|---------|
| doc_1 | Project Alpha - Kickoff | 2024-01-15 | **5** | Most connected |
| doc_2 | Security Policy Update | 2024-02-10 | 1 | Least connected |
| doc_3 | Architecture Review - March | 2024-03-20 | 2 | Moderately connected |
| doc_4 | Q1 Retrospective | 2024-04-05 | 2 | Moderately connected |
| doc_5 | Emergency Budget Meeting | 2024-05-12 | 2 | Moderately connected |

#### Edges (4 relationships):
| From | To | Type | Similarity | Explanation |
|------|-----|------|-----------|-------------|
| doc_1 | doc_5 | **updates** | 0.59 | Budget and timeline changes |
| doc_1 | doc_4 | relates_to | 0.54 | Q1 retrospective follows kickoff |
| doc_1 | doc_3 | **contradicts** | 0.53 | MongoDB → PostgreSQL conflict |
| doc_2 | doc_4 | relates_to | 0.42 | Security implementation progress |

#### Insights (3 total):
1. **1 Contradiction:** MongoDB vs PostgreSQL database decision
2. **1 Obsolete Document:** Budget meeting supersedes kickoff budget
3. **1 Cluster:** All 5 documents connected in one group

---

## 3️⃣ API RESPONSES

**Server:** `python app.py` → http://localhost:5000

### GET /api/graph
**Returns:** Complete graph.json (shown above)

```json
{
  "nodes": [...],
  "edges": [...],
  "metadata": {...},
  "insights": [...]
}
```

### GET /api/documents
**Returns:** Complete documents.json

```json
[
  {
    "id": "doc_1",
    "title": "Project Alpha - Kickoff",
    "embedding": [384 dimensions...],
    ...
  }
]
```

### GET /api/insights
**Returns:** Just the insights with stats

```json
{
  "insights": [
    {
      "type": "contradiction",
      "doc1_claim": "Database: MongoDB (document store)",
      "doc2_claim": "The team now recommends migrating to PostgreSQL...",
      ...
    },
    {
      "type": "obsolete",
      "obsolete_title": "Emergency Budget Meeting",
      "superseded_title": "Project Alpha - Kickoff",
      ...
    },
    {
      "type": "cluster",
      "size": 5,
      "documents": ["Project Alpha - Kickoff", ...]
    }
  ],
  "stats": {
    "total": 3,
    "contradictions": 1,
    "obsolete": 1
  }
}
```

### GET /api/stats
**Returns:** Overview statistics

```json
{
  "documents": {
    "total": 5,
    "total_words": 314,
    "avg_words": 62
  },
  "relationships": {
    "total": 4,
    "by_type": {
      "contradicts": 1,
      "updates": 1,
      "relates_to": 2
    }
  },
  "insights": {
    "total": 3,
    "contradictions": 1,
    "obsolete": 1
  }
}
```

### GET /api/health
**Returns:** Server status

```json
{
  "status": "healthy",
  "service": "Data Alchemist API",
  "version": "1.0.0"
}
```

---

## 4️⃣ VISUAL BREAKDOWN

### Current Data Relationships:

```
┌─────────────────────────┐
│  Project Alpha Kickoff  │ ← MOST IMPACTFUL (score: 5)
│      (doc_1, Jan 15)    │
└───┬─────────┬─────────┬─┘
    │         │         │
    │updates  │relates  │contradicts
    │         │         │
    ▼         ▼         ▼
┌─────┐   ┌─────┐   ┌───────────┐
│Budget│   │ Q1  │   │Architecture│
│ Cut  │   │Retro│   │  Review   │
│doc_5 │   │doc_4│   │   doc_3   │
└─────┘   └──┬──┘   └───────────┘
             │relates
             │
             ▼
      ┌──────────┐
      │ Security │
      │  Policy  │
      │  doc_2   │
      └──────────┘
```

### Insights Summary:

**⚠️ CONTRADICTION DETECTED:**
```
📄 Project Alpha Kickoff (Jan 15)
   Claim: "Database: MongoDB (document store)"

   VS

📄 Architecture Review (Mar 20)
   Claim: "The team now recommends migrating to PostgreSQL"

💡 Summary: Database technology decision changed due to performance issues
```

**🔒 OBSOLETE DOCUMENT:**
```
📄 Emergency Budget Meeting (May 12) ← OUTDATED
   Reason: Budget reduced from $50k to $30k

   Superseded by ↓

📄 Project Alpha Kickoff (Jan 15)
   Original budget: $50,000
```

**🔗 CLUSTER DETECTED:**
```
All 5 documents form ONE connected cluster:
  • Project Alpha - Kickoff (hub)
  • Architecture Review
  • Q1 Retrospective
  • Security Policy
  • Emergency Budget Meeting

This means: All documents are part of the same story/project
```

---

## 5️⃣ FRONTEND USAGE

### Example: React/JavaScript

```javascript
// Fetch the complete graph
const graph = await fetch('http://localhost:5000/api/graph')
  .then(r => r.json());

// Use nodes with impact scores
graph.nodes.forEach(node => {
  console.log(`${node.label}: Impact Score = ${node.impact_score}`);

  // Size nodes by impact
  node.size = node.impact_score * 10;

  // Color by impact
  if (node.impact_score >= 5) {
    node.color = '#ff0000'; // Red for high impact
  }
});

// Visualize contradictions
const contradictions = graph.insights.filter(i => i.type === 'contradiction');
contradictions.forEach(c => {
  console.log(`⚠️ CONFLICT:`);
  console.log(`  ${c.doc1_title}: "${c.doc1_claim}"`);
  console.log(`  ${c.doc2_title}: "${c.doc2_claim}"`);

  // Draw red lightning bolt between conflicting nodes
  drawEdge(c.nodes[0], c.nodes[1], {
    color: 'red',
    style: 'lightning',
    tooltip: c.conflict_summary
  });
});

// Gray out obsolete documents
const obsolete = graph.insights.filter(i => i.type === 'obsolete');
obsolete.forEach(o => {
  const node = graph.nodes.find(n => n.id === o.obsolete_doc);
  node.color = '#cccccc'; // Gray
  node.badge = 'OUTDATED';
  node.tooltip = `Superseded by ${o.superseded_title} on ${o.superseded_date}`;
});

// Highlight clusters
const clusters = graph.insights.filter(i => i.type === 'cluster');
clusters.forEach((cluster, idx) => {
  drawClusterBackground(cluster.nodes, {
    color: `hsl(${idx * 60}, 50%, 90%)`,
    label: `Cluster ${idx + 1}: ${cluster.size} docs`
  });
});
```

---

## 6️⃣ KEY METRICS

Current dataset statistics:

- **Documents:** 5 total (314 words)
- **Relationships:** 4 edges
  - 1 contradiction
  - 1 update
  - 2 relates_to
- **Insights:** 3 generated
  - 1 contradiction detail
  - 1 obsolescence flag
  - 1 cluster detected
- **Impact Scores:** Range 1-5
  - Highest: "Project Alpha - Kickoff" (5)
  - Lowest: "Security Policy Update" (1)
- **Clusters:** 1 cluster containing all 5 documents

---

## 7️⃣ WHAT JUDGES WILL SEE

When you demo, judges will see:

1. **Interactive Graph Visualization**
   - 5 nodes (sized by impact score)
   - 4 colored edges (red for contradiction, blue for relates, etc.)
   - Clickable nodes showing full content

2. **Contradiction Panel**
   - MongoDB → PostgreSQL conflict highlighted
   - Side-by-side claim comparison
   - Timeline showing decision reversal

3. **Obsolescence Indicators**
   - Budget meeting grayed out
   - "OUTDATED" badge visible
   - Tooltip showing newer doc

4. **Cluster View**
   - All documents grouped visually
   - Shows interconnected nature of project

5. **Statistics Dashboard**
   - 5 documents processed
   - 4 relationships discovered
   - 3 insights extracted automatically

---

## 📊 DEMO SCRIPT

**Judges:** "What does this do?"

**You:** "Watch this. I upload 5 messy markdown files from a project..."

*Run pipeline: ingest → build_graph → analyze*

**You:** "...and in seconds, it creates an interactive knowledge graph that shows:
1. **This red edge?** That's a contradiction. MongoDB was chosen in January, but by March they reversed to PostgreSQL due to performance issues.
2. **This grayed-out document?** That's obsolete. The budget got cut from $50k to $30k.
3. **These connections?** Show how all documents relate in a story.
4. **This size difference?** Bigger nodes are more impactful—the kickoff doc connects to everything.

**All detected automatically using AI.**"

**Sustainability angle:** "This reduces cognitive load, identifies obsolete docs to reduce storage, and prevents teams from acting on outdated decisions."

---

**That's everything your backend returns! 🚀**
