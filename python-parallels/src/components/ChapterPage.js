import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PythonCodeEditor from './PythonCodeEditor';
import CodeDisplayBlock from './CodeDisplayBlock';

const ChapterPage = () => {
  const navigate = useNavigate();
  const { chapterNumber } = useParams();
  const [chapter, setChapter] = useState(null);
  const currentChapter = parseInt(chapterNumber) || 1;

  useEffect(() => {
    // Scroll to top when chapter changes
    window.scrollTo(0, 0);
    
    // Dynamically import the chapter data based on the chapter number
    const loadChapter = async () => {
      try {
        const chapterData = await import(`../data/chapter${currentChapter}.json`);
        setChapter(chapterData.default);
      } catch (error) {
        console.error('Failed to load chapter:', error);
        // Handle the error appropriately
      }
    };

    loadChapter();
  }, [currentChapter]); // Re-run when chapter number changes

  const handleNavigation = (direction) => {
    const nextChapter = currentChapter + 1;
    const prevChapter = currentChapter - 1;
    
    if (direction === 'next' && nextChapter <= 15) {
      navigate(`/chapter/${nextChapter}`);
    } else if (direction === 'prev' && prevChapter >= 1) {
      navigate(`/chapter/${prevChapter}`);
    }
  };

  if (!chapter) {
    return <div className="loading">Loading chapter...</div>;
  }

  return (
    <div className="chapter-page">
      <div className="chapter-navigation">
        <Link to="/" className="back-home-link">← Back to Home</Link>
        <div className="chapter-buttons">
          <button 
            onClick={() => handleNavigation('prev')} 
            disabled={currentChapter <= 1}
            className="nav-button prev-button"
          >
            ← Previous Chapter
          </button>
          <button 
            onClick={() => handleNavigation('next')} 
            disabled={currentChapter >= 15}
            className="nav-button next-button"
          >
            Next Chapter →
          </button>
        </div>
      </div>
      
      <h1>{chapter.title}</h1>
      
      {/* Render chapter sections */}
      {chapter.sections && chapter.sections.map((section, sIndex) => (
        <div key={sIndex} className="section">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
          
          {/* Render subsections if they exist */}
          {section.subsections && section.subsections.map((subsection, ssIndex) => (
            <div key={ssIndex} className="subsection">
              <h3>{subsection.title}</h3>
              <p>{subsection.content}</p>
              
              {/* Render philosophical connections */}
              {subsection.philosophicalConnection && (
                <div className="philosophical-connection">
                  <strong>Philosophical Connection:</strong> {subsection.philosophicalConnection}
                </div>
              )}
              
              {/* Render psychological insights */}
              {subsection.psychologicalInsight && (
                <div className="psychological-insight">
                  <strong>Psychological Insight:</strong> {subsection.psychologicalInsight}
                </div>
              )}
              
              {/* Render learning objectives */}
              {subsection.learningObjective && (
                <div className="learning-objective">
                  <strong>Learning Objective:</strong> {subsection.learningObjective}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      
{/* Render Exercises Section */}
{chapter.exercises && chapter.exercises.length > 0 && (
  <div className="section">
    <h2>Recommended Exercises</h2>
    
    {chapter.exercises.map((exercise, index) => (
      <div key={index} className={`subsection exercise-${exercise.type}`}>
        <h3>
          {exercise.type === 'reflection' ? 'Philosophical Reflection' : 
           exercise.type === 'practice' ? 'Practical Application' : 
           'Advanced Challenge'}
        </h3>
        <p>{exercise.prompt}</p>
        
        {exercise.hint && (
          <div className="exercise-hint">
            <strong>Consider this:</strong> {exercise.hint}
          </div>
        )}
      </div>
    ))}
  </div>
)}

{/* Render Code Examples Section */}
{chapter.codeExamples && chapter.codeExamples.length > 0 && (
  <div className="section">
    <h2>Code Examples</h2>
    
    {chapter.codeExamples.map((example, index) => (
      <div key={index} className="subsection code-example">
        <h3>{example.title}</h3>
        <CodeDisplayBlock 
          code={example.snippet} 
          showLineNumbers={false}
          className="chapter-code-example"
        />
      </div>
    ))}
  </div>
)}
      
      {/* Bottom navigation */}
      <div className="chapter-navigation bottom">
        <div className="chapter-buttons">
          <button 
            onClick={() => handleNavigation('prev')} 
            disabled={currentChapter <= 1}
            className="nav-button prev-button"
          >
            ← Previous Chapter
          </button>
          <button 
            onClick={() => handleNavigation('next')} 
            disabled={currentChapter >= 15}
            className="nav-button next-button"
          >
            Next Chapter →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;