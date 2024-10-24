import React, { createContext, useState, useContext } from 'react';

// Create a context
const ErrorContext = createContext();

// Create a provider component
export const ErrorProvider = ({ children }) => {
    const [errMsg, alert] = useState("");

    return (
        <ErrorContext.Provider value={{ errMsg, alert }}>
            {children}
        </ErrorContext.Provider>
    );
};

// Custom hook to use the ErrorContext
export const useError = () => useContext(ErrorContext);
