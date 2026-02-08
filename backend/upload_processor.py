"""
Transmute - Upload Processor
Handles ZIP file uploads, extraction, and pipeline execution
"""

import os
import json
import shutil
import zipfile
import tempfile
import subprocess
from pathlib import Path
from sentence_transformers import SentenceTransformer
import re

# Lazy-load embedding model
_embedding_model = None

def get_embedding_model():
    """Lazy-load the embedding model"""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        print("Loading embedding model...")
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("[OK] Model loaded")
    return _embedding_model

def extract_zip(zip_path, extract_to):
    """Extract ZIP file to target directory"""
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        return True
    except Exception as e:
        print(f"Error extracting ZIP: {e}")
        return False

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file (basic implementation)"""
    try:
        # Try using PyPDF2 if available
        import PyPDF2
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
    except ImportError:
        # Fallback: just return filename as content
        return f"PDF Document: {Path(pdf_path).name}\n\n[PDF text extraction requires PyPDF2 library]"
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_metadata(content, filename):
    """Extract title and date from content"""
    # Extract title (first # heading or filename)
    title = None
    lines = content.split('\n')
    for line in lines:
        if line.startswith('# '):
            title = line.replace('# ', '').strip()
            break

    if not title:
        # Use filename as title
        title = Path(filename).stem.replace('-', ' ').replace('_', ' ').title()

    # Extract date from content
    date = None
    date_match = re.search(r'\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})', content)
    if date_match:
        date = date_match.group(1)
    else:
        # Try to extract from filename (YYYY-MM format)
        filename_date = re.match(r'(\d{4}-\d{2})-', filename)
        if filename_date:
            date = filename_date.group(1)
        else:
            date = "unknown"

    return title, date

def process_uploaded_files(upload_folder):
    """
    Process all text files from upload folder
    Supports: .md, .txt, .pdf
    Returns: documents list ready for embedding
    """
    documents = []
    supported_extensions = ['.md', '.txt', '.pdf']

    # Find all supported files recursively
    all_files = []
    for ext in supported_extensions:
        all_files.extend(Path(upload_folder).rglob(f'*{ext}'))

    if not all_files:
        return {"error": "No supported files found (.md, .txt, .pdf)"}

    print(f"Found {len(all_files)} files")

    # Load embedding model
    model = get_embedding_model()

    for idx, file_path in enumerate(all_files):
        try:
            print(f"[{idx+1}/{len(all_files)}] Processing: {file_path.name}")

            # Read content based on file type
            if file_path.suffix == '.pdf':
                content = extract_text_from_pdf(file_path)
            else:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

            # Skip empty files
            if not content.strip():
                print(f"  Skipping empty file")
                continue

            # Extract metadata
            title, date = extract_metadata(content, file_path.name)
            word_count = len(content.split())

            # Generate embedding
            embedding = model.encode(content).tolist()

            # Build document
            doc = {
                "id": f"doc_{idx+1}",
                "title": title,
                "date": date,
                "content": content,
                "word_count": word_count,
                "filename": file_path.name,
                "embedding": embedding
            }

            documents.append(doc)
            print(f"  [OK] {title}")

        except Exception as e:
            print(f"  [ERROR] Failed to process {file_path.name}: {e}")
            continue

    return documents

def run_pipeline():
    """
    Run the complete processing pipeline:
    1. Documents already processed (documents.json exists)
    2. Build knowledge graph
    3. Analyze for insights
    4. Calculate metrics
    """
    try:
        # Run build_graph.py
        print("\n[STEP 2/4] Building knowledge graph...")
        result = subprocess.run(['python', 'build_graph.py'],
                              capture_output=True, text=True, cwd='.')
        if result.returncode != 0:
            return {"error": f"Graph building failed: {result.stderr}"}

        # Run analyze.py
        print("\n[STEP 3/4] Analyzing for insights...")
        result = subprocess.run(['python', 'analyze.py'],
                              capture_output=True, text=True, cwd='.')
        if result.returncode != 0:
            return {"error": f"Analysis failed: {result.stderr}"}

        # Run metrics.py
        print("\n[STEP 4/4] Calculating metrics...")
        result = subprocess.run(['python', 'metrics.py'],
                              capture_output=True, text=True, cwd='.')
        if result.returncode != 0:
            return {"error": f"Metrics calculation failed: {result.stderr}"}

        print("\n[SUCCESS] Pipeline complete!")
        return {"success": True}

    except Exception as e:
        return {"error": f"Pipeline execution failed: {str(e)}"}

def process_upload(file_storage):
    """
    Main upload processing function
    1. Save uploaded file
    2. Extract ZIP
    3. Process documents
    4. Run pipeline
    5. Clean up temp files
    """
    temp_dir = None
    try:
        # Create temp directory
        temp_dir = tempfile.mkdtemp()

        # Save uploaded file
        zip_path = os.path.join(temp_dir, 'upload.zip')
        file_storage.save(zip_path)

        # Extract ZIP
        extract_folder = os.path.join(temp_dir, 'extracted')
        os.makedirs(extract_folder, exist_ok=True)

        if not extract_zip(zip_path, extract_folder):
            return {"error": "Failed to extract ZIP file"}

        # Process files and generate documents.json
        print("\n[STEP 1/4] Processing documents...")
        documents = process_uploaded_files(extract_folder)

        if isinstance(documents, dict) and 'error' in documents:
            return documents

        if not documents:
            return {"error": "No valid documents found in ZIP"}

        # Save documents.json
        with open('documents.json', 'w', encoding='utf-8') as f:
            json.dump(documents, f, indent=2)

        print(f"[OK] Saved {len(documents)} documents")

        # Run the pipeline
        pipeline_result = run_pipeline()

        if 'error' in pipeline_result:
            return pipeline_result

        # Return success with stats
        return {
            "success": True,
            "documents_processed": len(documents),
            "message": f"Successfully processed {len(documents)} documents"
        }

    except Exception as e:
        return {"error": f"Upload processing failed: {str(e)}"}

    finally:
        # Clean up temp directory
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
