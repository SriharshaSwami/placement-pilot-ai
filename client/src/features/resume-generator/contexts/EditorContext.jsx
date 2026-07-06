import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext(null);

export const EditorProvider = ({ children, onUpdateData }) => {
  const [activePath, setActivePath] = useState(null);

  const updateData = (path, value) => {
    if (onUpdateData) {
      onUpdateData(path, value);
    }
  };

  return (
    <EditorContext.Provider value={{ activePath, setActivePath, updateData }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    // Return a dummy context so templates can render without a provider (e.g. for simple testing)
    return { activePath: null, setActivePath: () => {}, updateData: () => {} };
  }
  return context;
};
