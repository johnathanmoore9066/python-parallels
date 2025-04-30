import React from 'react';
import './Calculator.css';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>Confirm Reset</h3>
        <p>{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="dialog-button confirm" onClick={onConfirm}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog; 