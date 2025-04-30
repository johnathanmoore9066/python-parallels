import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChapterPage from './components/ChapterPage';
import LandingPage from './components/LandingPage';
import ExercisesPage from './components/ExercisesPage';
import ChapterExercisesPage from './components/ChapterExercisesPage';
import ProjectsPage from './components/ProjectsPage';
import Calculator from './components/projects/Calculator/Calculator';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/chapter/:chapterNumber" element={<ChapterPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/chapter/:chapterNumber" element={<ChapterExercisesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/calculator" element={<Calculator />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;