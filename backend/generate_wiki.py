"""
Transmute - Wiki Generator
Creates Wikipedia-style summary from knowledge graph
"""

import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
api_model = os.getenv("GEMINI_MODEL")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(api_model)

def load_graph():
    """Load the enhanced graph.json"""
    with open('graph.json', 'r') as f:
        return json.load(f)

def load_documents():
    """Load documents.json"""
    with open('documents.json', 'r') as f:
        return json.load(f)

def generate_wiki_summary(graph, documents):
    """
    Generate Wikipedia-style markdown summary using AI
    """

    # Sort documents by date for chronological context
    sorted_docs = sorted(documents, key=lambda d: d.get('date', 'unknown'))

    # Prepare detailed document summaries
    doc_summaries = []
    for doc in sorted_docs:
        # Get first 300 chars for better context
        preview = doc['content'][:300].replace('\n', ' ')
        doc_summaries.append(
            f"- **{doc['title']}** ({doc['date']}) - {doc['word_count']} words\n  {preview}..."
        )

    # Analyze relationships by type
    edges = graph.get('edges', [])
    rel_by_type = {}
    for edge in edges:
        rel_type = edge['type']
        if rel_type not in rel_by_type:
            rel_by_type[rel_type] = []
        rel_by_type[rel_type].append(edge)

    # Build relationship context
    rel_context = []
    for rel_type, rels in rel_by_type.items():
        rel_context.append(f"\n**{rel_type.upper()}** ({len(rels)} relationships):")
        for rel in rels[:5]:  # Show first 5 of each type
            # NOTE: Graph uses 'source' and 'target', not 'from' and 'to'
            from_doc = next((d for d in documents if d['id'] == rel['source']), None)
            to_doc = next((d for d in documents if d['id'] == rel['target']), None)
            if from_doc and to_doc:
                rel_context.append(
                    f"  • {from_doc['title']} → {to_doc['title']} (similarity: {rel.get('similarity', 0):.2f})"
                )

    # Prepare insights with details
    insights = graph.get('insights', [])
    contradictions = [i for i in insights if i['type'] == 'contradiction']
    obsolete = [i for i in insights if i['type'] == 'obsolete']

    contradiction_details = []
    for contra in contradictions:
        # NOTE: Contradictions use 'nodes' array and have title/date fields directly
        if 'nodes' in contra and len(contra['nodes']) >= 2:
            title1 = contra.get('doc1_title', 'Unknown')
            title2 = contra.get('doc2_title', 'Unknown')
            date1 = contra.get('doc1_date', 'unknown')
            date2 = contra.get('doc2_date', 'unknown')
            reason = contra.get('conflict_summary', contra.get('reason', 'Conflicting information detected'))
            contradiction_details.append(
                f"  • **{title1}** ({date1}) vs **{title2}** ({date2})\n"
                f"    Reason: {reason}"
            )

    obsolete_details = []
    for obs in obsolete:
        # NOTE: Obsolete insights use 'obsolete_doc' and have title/date fields directly
        if 'obsolete_doc' in obs:
            title = obs.get('obsolete_title', 'Unknown')
            date = obs.get('obsolete_date', 'unknown')
            reason = obs.get('reason', 'Superseded by newer information')
            obsolete_details.append(
                f"  • **{title}** ({date}) - {reason}"
            )

    # Calculate statistics
    total_words = sum(doc['word_count'] for doc in documents)
    date_range = f"{sorted_docs[0]['date']} to {sorted_docs[-1]['date']}" if len(sorted_docs) > 1 else sorted_docs[0]['date']

    # Build enhanced prompt
    prompt = f"""You are writing a comprehensive Wikipedia-style article that synthesizes a project's documentation into a cohesive knowledge base.

📊 **DATASET OVERVIEW**
- Total Documents: {len(documents)}
- Total Words: {total_words:,}
- Date Range: {date_range}
- Relationship Types: {len(rel_by_type)}
- Knowledge Clusters: {graph['metadata'].get('clusters', 0)}

📄 **DOCUMENTS** (chronologically ordered):
{chr(10).join(doc_summaries)}

🔗 **RELATIONSHIPS DISCOVERED**:
{chr(10).join(rel_context)}

⚠️ **CONTRADICTIONS FOUND** ({len(contradictions)} total):
{chr(10).join(contradiction_details) if contradiction_details else '  None detected'}

📦 **OBSOLETE INFORMATION** ({len(obsolete)} total):
{chr(10).join(obsolete_details) if obsolete_details else '  None detected'}

---

Create a Wikipedia-style article with the following structure:

# [Extract Project Name from Documents]

> *A comprehensive knowledge synthesis from {len(documents)} documents spanning {date_range}*

## Overview
Write a 2-3 paragraph introduction that:
- Explains what this project/initiative is about
- Summarizes the main themes across all documents
- Highlights the evolution of the project over time

## Timeline & Evolution
Create a chronological narrative showing:
- Key milestones and dates
- How decisions evolved over time
- Major turning points or changes in direction
Use the document dates to structure this chronologically.

## Key Decisions & Architecture
Synthesize the major decisions made:
- Technology choices (databases, frameworks, tools)
- Architecture patterns and design decisions
- Team structure or organizational changes
- Budget allocations or resource decisions
Group related decisions together logically.

## Contradictions & Pivots
If contradictions were found, explain:
- What changed and why (if evident from documents)
- Timeline of the contradiction (old decision → new decision)
- Impact or reasoning for the pivot
Present this as a narrative, not just a list.

## Knowledge Evolution
Explain how the documentation evolved:
- Which documents superseded others
- How understanding deepened over time
- What information became obsolete and why
This should tell the story of how knowledge changed.

## Current State
Based on the most recent documents:
- What is the current status of the project?
- What are the active decisions in place?
- What seems to be the current direction?

## Document Map
Create a structured list of all documents organized by theme or category:
- Group related documents together
- Include dates and brief (1 sentence) descriptions
- Show relationships between documents when relevant

## Statistics
- Total documents analyzed: {len(documents)}
- Total content: {total_words:,} words
- Relationships mapped: {len(edges)}
- Contradictions identified: {len(contradictions)}
- Obsolete information flagged: {len(obsolete)}

---

**WRITING GUIDELINES:**
- Write in a encyclopedic, neutral tone (like Wikipedia)
- Create a cohesive narrative, not just summaries of individual documents
- Show connections and relationships between information
- Use proper markdown formatting (headers, lists, bold, links)
- Be factual and cite document titles when making specific claims
- Aim for ~800-1200 words total
- Make it feel like a single, unified knowledge base, not separate documents
- Use emojis sparingly only in section headers for visual appeal

**CRITICAL:** Synthesize information across documents to tell a coherent story. Don't just summarize each document separately - show how they relate, contradict, or build upon each other."""

    try:
        response = model.generate_content(prompt)
        wiki_content = response.text.strip()

        # Clean markdown if wrapped in code blocks
        if wiki_content.startswith('```'):
            wiki_content = wiki_content.split('```')[1]
            if wiki_content.startswith('markdown'):
                wiki_content = wiki_content[8:].strip()

        return wiki_content

    except Exception as e:
        print(f"Error generating wiki: {e}")
        return "# Error\n\nCould not generate wiki content."

def save_wiki(content):
    """Save wiki content to file"""
    with open('wiki.md', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    print("Transmute - Wiki Generator")
    print("=" * 60)

    print("\nLoading data...")
    graph = load_graph()
    documents = load_documents()

    print("Generating wiki summary with AI...")
    wiki = generate_wiki_summary(graph, documents)

    save_wiki(wiki)

    print(f"\n[SUCCESS] Wiki generated!")
    print(f"[SAVED] wiki.md ({len(wiki)} characters)")
    print("\nPreview:")
    print("-" * 60)
    print(wiki[:500] + "..." if len(wiki) > 500 else wiki)
    print("-" * 60)
