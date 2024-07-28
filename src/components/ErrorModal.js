// components/ErrorModal.js
import React from 'react';
import './ErrorModal.css'; // Add your CSS styling

const ErrorModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>Continue</button>
            </div>
        </div>
    );
};

export default ErrorModal;
