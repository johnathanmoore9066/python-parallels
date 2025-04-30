import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // We'll create this next

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero">
        <h1>Python Parallels</h1>
        <p className="tagline">Where code meets philosophy in a descent through programming reality</p>
      </div>
      
      <div className="options-container">
        <div className="option chapters-option">
          <h2>Chapters</h2>
          <p>Follow the spiral descent through programming concepts, paired with philosophical parallels.</p>
          <p className="subtle-warning">Begin with innocent excitement. End with existential debugging.</p>
          <Link to="/chapter/1" className="option-button">Begin Journey</Link>
        </div>
        
        <div className="option exercises-option">
          <h2>Exercises</h2>
          <p>Practice your skills through reflections, coding challenges, and philosophical explorations.</p>
          <p className="subtle-warning">Test your understanding, or what remains of it.</p>
          <Link to="/exercises" className="option-button">View Exercises</Link>
        </div>
        
        <div className="option projects-option">
          <h2>Projects</h2>
          <p>Apply your knowledge to build complete applications that span multiple concepts.</p>
          <p className="subtle-warning">Where theory meets practice, and reality fights back.</p>
          <Link to="/projects" className="option-button">Explore Projects</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;