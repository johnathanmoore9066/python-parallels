import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python'; // Python syntax highlighting
import 'ace-builds/src-noconflict/theme-monokai'; // Dark theme option 1
import 'ace-builds/src-noconflict/theme-dracula'; // Dark theme option 2
import 'ace-builds/src-noconflict/theme-tomorrow_night'; // Dark theme option 3
import './ExerciseCodeEditor.css';

const ExerciseCodeEditor = ({ 
  code = '', 
  onCodeChange = () => {}, 
  onRunResult = () => {},
  showLineNumbers = true,
  className = ''
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(''); // Output from the code execution
  const [pyodide, setPyodide] = useState(null); // Pyodide instance
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [currentCode, setCurrentCode] = useState(code);
  
  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  // Load Pyodide when component mounts
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
        });
        setPyodide(pyodideInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        setOutput('Failed to load Python environment. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadPyodide();
  }, []);

  const handleCodeChange = (newCode) => {
    setCurrentCode(newCode);
    onCodeChange(newCode);
  };

  const runCode = async () => {
    setIsRunning(true);
    
    if (!pyodide) {
      setOutput('Python environment is not ready. Please wait...');
      setTimeout(() => {
        onRunResult('Python environment is not ready. Please wait...');
        setIsRunning(false);
      }, 500);
      return;
    }

    try {
      // Clear previous output
      setOutput('');
      
      // Redirect stdout to capture print statements
      await pyodide.runPythonAsync(`
        import io, sys
        sys.stdout = io.StringIO()
      `);

      // Run the CURRENT code (not the original code prop)
      await pyodide.runPythonAsync(currentCode);

      // Get the captured output
      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
      const result = stdout || 'Code executed successfully!';
      
      setOutput(result);
      setTimeout(() => {
        onRunResult(result); // Call the callback with the result
        setIsRunning(false);
      }, 500);
    } catch (error) {
      const errorMsg = `Error: ${error.message}`;
      setOutput(errorMsg);
      setTimeout(() => {
        onRunResult(errorMsg); // Call the callback with the error
        setIsRunning(false);
      }, 500);
    }
  };

  return (
    <div className={`python-code-editor ${className}`}>
      <div className="editor-header">
        <span>Python Code</span>
        <button 
          className="run-button" 
          onClick={runCode} 
          disabled={isRunning || isLoading}
        >
          {isLoading ? "Loading..." : isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
      
      <div className="editor-container">
        <AceEditor
          mode="python"
          theme="tomorrow_night" // Use this dark theme (or try "monokai" or "dracula")
          onChange={handleCodeChange}
          value={currentCode}
          name="python-code-editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            showLineNumbers: showLineNumbers,
            tabSize: 4,
            showPrintMargin: false, // Removes the vertical line
            highlightActiveLine: true,
            fontSize: 14,
            fontFamily: "'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            useWorker: false
          }}
          width="100%"
          height="250px"
        />
      </div>
      
      {output && (
        <div className="output-container">
          <div className="output-header">Output:</div>
          <pre className="output">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default ExerciseCodeEditor;