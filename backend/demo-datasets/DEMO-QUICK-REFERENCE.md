# 🎯 DEMO QUICK REFERENCE CARD

Print this out or keep it on your phone during the hackathon presentation!

---

## 📍 File Locations

**ZIP Files:** `backend/demo-datasets/`
- ✅ `corporate-chaos.zip` (19 docs) - MAIN DEMO
- ✅ `city-council.zip` (11 docs) - IMPACT STORY
- ✅ `live-demo.zip` (6 docs) - LIVE VALIDATION

---

## 🚀 Quick Start Commands

```bash
# Start Backend (Terminal 1)
cd backend
python app.py

# Start Frontend (Terminal 2)
cd client
npm start

# Open in Browser
http://localhost:3000
```

---

## 🎬 30-Second Pitch

"Every organization drowns in **dark data** - scattered documents with contradictions that waste time and cause mistakes. **Transmute** transforms this chaos into a living knowledge base using AI-powered knowledge graphs. Upload documents → Detect contradictions → Generate Wiki → Ask questions. It's sustainability (less wasted time) meets community impact (clear, accessible information)."

---

## 📝 Demo Script (5 minutes)

### 1. HOOK (30 sec)
"Imagine your boss sends 3 memos: Use AWS, use Azure, use GCP. Which is current? That's the dark data problem."

### 2. UPLOAD (1 min)
- Go to Upload page
- Upload `corporate-chaos.zip`
- **While processing:** "We're analyzing 19 documents with embeddings, building a knowledge graph, and detecting contradictions"
- Watch magical cauldron animation 🪄

### 3. ANALYTICS (1 min)
- Auto-redirects to Analytics
- **Point out:** "19 documents processed, 8+ contradictions detected automatically"
- **Click on a contradiction:** "Here's AWS vs Azure vs GCP - AI detected this conflict"

### 4. WIKI (1.5 min)
- Navigate to Wiki
- **Show synthesis:** "AI created a Wikipedia-style article synthesizing all 19 docs"
- **Highlight:** "See how it explains the evolution: AWS → Azure → GCP"
- **Scroll to contradictions section**

### 5. CHATBOT (1 min)
- Click "Ask about documents"
- **Ask:** "What cloud provider should we use?"
- **AI answers:** "GCP is the current decision as of May 2024"
- **Point out:** "It synthesized across contradictory docs to give the right answer"

### 6. IMPACT (30 sec)
- **Sustainability:** "Employees waste hours hunting docs - this saves time and cognitive energy"
- **Community:** "Works for governments too - clear emergency guidance saves lives"
- **Scale:** "Any organization with scattered docs can use this"

---

## 🎯 Key Contradictions to Highlight

### Corporate Chaos
1. **Cloud:** AWS → Azure → GCP (3 complete reversals!)
2. **Work Policy:** Office → Hybrid → Remote-first
3. **Sustainability:** 2030 → 2035 → 2025 (total whiplash)
4. **Privacy:** Strict governance → Aggressive data collection
5. **Hiring:** 15% layoff → Massive hiring surge
6. **Products:** Sunset IoT → Launch IoT 2.0

### City Council
1. **Climate:** 2030 goal → 2040 delay → 2028 acceleration
2. **Transport:** Highway expansion → Vision Zero pedestrian priority
3. **Housing:** Affordable housing → Developer incentives → Public housing
4. **Emergency:** Basic heat advice → Comprehensive heat emergency protocol

---

## 💬 Chatbot Demo Questions

**Easy:** "What cloud provider should we use?"
**Medium:** "What's our current remote work policy?"
**Hard:** "Why did the sustainability goals change?"
**Impact:** "What contradictions exist in the documents?"

---

## 🏆 If Judges Ask...

**"How is this different from search?"**
→ "Search returns documents. We return synthesized knowledge. We tell you what's CURRENT even when you have conflicting info."

**"What's the sustainability angle?"**
→ "Time waste = energy waste. Also helps orgs track climate commitments. Cities can't meet goals if policies keep changing."

**"Community impact?"**
→ "Public safety - outdated emergency guidance costs lives. Democracy - citizens deserve clear info. Equity - knowledge for everyone, not just insiders."

**"Does it scale?"**
→ "Yes! Works on any markdown/text/PDF. Tested with 19 docs but architecture handles thousands. Universities, hospitals, governments - all have this problem."

**"How does it detect contradictions?"**
→ "Semantic embeddings understand meaning, not keywords. AI compares similar documents and flags conflicts. Graph analysis shows relationships."

---

## 🔧 Technical Architecture (if asked)

**Frontend:** React with magical UI animations
**Backend:** Flask REST API
**AI:** Google Gemini for synthesis & chat
**Embeddings:** SentenceTransformers (all-MiniLM-L6-v2)
**Analysis:** Knowledge graph with contradiction detection
**Upload:** ZIP processing with multi-format support (.md, .txt, .pdf)

---

## ⚠️ Troubleshooting

**Contradictions not showing?**
→ Check `backend/graph.json` has `insights` array
→ Verify Gemini API key in `.env`

**Processing slow?**
→ First upload loads models (slow)
→ Subsequent uploads faster

**Wiki empty?**
→ Check Gemini API key and model name
→ Check browser console for errors

---

## ✨ Magical Moments to Showcase

1. **Cauldron Animation** - Files falling into bubbling potion 🪄
2. **Auto Dark Mode** - UI switches to dark theme during upload
3. **Spell Complete** - ✨ animation when processing finishes
4. **Knowledge Graph** - Beautiful visual of document relationships
5. **Real-time Chat** - Ask questions, get instant answers

---

## 📊 Expected Metrics

**Corporate Chaos:**
- 19 docs, ~5,000 words
- 8-12 contradictions
- 40-60 relationships
- 3-5 min processing

**City Council:**
- 11 docs, ~4,500 words
- 6-10 contradictions
- 25-40 relationships
- 2-4 min processing

**Live Demo:**
- 6 docs, ~800 words
- 3-4 contradictions
- 8-12 relationships
- 1-2 min processing

---

## 🎤 Closing Line

"Transmute turns organizational dark data into living knowledge - saving time, serving communities, and building a more sustainable future. One upload at a time. ✨"

---

## 📸 Screenshot Checklist

Before demo:
- [ ] Upload page (magical cauldron)
- [ ] Analytics page (contradictions visible)
- [ ] Wiki page (synthesis visible)
- [ ] Chatbot open and answering
- [ ] Visualize graph (beautiful visualization)

---

## 🎯 Demo Day Priority

1. **PRIMARY:** Corporate Chaos (most impressive, 19 docs)
2. **BACKUP:** City Council (if judges care more about gov/impact)
3. **PROOF:** Live Demo (if they doubt it works on new data)

---

## ⏰ Time Allocations

**5-min presentation:**
- Hook: 30 sec
- Problem: 1 min
- Solution/Demo: 2.5 min
- Impact: 30 sec
- Close: 30 sec

**7-min presentation:**
- Add live demo upload
- Show all pages (Analytics, Wiki, Visualize, Chat)
- Deeper explanation of contradictions

**10-min presentation:**
- Do both Corporate + City Council
- Deep dive into specific contradictions
- Show chatbot stress test
- Explain technical architecture

---

## 🌟 REMEMBER

- **Tell a story** (don't just show features)
- **Emphasize impact** (sustainability + community)
- **Make it personal** ("Imagine you're an employee...")
- **Show confidence** (you built something amazing!)
- **Have fun** (magical theme is delightful!)

---

## 🪄 YOU'VE GOT THIS!

You built a full-stack AI application in a weekend. The datasets show real value. The UI is magical. The impact is clear.

**Now go transform that dark data into gold! ✨🏆**
