import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Only one ErrorBoundary function should exist
function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    window.onerror = (msg, src, line, col, err) => {
      setError(err ? err.stack : msg);
    };
  }, []);
  if (error) return <pre style={{color:'red',padding:20}}>React error: {String(error)}</pre>;
  return children;
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);

