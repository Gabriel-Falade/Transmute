# Transmute Demo Datasets

Three carefully crafted datasets designed to demonstrate Transmute's ability to detect contradictions, identify obsolete information, and synthesize knowledge from chaotic documentation.

---

## 📁 Dataset Overview

### 1. Corporate Chaos (19 documents)
**Use Case:** Simulates a tech company with constantly changing strategies and policies

**File Count:** 19 documents spanning Jan 2023 - Dec 2024

**Location:** `demo-datasets/corporate-chaos/`

**Key Contradictions:**

| Topic | Contradiction Timeline |
|-------|------------------------|
| **Cloud Provider** | AWS (Jan 2023) → Azure (Sep 2023) → GCP (May 2024) |
| **Remote Work** | Mandatory Office (Mar 2023) → Hybrid (Jan 2024) → Remote-First (Jun 2024) |
| **Sustainability** | Carbon neutral 2030 (Jun 2023) → Delayed to 2035 (Apr 2024) → Accelerated to 2025 (Dec 2024) |
| **Data Privacy** | Strict governance (Jul 2024) → Aggressive data collection (Aug 2024) → AI ethics (Oct 2024) → Automated AI marketing (Nov 2024) |
| **Workforce** | 15% layoff (Mar 2024) → Aggressive hiring (Jul 2024) |
| **Products** | Sunset 7 products inc. IoT (Sep 2024) → Launch 5 new products inc. IoT 2.0 (Nov 2024) |
| **Database** | PostgreSQL standard (Feb 2024) - aligns with original test files' MongoDB → PostgreSQL story |

**Demo Value:** Shows how corporate "dark data" accumulates contradictions that confuse employees and waste time.

---

### 2. City Council / Community Impact (11 documents)
**Use Case:** Simulates municipal government with conflicting departmental priorities

**File Count:** 11 documents spanning Jan 2023 - Nov 2024

**Location:** `demo-datasets/city-council/`

**Key Contradictions:**

| Topic | Contradiction Timeline |
|-------|------------------------|
| **Climate Action** | Ambitious 2030 plan (Jan 2023) → Budget cuts, delayed to 2040 (May 2024) → Green New Deal, accelerated to 2028 (Nov 2024) |
| **Transportation** | Highway expansion + parking (Jan 2024) → Vision Zero, reduce speeds, protected bikes (Aug 2024) |
| **Housing** | Affordable housing priority (Aug 2023) → Market-rate developer incentives (Mar 2024) → Public housing + rent control (Nov 2024) |
| **Emergency Response** | Basic heat guidance (Apr 2023) → Comprehensive heat emergency protocol (Jun 2024) |
| **Economic Development** | Business tax incentives (Oct 2024) vs. Worker cooperatives + living wage (Nov 2024) |

**Demo Value:** Demonstrates how public policy contradictions create confusion for residents and undermine community safety.

**Sustainability Angle:** Climate action flip-flops, transportation priorities, environmental justice

**Community Impact:** Housing affordability, emergency preparedness, public safety

---

### 3. Live Upload / Micro Demo (6 documents)
**Use Case:** Small, simple dataset for live demonstration during judging

**File Count:** 6 documents (all from Dec 2024)

**Location:** `demo-datasets/live-demo/`

**Key Contradictions:**

| Date | Document | Contradiction |
|------|----------|---------------|
| Dec 1 | Team Meeting | React + Node.js + MongoDB + AWS |
| Dec 10 | Tech Stack Change | Vue.js + Python + PostgreSQL + GCP |
| Dec 5 | Security Policy | MFA "optional but recommended" |
| Dec 12 | MFA Mandatory | MFA now MANDATORY (reverses Dec 5) |
| Dec 8 | Budget Update | $185K total budget |
| Dec 15 | Launch Delay | $235K budget (increased by $50K) |

**Demo Value:**
- Quick to upload and process (under 2 minutes)
- Obvious contradictions judges can immediately understand
- Proves system works on any dataset (not hardcoded)
- Perfect for live demo to show real-time processing

---

## 🎯 How to Use During Hackathon Demo

### Pre-Demo Setup

1. **Prepare ZIP files:**
```bash
cd backend/demo-datasets

# Corporate Chaos (main demo)
zip -r corporate-chaos.zip corporate-chaos/*.md

# City Council (sustainability/impact story)
zip -r city-council.zip city-council/*.md

# Live Demo (quick validation)
zip -r live-demo.zip live-demo/*.md
```

2. **Start the application:**
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd client
npm start
```

### Demo Flow 1: Corporate Chaos (Primary Demo)

**Narrative:** "Imagine you're an employee at TechCorp. Your boss tells you to use AWS, but then a memo says Azure, and now you're reading about GCP. You're told to come to the office, then work hybrid, now fully remote. What's actually the current policy?"

**Steps:**
1. Go to http://localhost:3000/upload
2. Upload `corporate-chaos.zip`
3. Watch magical cauldron animation 🪄
4. Redirected to Analytics page
5. Show contradictions detected (AWS → Azure → GCP visible)
6. Navigate to Wiki page
7. Show AI-generated synthesis explaining the evolution
8. Use chatbot to ask: "What cloud provider should we use?"
9. Demonstrate how AI synthesizes all conflicting info into clear answer

**Key Points to Highlight:**
- 19 documents, thousands of words of contradictory information
- Transmute automatically detects 8+ major contradictions
- Wiki creates coherent narrative from chaos
- Chatbot can answer questions across all documents
- **ROI Story:** "Employees waste hours hunting through old docs. This turns dark data into living knowledge in minutes."

### Demo Flow 2: City Council (Impact Story)

**Narrative:** "Imagine you're a resident trying to understand your city's climate goals. One document says 2030, another says 2040, now it says 2028. Which is right? What about emergency heat guidelines that were outdated?"

**Steps:**
1. Upload `city-council.zip`
2. Show sustainability contradictions
3. Highlight emergency preparedness evolution (old heat guidance → updated heat guidance)
4. Ask chatbot: "What's the current climate goal?"
5. Show how wiki synthesizes conflicting policies

**Key Points to Highlight:**
- **Community Safety:** Outdated emergency guidance could cost lives
- **Sustainability:** Climate flip-flops confuse residents and slow progress
- **Democracy:** Citizens deserve clear, current information from their government
- **Use Case:** City governments, universities, hospitals - any large organization with siloed departments

### Demo Flow 3: Live Upload (Proof of Concept)

**Narrative:** "To prove this isn't hardcoded to our demo data, let me upload a completely different dataset right now..."

**Steps:**
1. Upload `live-demo.zip` during live presentation
2. Processing happens in real-time (2-3 minutes)
3. Show contradictions immediately detected:
   - Tech stack reversal (React → Vue)
   - MFA policy change (optional → mandatory)
   - Budget increase ($185K → $235K)
4. Generate wiki on the fly
5. Ask chatbot question

**Key Points:**
- Proves system works on any markdown documents
- Real-time processing (not pre-computed)
- Flexible and adaptable

---

## 🎨 Presentation Tips

### Opening Hook
"Every organization has **dark data** - documents scattered across drives, conflicting information, outdated policies. Employees waste hours searching. Decisions are made on wrong information. What if we could turn that chaos into living knowledge?"

### The Problem (Show with Examples)
- Pull up contradictory documents side-by-side
- "Which one is correct? An employee sees AWS, Azure, and GCP in three different memos."
- "A resident sees three different climate targets. Which should they believe?"

### The Solution (Live Demo)
- Upload → Process → Analyze
- Show magical cauldron animation (delightful UI)
- Navigate through Analytics, Wiki, Visualize pages
- Use chatbot to ask questions

### The Impact (Sustainability + Community)
**Sustainability Impact:**
- Reduces time wasted searching for information (cognitive load = carbon footprint)
- Identifies obsolete information to prevent waste
- Helps organizations track and meet climate commitments
- Example: "City climate policy flip-flops waste staff time and slow progress"

**Community Impact:**
- Public safety: Updated emergency guidance saves lives
- Transparency: Clear understanding of government policies
- Democracy: Citizens can hold governments accountable
- Equity: Everyone gets access to synthesized knowledge, not just those who can navigate bureaucracy

### The Technology
- **Knowledge Graphs:** Relationships between documents
- **Semantic Embeddings:** Understanding meaning, not just keywords
- **LLM Synthesis:** Gemini AI creates coherent narratives
- **RAG Chatbot:** Question-answering across all documents
- **React + Flask:** Modern, scalable architecture

### Closing
"Transmute transforms organizational dark data into living knowledge. It detects contradictions, identifies obsolete information, and creates clear guidance - saving time, reducing carbon footprint, and serving communities better."

---

## 📊 Metrics Judges Will See

When processing these datasets, expect these metrics:

### Corporate Chaos
- **Documents:** 19
- **Total Words:** ~5,000
- **Contradictions:** 8-12 (depending on AI detection)
- **Obsolete Docs:** 5-8
- **Relationships:** 40-60 semantic connections
- **Processing Time:** 3-5 minutes

### City Council
- **Documents:** 11
- **Total Words:** ~4,500
- **Contradictions:** 6-10
- **Obsolete Docs:** 3-5
- **Relationships:** 25-40
- **Processing Time:** 2-4 minutes

### Live Demo
- **Documents:** 6
- **Total Words:** ~800
- **Contradictions:** 3-4
- **Obsolete Docs:** 2
- **Relationships:** 8-12
- **Processing Time:** 1-2 minutes

---

## 🚀 Advanced Demo Ideas

### Multi-Dataset Comparison
1. Process Corporate Chaos
2. Download results
3. Process City Council
4. Compare how different organizations have similar patterns of chaos

### Time-Series Visualization
- Use dates to show how policies evolved over time
- "Watch the cloud provider decision bounce between AWS, Azure, and GCP"

### Chatbot Stress Test
Ask progressively harder questions:
1. "What cloud provider should we use?" (needs to synthesize conflicting docs)
2. "Why did the sustainability goals change?" (requires understanding reasoning)
3. "What's obsolete?" (tests analytical capabilities)

### Contradiction Deep-Dive
- Click into specific contradiction in analytics
- Show exact conflicting passages
- Demonstrate how wiki synthesizes both sides

---

## 🎯 Judging Criteria Alignment

### Innovation
- Novel application of knowledge graphs to organizational documentation
- Combines multiple AI techniques (embeddings, LLMs, graph analysis)
- Magical UI makes complex tech delightful

### Impact (Sustainability + Community)
- **Sustainability:** Reduces cognitive load, prevents wasted effort
- **Community:** Public safety (emergency guidance), transparency (government policies)
- **Scalability:** Works for any organization with documents

### Technical Excellence
- Full-stack implementation (React + Flask + Gemini)
- Real-time processing of user uploads
- Semantic analysis, not just keyword matching
- Beautiful visualizations

### Completeness
- End-to-end working system
- Multiple demo datasets
- Comprehensive UI (upload, analytics, wiki, visualize, chat)
- Professional presentation

---

## 💡 Troubleshooting

### If contradictions don't appear:
- Check that Gemini API key is set in `.env`
- Verify analyze.py ran successfully
- Look at `graph.json` - should have `insights` array

### If processing is slow:
- First upload always slower (loading ML models)
- Subsequent uploads are faster
- Embedding generation is the slowest step

### If wiki is empty:
- Check Gemini API key and model name in `.env`
- Verify generate_wiki.py can be called
- Check browser console for errors

---

## 🎓 Key Talking Points

1. **"Dark Data Problem":** Organizations have 80% of their data as unstructured docs - we make it usable
2. **"Living Knowledge":** Not static docs, but synthesized, queryable knowledge base
3. **"Contradiction Detection":** Automatically finds conflicts that humans miss
4. **"Sustainability Angle":** Reducing wasted time = reducing cognitive carbon footprint
5. **"Community Impact":** Public safety, transparency, equity in access to information
6. **"Scalable Solution":** Works for city governments, universities, hospitals, companies

---

## 📝 Sample Questions & Answers

**Q: "How is this different from just searching documents?"**
A: "Search gives you documents. We give you synthesized knowledge. Ask 'What cloud should we use?' and we'll tell you GCP is current - even though you have contradictory memos saying AWS and Azure."

**Q: "How does this help sustainability?"**
A: "Employees waste hours hunting through contradictory docs. That's cognitive load, energy, and time that could go to actual work. We've also designed this to help organizations track and meet sustainability commitments - like detecting when climate goals change."

**Q: "What's the community impact?"**
A: "Outdated emergency guidance could cost lives. Conflicting city policies confuse residents. We make public information clear and accessible - that's democracy and public safety."

**Q: "Can this scale?"**
A: "Absolutely. We've tested with 19 documents, but the architecture handles thousands. Any organization with scattered documentation - universities, hospitals, governments - can use this."

---

## 🏆 Demo Success Checklist

Before presenting:
- [ ] All three ZIP files created and tested
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:3000)
- [ ] Gemini API key configured and working
- [ ] Test upload of one dataset to verify pipeline works
- [ ] Browser tabs ready (localhost:3000, no other tabs)
- [ ] Presentation mode / demo mode enabled
- [ ] Script/talking points reviewed

During demo:
- [ ] Tell story (problem → solution → impact)
- [ ] Upload dataset with magical cauldron animation
- [ ] Show Analytics page with contradictions
- [ ] Navigate to Wiki page and highlight synthesis
- [ ] Use Chatbot to answer question across docs
- [ ] Emphasize sustainability and community impact
- [ ] End with clear call to action / vision

After demo:
- [ ] Answer questions confidently
- [ ] Have backup examples ready
- [ ] Explain technical architecture if asked
- [ ] Connect to judges' interests (sustainability, community, innovation)

---

## 🌟 You've Got This!

These datasets are designed to make Transmute shine. They showcase:
✅ Real contradictions AI can detect
✅ Sustainability and community impact
✅ Beautiful, magical UI
✅ Technical sophistication
✅ Practical, scalable solution

**Good luck at UGAHacks! Transform that dark data into gold! 🪄✨**
