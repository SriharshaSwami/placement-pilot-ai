import React from 'react';

export const EmptyState = ({ message }) => {
  return (
    <div className="p-4 border rounded-md">
      {message || 'EmptyState Component'}
    </div>
  );
};
