import React from 'react';
import '../styles/components/LoadingIndicator.css';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <LoadingSpinner />
      <div className="loading-text">Loading...</div>
    </div>
  );
}

export default LoadingIndicator;

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner" />
  )
}