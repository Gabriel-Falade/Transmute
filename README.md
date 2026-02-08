# Transmute 🪄

**Transform Dark Data into Digital Gold**

Built for UGAHacks 2026 | Georgia Institute of Technology

---

## 👥 Team Members

- **Gabriel Falade** - Georgia Tech
- **Toye Oni** - Georgia Tech

---

## 🎯 Project Purpose

Organizations drown in **"dark data"** - scattered documents with contradictory information that waste time, cause confusion, and lead to poor decisions. Employees spend hours searching for accurate information, often relying on outdated policies or conflicting guidance.

**Transmute** solves this problem by automatically:
- 📊 Analyzing document collections to build knowledge graphs
- ⚠️ Detecting contradictions between documents
- 🔍 Identifying obsolete information
- 📝 Generating comprehensive wiki summaries
- 💬 Answering questions through an AI-powered chatbot

### Impact Areas
- **Sustainability**: Reduces cognitive load and wasted effort searching for information
- **Community**: Makes public policy documents clear and accessible, improving democracy and public safety
- **Efficiency**: Saves organizations time and money by surfacing contradictions before they cause problems

---

## ✨ Features

- **📤 Document Upload**: Batch upload documents via ZIP files
- **📊 Analytics Dashboard**: View processed documents, contradictions, and relationships
- **🕸️ Interactive Graph Visualization**: Explore document relationships with clickable nodes
- **📖 AI-Generated Wiki**: Comprehensive synthesis of all uploaded documents
- **💬 RAG-Powered Chatbot**: Ask questions and get answers grounded in your documents
- **🌓 Dark/Light Mode**: Comfortable viewing in any environment
- **🔄 Real-time Processing**: Automatic analysis as documents are uploaded

---

## 🛠️ Technologies Utilized

### Frontend
- **React** (v19.2.4) - UI framework
- **React Router DOM** (v7.13.0) - Client-side routing
- **React Markdown** (v10.1.0) - Wiki content rendering
- **CSS3** - Custom styling and animations

### Backend
- **Python 3** - Core backend language
- **Flask** - Web application framework
- **Flask-CORS** - Cross-origin resource sharing

### AI/Machine Learning
- **Google Gemini API** (gemini-2.0-flash) - LLM for:
  - Contradiction detection
  - Wiki generation
  - Document Q&A chatbot
  - Obsolete document identification
- **Sentence Transformers** (all-MiniLM-L6-v2) - Semantic embeddings
- **scikit-learn** - Cosine similarity calculations
- **NumPy** - Numerical operations

### Data Processing
- **JSON** - Data persistence (documents, graph, metrics)
- **python-dotenv** - Environment variable management

### Architecture
- **Knowledge Graphs** - Document relationship modeling
- **RAG (Retrieval-Augmented Generation)** - Semantic search + LLM
- **REST API** - Flask backend serving React frontend

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd data-alchemist
```

2. **Set up Backend**
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "GEMINI_MODEL=gemini-2.0-flash" >> .env
```

3. **Set up Frontend**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start Backend Server** (Terminal 1)
```bash
cd backend
python app.py
```
Server runs on `http://localhost:5000`

2. **Start Frontend** (Terminal 2)
```bash
cd client
npm start
```
Application opens at `http://localhost:3000`

### Demo Datasets

Ready-to-use demo datasets are available in `backend/demo-datasets/`:
- **corporate-chaos.zip** - 19 corporate documents with cloud provider, remote work, and sustainability contradictions
- **city-council.zip** - 11 municipal documents with climate and transportation policy conflicts
- **live-demo.zip** - 6 simple documents for quick testing

Simply upload any ZIP file through the Upload page!

---

## 📖 Usage

1. **Upload Documents**: Navigate to Upload page, drag & drop a ZIP file containing markdown documents
2. **View Analytics**: See all processed documents, contradictions detected, and statistics
3. **Explore Graph**: Visualize document relationships, click nodes to see connections
4. **Read Wiki**: AI-generated summary synthesizing all documents
5. **Ask Questions**: Use the chatbot to query your document collection

---

## 🐛 Problems Encountered & Solutions

### Problem 1: Graph Data Structure Mismatch
**Issue**: Frontend expected `from`/`to` fields for edges, but backend generated `source`/`target` fields.

**Solution**:
- Updated backend graph generation to use consistent field names
- Added normalization layer in frontend to handle both formats
- Fixed edge rendering logic in visualize.jsx

### Problem 2: Wiki Generation Failures
**Issue**: KeyError exceptions when accessing document relationships and insight structures.

**Solution**:
- Debugged by running `python generate_wiki.py` directly to see error traces
- Updated code to match actual JSON structure (e.g., `nodes` array instead of `doc1`/`doc2` fields)
- Fixed contradiction and obsolete document field references

### Problem 3: Insight Structure Inconsistency
**Issue**: Analytics page couldn't match documents to insights due to field name mismatches.

**Solution**:
- Standardized insight structure across backend
- Updated frontend to use correct field names (`nodes` for contradictions, `obsolete_doc` for obsolete documents)
- Added defensive checks to handle missing fields gracefully

### Problem 4: Node Overlap in Visualization
**Issue**: Text labels overlapped when nodes were too close together.

**Solution**:
- Increased circular layout radius from 200 to 280 pixels
- Adjusted text label positioning from y+45 to y+55
- Expanded SVG viewBox from 600 to 700 height
- Recentered graph (centerY 300→340) for better balance

### Problem 5: Missing Connected Node Navigation
**Issue**: Users couldn't easily explore relationships between connected documents.

**Solution**:
- Implemented `getConnectedNodes()` function to find all connected documents
- Added interactive "Connected Documents" section in sidebar
- Color-coded relationship types with clickable navigation
- Added smooth hover effects for better UX

---

## 🙏 Credits & Acknowledgments

### APIs & Services
- **Google Gemini API** - Large language model for contradiction detection, wiki generation, and chatbot functionality
  - [Google AI Studio](https://makersuite.google.com/)
- **Hugging Face** - Sentence Transformers model hosting
  - Model: `sentence-transformers/all-MiniLM-L6-v2`

### Frameworks & Libraries

**Frontend:**
- [React](https://react.dev/) - Meta Platforms, Inc.
- [React Router](https://reactrouter.com/) - Remix Software Inc.
- [React Markdown](https://github.com/remarkjs/react-markdown) - Titus Wormer

**Backend:**
- [Flask](https://flask.palletsprojects.com/) - Pallets Projects
- [Sentence Transformers](https://www.sbert.net/) - UKP Lab, TU Darmstadt
- [scikit-learn](https://scikit-learn.org/) - scikit-learn developers
- [NumPy](https://numpy.org/) - NumPy Developers

**Development:**
- [Create React App](https://create-react-app.dev/) - Meta Platforms, Inc.
- [python-dotenv](https://github.com/theskumar/python-dotenv) - Saurabh Kumar

### Inspiration
This project was inspired by the need to make organizational knowledge accessible, reduce information overload, and help teams stay aligned despite constantly changing documentation.

---

## 📄 License

This project was created for UGAHacks 2026. All rights reserved by the team members.

---

## 🏆 Built with ❤️ for UGAHacks 2026

*Transform dark data into knowledge gold* ✨

---

## 📞 Contact

For questions or collaboration opportunities:
- Gabriel Falade - Georgia Institute of Technology
- Toye Oni - Georgia Institute of Technology

**Project Repository**: [GitHub](your-github-link)

---

**Made with Claude Code** 🤖
