import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false, isLoading = false }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={isLoading}>{cancelText}</button>
                    <button 
                        className={`btn-confirm ${isDestructive ? 'btn-destructive' : 'btn-primary'}`} 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
