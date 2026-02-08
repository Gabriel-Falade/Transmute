import React from 'react';
import { useNavigate } from 'react-router-dom';
import './hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-container">
        <p className="hero-eyebrow">ESTABLISHED 2026</p>
        <h1 className="hero-title">
          Turning Dark Data into <span className="accent">Digital Gold</span>
        </h1>
        <p className="hero-subtitle">
          Advanced analytics and visualization for the modern web.
          Built with precision, powered by alchemy.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navigate('/upload')}>
            Start Uploading 🪄
          </button>
          <button className="btn-secondary" onClick={() => navigate('/analytics')}>
            View Current Stats
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;