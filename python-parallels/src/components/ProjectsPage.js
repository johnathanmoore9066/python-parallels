import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const projects = [
    {
      id: 1,
      title: "Calculator",
      description: "Build a functional calculator using Python and React",
      path: "/projects/calculator",
      status: "active"
    }
    // More projects can be added here
  ];

  return (
    <div className="projects-page">
      <div className="page-header">
        <Link to="/" className="back-home-link">← Back to Home</Link>
        <h1>Python Practical Projects</h1>
        <p className="tagline">Combine philosophical insights with practical implementations</p>
      </div>
      
      <div className="projects-container">
        {projects.map(project => (
          <Link to={project.path} key={project.id} className="project-card">
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span className={`project-status ${project.status}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage; 