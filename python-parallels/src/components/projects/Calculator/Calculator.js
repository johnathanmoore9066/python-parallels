import React, { useState, useEffect } from 'react';
import { executePythonCode } from './pythonService';
import ConfirmationDialog from './ConfirmationDialog';
import './Calculator.css';

const Calculator = () => {
  // State for confirmation dialog
  const [showResetDialog, setShowResetDialog] = useState(false);

  // State for button values
  const [buttonValues, setButtonValues] = useState({
    '7': '7',
    '8': '8',
    '9': '9',
    '÷': '÷',
    '4': '4',
    '5': '5',
    '6': '6',
    '×': '×',
    '1': '1',
    '2': '2',
    '3': '3',
    '-': '-',
    '0': '0',
    '.': '.',
    '=': '=',
    '+': '+'
  });

  // State for calculator display
  const [display, setDisplay] = useState('0');
  const [currentNumber, setCurrentNumber] = useState('');
  const [operation, setOperation] = useState(null);
  const [previousNumber, setPreviousNumber] = useState(null);
  const [isCalculatorEnabled, setIsCalculatorEnabled] = useState(false);

  // State for test cases
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      description: "Assign variables to all calculator numbers (one, two, three, etc.)",
      completed: false,
      type: "variable_assignment",
      hints: [
        "Start by assigning the number 1 to the variable 'one'",
        "Each variable name should match its value (e.g., 'two' should be 2)",
        "Make sure to assign all numbers from 0 to 9",
        "Remember to use integer values, not strings or decimals"
      ]
    },
    {
      id: 2,
      description: "Basic addition (2 + 2 = 4)",
      completed: false,
      type: "operation",
      hints: [
        "You'll need to use the variables you assigned earlier",
        "Try adding two numbers using the '+' operator",
        "Make sure to use the variables, not the numbers directly"
      ]
    }
  ]);

  // State for code execution feedback
  const [feedback, setFeedback] = useState('');
  
  // State for showing hints
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Function to handle calculator button clicks
  const handleButtonClick = (value) => {
    if (!isCalculatorEnabled) return;

    if (value === '=') {
      if (operation && previousNumber !== null) {
        const current = parseFloat(currentNumber);
        const prev = parseFloat(previousNumber);
        let result;

        switch (operation) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '×':
            result = prev * current;
            break;
          case '÷':
            result = prev / current;
            break;
          default:
            return;
        }

        setDisplay(result.toString());
        setCurrentNumber('');
        setOperation(null);
        setPreviousNumber(null);
        return;
      }
    }

    if (['+', '-', '×', '÷'].includes(value)) {
      if (currentNumber) {
        if (previousNumber === null) {
          setPreviousNumber(currentNumber);
        } else {
          const current = parseFloat(currentNumber);
          const prev = parseFloat(previousNumber);
          let result;

          switch (operation) {
            case '+':
              result = prev + current;
              break;
            case '-':
              result = prev - current;
              break;
            case '×':
              result = prev * current;
              break;
            case '÷':
              result = prev / current;
              break;
            default:
              return;
          }

          setPreviousNumber(result.toString());
        }
        setCurrentNumber('');
      }
      setOperation(value);
      return;
    }

    if (value === '.') {
      if (!currentNumber.includes('.')) {
        setCurrentNumber(prev => prev + '.');
      }
      return;
    }

    setCurrentNumber(prev => prev + value);
    setDisplay(prev => prev === '0' ? value : prev + value);
  };

  // Function to update button values from Python code
  const updateButtonValues = (newValues) => {
    setButtonValues(prev => ({
      ...prev,
      ...newValues
    }));
  };

  // Function to reset the calculator
  const handleReset = () => {
    setShowResetDialog(true);
  };

  // Function to confirm reset
  const confirmReset = () => {
    // Reset button values to default
    setButtonValues({
      '7': '7',
      '8': '8',
      '9': '9',
      '÷': '÷',
      '4': '4',
      '5': '5',
      '6': '6',
      '×': '×',
      '1': '1',
      '2': '2',
      '3': '3',
      '-': '-',
      '0': '0',
      '.': '.',
      '=': '=',
      '+': '+'
    });

    // Reset calculator state
    setDisplay('0');
    setCurrentNumber('');
    setOperation(null);
    setPreviousNumber(null);
    setIsCalculatorEnabled(false);

    // Reset test cases
    setTestCases(prev => prev.map(test => ({
      ...test,
      completed: false
    })));

    // Clear feedback
    setFeedback('');
    
    // Clear code editor
    const codeEditor = document.querySelector('.code-editor');
    if (codeEditor) {
      codeEditor.value = '';
    }

    // Reset hints
    setShowHints(false);
    setCurrentHintIndex(0);

    // Close the dialog
    setShowResetDialog(false);
  };

  // Function to show next hint
  const showNextHint = () => {
    const currentTest = testCases.find(test => !test.completed);
    if (currentTest && currentTest.hints) {
      setShowHints(true);
      setCurrentHintIndex(prev => {
        if (prev >= currentTest.hints.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }
  };

  // Function to check variable assignments
  const checkVariableAssignments = async (code) => {
    try {
      const result = await executePythonCode(code);
      
      if (result.success) {
        const variables = result.variables;
        
        // Check if all variables are assigned numbers
        const allAssigned = Object.values(variables).every(val => typeof val === 'number');
        
        if (allAssigned) {
          // Check if each variable's value matches its name
          const numberMap = {
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
            zero: 0
          };

          // Update button values for any correct assignments
          const newValues = {};
          let hasCorrectAssignments = false;

          Object.entries(variables).forEach(([name, value]) => {
            if (value === numberMap[name]) {
              hasCorrectAssignments = true;
              // Map the variable name to the button number
              const buttonNumber = Object.entries(numberMap).find(([key]) => key === name)?.[1];
              if (buttonNumber !== undefined) {
                newValues[buttonNumber.toString()] = value;
              }
            }
          });

          // Update the calculator display with correct assignments
          if (hasCorrectAssignments) {
            updateButtonValues(newValues);
            setIsCalculatorEnabled(true);
            setFeedback('Some variables assigned correctly! Keep going...');
          }

          // Check if all variables are correctly assigned
          const mismatches = Object.entries(variables).filter(([name, value]) => {
            return value !== numberMap[name];
          });

          if (mismatches.length === 0) {
            // All variables are correctly assigned
            setTestCases(prev => prev.map(test => 
              test.type === 'variable_assignment' 
                ? { ...test, completed: true }
                : test
            ));
            setFeedback('Success! All variables assigned correctly.');
            
            // Clear the code editor after successful completion
            const codeEditor = document.querySelector('.code-editor');
            if (codeEditor) {
              codeEditor.value = '';
            }
          } else if (mismatches.length > 0) {
            const errorMessages = mismatches.map(([name, value]) => 
              `Variable '${name}' should be assigned to ${numberMap[name]}, not ${value}`
            );
            setFeedback(`Error: ${errorMessages.join('\n')}`);
          }
        } else {
          setFeedback('Error: All variables must be assigned integer values.');
        }
      } else {
        setFeedback(`Error: ${result.error}`);
      }
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    }
  };

  // Function to handle code execution
  const handleRunCode = async () => {
    const code = document.querySelector('.code-editor').value;
    if (!code.trim()) {
      setFeedback('Please enter some code first.');
      return;
    }
    setFeedback('Running code...');
    await checkVariableAssignments(code);
  };

  return (
    <div className="calculator-page">
      <div className="page-header">
        <h1>Calculator Project</h1>
        <p>Build a functional calculator using Python</p>
      </div>

      <div className="calculator-container">
        {/* Calculator Display */}
        <div className="calculator-display">
          <div className="calculator">
            <div className="display">{display}</div>
            <div className="buttons">
              <button onClick={() => handleButtonClick('7')}>{buttonValues['7']}</button>
              <button onClick={() => handleButtonClick('8')}>{buttonValues['8']}</button>
              <button onClick={() => handleButtonClick('9')}>{buttonValues['9']}</button>
              <button onClick={() => handleButtonClick('÷')}>{buttonValues['÷']}</button>
              <button onClick={() => handleButtonClick('4')}>{buttonValues['4']}</button>
              <button onClick={() => handleButtonClick('5')}>{buttonValues['5']}</button>
              <button onClick={() => handleButtonClick('6')}>{buttonValues['6']}</button>
              <button onClick={() => handleButtonClick('×')}>{buttonValues['×']}</button>
              <button onClick={() => handleButtonClick('1')}>{buttonValues['1']}</button>
              <button onClick={() => handleButtonClick('2')}>{buttonValues['2']}</button>
              <button onClick={() => handleButtonClick('3')}>{buttonValues['3']}</button>
              <button onClick={() => handleButtonClick('-')}>{buttonValues['-']}</button>
              <button onClick={() => handleButtonClick('0')}>{buttonValues['0']}</button>
              <button onClick={() => handleButtonClick('.')}>{buttonValues['.']}</button>
              <button onClick={() => handleButtonClick('=')}>{buttonValues['=']}</button>
              <button onClick={() => handleButtonClick('+')}>{buttonValues['+']}</button>
            </div>
          </div>
        </div>

        {/* Code Input Area */}
        <div className="code-input-area">
          <div className="code-header">
            <h2>Your Code</h2>
            <div className="code-controls">
              <button 
                className="hint-button"
                onClick={showNextHint}
              >
                Show Hint
              </button>
              <button 
                className="run-button"
                onClick={handleRunCode}
              >
                Run Code
              </button>
              <button 
                className="reset-button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
          <textarea
            placeholder="Write your Python code here..."
            className="code-editor"
          />
          {showHints && (
            <div className="hint-box">
              <p>{testCases.find(test => !test.completed)?.hints[currentHintIndex]}</p>
            </div>
          )}
          {feedback && (
            <div className={`feedback ${feedback.includes('Error') ? 'error' : 'success'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>

      {/* Test Tasks */}
      <div className="test-tasks">
        <h2>Test Cases</h2>
        <div className="test-list">
          {testCases.map(test => (
            <div key={test.id} className={`test-item ${test.completed ? 'completed' : 'incomplete'}`}>
              <span className="test-status">{test.completed ? '✓' : '✗'}</span>
              <span className="test-description">{test.description}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={confirmReset}
        message="Are you sure you want to reset? This will clear all your progress and code."
      />
    </div>
  );
};

export default Calculator; 