import React, { createContext, useContext, useState, useCallback } from 'react';
import './Snackbar.css';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
    const [snackbars, setSnackbars] = useState([]);

    const showSnackbar = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setSnackbars(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
        }, duration);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <div className="snackbar-container">
                {snackbars.map(snackbar => (
                    <div key={snackbar.id} className={`snackbar snackbar-${snackbar.type}`}>
                        {snackbar.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        )}
                        <span>{snackbar.message}</span>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
};
