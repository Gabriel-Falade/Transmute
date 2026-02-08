"""
Transmute - RAG Chatbot
Semantic search + LLM for document Q&A
"""

import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Note: SentenceTransformer imported lazily in get_embedding_model()

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
api_model = os.getenv("GEMINI_MODEL")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(api_model)

# Lazy-load embedding model (only when first needed)
_embedding_model = None

def get_embedding_model():
    """Lazy-load the embedding model"""
    global _embedding_model
    if _embedding_model is None:
        # Import here to avoid loading at module import time
        from sentence_transformers import SentenceTransformer

        print("Loading embedding model for chatbot...")
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("[OK] Chatbot ready")
    return _embedding_model

def load_documents():
    """Load documents with embeddings"""
    with open('documents.json', 'r') as f:
        return json.load(f)

def semantic_search(question, documents, top_k=3):
    """
    Find most relevant documents using cosine similarity
    """
    # Get embedding model (lazy load)
    embedding_model = get_embedding_model()

    # Generate embedding for question
    question_embedding = embedding_model.encode(question)

    # Get document embeddings
    doc_embeddings = np.array([doc['embedding'] for doc in documents])

    # Calculate similarities
    similarities = cosine_similarity([question_embedding], doc_embeddings)[0]

    # Get top-k documents
    top_indices = np.argsort(similarities)[::-1][:top_k]

    relevant_docs = []
    for idx in top_indices:
        relevant_docs.append({
            'doc': documents[idx],
            'similarity': float(similarities[idx])
        })

    return relevant_docs

def answer_question(question, chat_history=None):
    """
    Answer question using RAG (Retrieval-Augmented Generation)

    Args:
        question: User's question
        chat_history: List of {role, content} messages (optional)

    Returns:
        {answer, sources}
    """
    documents = load_documents()

    # Find relevant documents
    relevant = semantic_search(question, documents, top_k=3)

    # Build context from relevant documents
    context_parts = []
    sources = []

    for item in relevant:
        doc = item['doc']
        context_parts.append(f"**{doc['title']}** ({doc['date']}):\n{doc['content']}\n")
        sources.append({
            'doc_id': doc['id'],
            'title': doc['title'],
            'date': doc['date'],
            'similarity': item['similarity']
        })

    context = "\n---\n".join(context_parts)

    # Build prompt for LLM
    system_prompt = """You are a helpful assistant that answers questions about project documents.

Use the provided document context to answer the question accurately.

If the answer is not in the context, say "I don't have enough information to answer that based on the available documents."

Keep answers concise but informative."""

    # Build chat messages
    messages = []

    # Add chat history if provided
    if chat_history:
        for msg in chat_history[-3:]:  # Last 3 messages for context
            messages.append(msg)

    # Add current question with context
    user_message = f"""CONTEXT FROM DOCUMENTS:
{context}

---

QUESTION: {question}

Please answer based on the context above."""

    full_prompt = f"{system_prompt}\n\n{user_message}"

    try:
        response = model.generate_content(full_prompt)
        answer = response.text.strip()

        return {
            'answer': answer,
            'sources': sources
        }

    except Exception as e:
        print(f"Error answering question: {e}")
        return {
            'answer': "Sorry, I encountered an error processing your question.",
            'sources': []
        }

# Test function
if __name__ == "__main__":
    print("\nTransmute - Chatbot Test")
    print("=" * 60)

    # Test questions
    test_questions = [
        "What database was chosen for the project?",
        "What were the budget changes?",
        "What contradictions exist in the documents?"
    ]

    for q in test_questions:
        print(f"\nQ: {q}")
        result = answer_question(q)
        print(f"A: {result['answer'][:200]}...")
        print(f"Sources: {[s['title'] for s in result['sources']]}")
