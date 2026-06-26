import React from 'react';

export const Toast = ({ message }) => {
  return (
    <div className="p-4 border rounded-md">
      {message || 'Toast Component'}
    </div>
  );
};
