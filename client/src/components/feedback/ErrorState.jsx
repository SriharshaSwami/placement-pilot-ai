import React from 'react';

export const ErrorState = ({ message }) => {
  return (
    <div className="p-4 border rounded-md">
      {message || 'ErrorState Component'}
    </div>
  );
};
