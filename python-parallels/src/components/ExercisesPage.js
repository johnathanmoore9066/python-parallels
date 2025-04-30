import React from 'react';
import { Link } from 'react-router-dom';
import './ExercisesPage.css';

const ExercisesPage = () => {
  // Hard-coded array of chapters based on your roadmap
  const chapters = [
    { number: 1, title: "Your First Expression" },
    { number: 2, title: "The Building Blocks of Thought" },
    { number: 3, title: "The Flow of Logic" },
    { number: 4, title: "Collections of Knowledge" },
    { number: 5, title: "Modular Thinking" },
    { number: 6, title: "The Art of Memory" },
    { number: 7, title: "Object-Oriented Thinking" },
    { number: 8, title: "Advanced Patterns" },
    { number: 9, title: "The Standard Library" },
    { number: 10, title: "Data and Knowledge" },
    { number: 11, title: "Web and Connection" },
    { number: 12, title: "Quality and Testing" },
    { number: 13, title: "Parallel Processing" },
    { number: 14, title: "Specialized Applications" },
    { number: 15, title: "Best Practices and Beyond" }
  ];

  return (
    <div className="exercises-page">
      <div className="header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Python Parallels: Exercises</h1>
        <p className="subtitle">Select a chapter to view its exercises</p>
      </div>

      <div className="chapter-cards-container">
        {chapters.map(chapter => (
          <div key={chapter.number} className="chapter-card">
            <div className="chapter-number">{chapter.number}</div>
            <h2 className="chapter-title">{chapter.title}</h2>
            <p className="exercises-status">
              {chapter.number === 1 ? 
                "Exercises coming soon" : 
                "Locked - Complete previous chapters"}
            </p>
            <Link 
              to={chapter.number === 1 ? `/exercises/chapter/1` : "#"} 
              className={`chapter-card-button ${chapter.number !== 1 ? 'disabled' : ''}`}
              onClick={e => {
                if (chapter.number !== 1) e.preventDefault();
              }}
            >
              {chapter.number === 1 ? "View Exercises" : "Locked"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;