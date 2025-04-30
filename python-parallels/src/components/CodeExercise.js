import React, { useState } from 'react';
import './CodeExercise.css';

const CodeExercise = ({ exerciseId, starterCode = "# Write your code here" }) => {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleCodeChange = (event) =>import React, { useState, useEffect } from 'react';
  import AceEditor from 'react-ace';
  import 'ace-builds/src-noconflict/mode-python'; // Python syntax highlighting
  import 'ace-builds/src-noconflict/theme-github'; // Editor theme
  // import './PythonCodeEditor.css';
  
  const PythonCodeEditor = ({ 
    code = '', 
    onCodeChange = () => {}, 
    onRunResult = () => {},  // Add this prop
    showLineNumbers = false,
    className = ''
  }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(''); // Output from the code execution
    const [pyodide, setPyodide] = useState(null); // Pyodide instance
    const [isLoading, setIsLoading] = useState(true); // Loading state
  
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
  
    const handleCodeChange = (e) => {
      const newCode = e.target.value;
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
  
        // Run the user's code
        await pyodide.runPythonAsync(code);
  
        // Get the captured output
        const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
        const result = stdout || 'Code executed successfully!';
        
        setTimeout(() => {
          onRunResult(result); // Call the callback with the result
          setIsRunning(false);
        }, 500);
      } catch (error) {
        setOutput(`Error: ${error.message}`);
        setTimeout(() => {
          onRunResult(`Error: ${error.message}`); // Call the callback with the error
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
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
        
        <div className="editor-container">
          {showLineNumbers && (
            <div className="line-numbers">
              {code.split('\n').map((_, idx) => (
                <div key={idx} className="line-number">{idx + 1}</div>
              ))}
            </div>
          )}
          <textarea
            className="code-textarea"
            value={code}
            onChange={handleCodeChange}
            spellCheck="false"
          />
        </div>
      </div>
    );
  };
  
  export default PythonCodeEditor; {
    setCode(event.target.value);
  };

  const runCode = () => {
    setIsRunning(true);
    setHasRun(true);
    
    // This is a placeholder for actual code execution
    // In a real implementation, you'd send this to a backend or use a WASM Python interpreter
    
    setTimeout(() => {
      // Simulate output - in the real implementation this would be the actual output
      setOutput("Output will appear here after you run your code.");
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="code-exercise">
      <div className="code-editor-container">
        <div className="code-editor-header">
          <span>Python Code Editor</span>
          <button 
            className="run-button" 
            onClick={runCode} 
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>
        <textarea
          className="code-editor"
          value={code}
          onChange={handleCodeChange}
          spellCheck="false"
          placeholder="Write your Python code here..."
        />
      </div>
      
      {hasRun && (
        <div className="code-output">
          <div className="output-header">
            <span>Output</span>
          </div>
          <pre className="output-content">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeExercise;