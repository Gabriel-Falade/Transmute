"""
Data Alchemist - Wiki Generator
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

    # Prepare context for AI
    doc_summaries = []
    for doc in documents:
        doc_summaries.append(f"- **{doc['title']}** ({doc['date']}): {doc['content'][:200]}...")

    # Prepare insights
    insights = graph.get('insights', [])
    contradictions = [i for i in insights if i['type'] == 'contradiction']
    obsolete = [i for i in insights if i['type'] == 'obsolete']

    # Build prompt
    prompt = f"""You are writing a Wikipedia-style article summarizing a project's documentation.

DOCUMENTS ({len(documents)} total):
{chr(10).join(doc_summaries)}

RELATIONSHIPS DISCOVERED:
{json.dumps(graph.get('edges', []), indent=2)}

KEY INSIGHTS:
- Contradictions: {len(contradictions)}
- Obsolete documents: {len(obsolete)}
- Clusters: {graph['metadata'].get('clusters', 0)}

Write a comprehensive Wikipedia-style article in MARKDOWN format with these sections:

# [Project Name]

## Overview
Brief introduction to the project based on the documents.

## Timeline
Chronological summary of key events and decisions (use dates from documents).

## Key Decisions
Major decisions made, including database choices, architecture, team changes.

## Contradictions & Changes
Highlight any contradicting information found between documents (e.g., MongoDB → PostgreSQL).

## Obsolete Information
List documents that have been superseded by newer information.

## Current Status
Summary of where things stand based on the latest documents.

## Related Documents
List all documents with brief descriptions.

---

IMPORTANT:
- Use proper markdown formatting (headers, lists, bold, etc.)
- Be factual and based only on the provided documents
- Highlight contradictions and changes clearly
- Keep it concise but informative (aim for ~500 words)
- Include dates where relevant
"""

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
    print("Data Alchemist - Wiki Generator")
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
