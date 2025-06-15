import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['Write', 'Publish', 'Grow'];
  const typingSpeed = 150;
  const deleteSpeed = 100;
  const pauseTime = 1000;

  useEffect(() => {
    const animateText = () => {
      const currentWordFull = words[currentIndex];
      
      if (!isDeleting && currentWord === currentWordFull) {
        // Pause before starting to delete
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }

      if (isDeleting && currentWord === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
        return;
      }

      const timer = setTimeout(() => {
        setCurrentWord(prev => {
          if (isDeleting) {
            return prev.slice(0, -1);
          }
          return currentWordFull.slice(0, prev.length + 1);
        });
      }, isDeleting ? deleteSpeed : typingSpeed);

      return () => clearTimeout(timer);
    };

    animateText();
  }, [currentWord, currentIndex, isDeleting]);

  return (
    <div className="hero-container">
      <h1 className="hero-title">
        <span className="typing-text">{currentWord}</span>
      </h1>
      <p className="hero-subtitle">Welcome to CMS Magazine</p>
      <Link to="/register" className="btn-cta">
        Start Publishing
      </Link>
    </div>
  );
};

export default Hero;
