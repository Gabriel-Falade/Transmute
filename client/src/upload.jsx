import React, { useState, useEffect } from 'react';
import './upload.css';

const Upload = ({ onThemeToggle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [spellComplete, setSpellComplete] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;

    if (files.length > 0) {
      castSpell(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      castSpell(files);
    }
  };

  const castSpell = (files) => {
    // Switch to dark mode for spell casting
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme !== 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }

    // Add ingredients (files) with animation
    const newIngredients = Array.from(files).map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      falling: true
    }));

    setIngredients(prev => [...prev, ...newIngredients]);
    setIsCasting(true);

    // Simulate spell completion
    setTimeout(() => {
      setIngredients(prev => prev.map(ing => ({ ...ing, falling: false })));
    }, 1500);

    setTimeout(() => {
      setSpellComplete(true);
      setTimeout(() => {
        setSpellComplete(false);
        setIsCasting(false);
      }, 3000);
    }, 2000);

    console.log("Spell cast with files:", files);
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h2>Spell Ingredients</h2>
          <p>Drop your documents into the cauldron to begin the alchemical transmutation 🪄</p>
        </div>

        <div className="cauldron-container">
          {/* Magical particles */}
          {isCasting && (
            <div className="magic-particles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }}></div>
              ))}
            </div>
          )}

          {/* Falling ingredients */}
          {ingredients.map(ingredient => (
            <div
              key={ingredient.id}
              className={`ingredient ${ingredient.falling ? 'falling' : 'dissolved'}`}
            >
              📄 {ingredient.name}
            </div>
          ))}

          {/* The Cauldron */}
          <div
            className={`cauldron ${isDragging ? 'ready' : ''} ${isCasting ? 'brewing' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="cauldron-rim"></div>
            <div className="cauldron-body">
              <div className="potion">
                {isCasting && (
                  <>
                    <div className="bubble b1"></div>
                    <div className="bubble b2"></div>
                    <div className="bubble b3"></div>
                    <div className="bubble b4"></div>
                    <div className="bubble b5"></div>
                  </>
                )}
              </div>
            </div>

            <div className="drop-zone-content">
              {!isCasting ? (
                <>
                  <div className="cauldron-icon">🪄</div>
                  <p>Drop Documents Here</p>
                  <span>or click to select files</span>
                </>
              ) : (
                <>
                  <div className="brewing-icon">✨</div>
                  <p>Brewing Spell...</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="file-input"
              multiple
              accept=".zip,.pdf,.txt,.md"
              onChange={handleFileSelect}
            />
          </div>

          {/* Spell complete animation */}
          {spellComplete && (
            <div className="spell-complete">
              <div className="spell-burst">✨</div>
              <p>Spell Cast Successfully!</p>
            </div>
          )}
        </div>

        <div className="upload-footer">
          <p>Supported: .zip, .pdf, .txt, .md</p>
          <p>Max size: 50MB per file</p>
        </div>

        {ingredients.length > 0 && !isCasting && (
          <div className="ingredients-list">
            <h3>Ingredients Added:</h3>
            <ul>
              {ingredients.map(ing => (
                <li key={ing.id}>{ing.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;