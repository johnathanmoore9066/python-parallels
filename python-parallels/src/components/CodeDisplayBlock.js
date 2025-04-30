import React, { useEffect, useRef } from 'react';
import './CodeDisplayBlock.css';

const CodeDisplayBlock = ({ 
  code = '', 
  showLineNumbers = false,
  className = ''
}) => {
  const lines = code.split('\n');
  const containerRef = useRef(null);
  
  // Adjust container height based on content if needed
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Ensure minimum height for small code blocks
      // For larger code blocks, let CSS handle it
      const lineCount = lines.length;
      if (lineCount > 50) {
        // For very large code examples, allow more space
        container.style.minHeight = `${Math.min(lineCount * 24, 90)}vh`;
      }
    }
  }, [lines.length, code]);
  
  // Format the lines to highlight comments only
  const formattedLines = lines.map(line => {
    // Find comment start position (if any)
    const commentIndex = line.indexOf('#');
    
    if (commentIndex !== -1) {
      // Split the line into code and comment
      const codePart = line.substring(0, commentIndex);
      const commentPart = line.substring(commentIndex);
      
      // Return the line with the comment wrapped in a span
      return (
        <>
          {codePart}<span className="comment">{commentPart}</span>
        </>
      );
    }
    
    // Return the line as is if no comment
    return line;
  });
  
  return (
    <div className={`code-display-block ${className}`} ref={containerRef}>
      <div className="editor-container">
        <pre className="code-block">
          <code>
            {formattedLines.map((formattedLine, index) => (
              <div key={index} className="code-line">
                {formattedLine}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplayBlock; 