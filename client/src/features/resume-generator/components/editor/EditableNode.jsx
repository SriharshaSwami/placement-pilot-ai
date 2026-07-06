import React, { useRef, useEffect } from 'react';
import { useEditorContext } from '../../contexts/EditorContext.jsx';

export const EditableNode = ({ 
  path, 
  value, 
  className = '', 
  style = {},
  tag = 'span', 
  placeholder = 'Add text...', 
  multiline = false 
}) => {
  const { activePath, setActivePath, updateData } = useEditorContext();
  const elementRef = useRef(null);
  
  const isActive = activePath === path;

  // We only update the DOM if we are NOT currently editing it, 
  // to prevent cursor jumping while typing.
  useEffect(() => {
    if (elementRef.current && elementRef.current !== document.activeElement) {
      elementRef.current.innerText = value || '';
    }
  }, [value]);

  // Scroll into view if this node becomes active (e.g. from AI Suggestion click or Editor click)
  useEffect(() => {
    if (isActive && elementRef.current && elementRef.current !== document.activeElement) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  const handleFocus = () => {
    setActivePath(path);
  };

  const handleBlur = (e) => {
    const newValue = e.target.innerText.trim();
    if (newValue !== value) {
      updateData(path, newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      elementRef.current.blur();
    }
  };

  const Component = tag;

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      className={`
        outline-none transition-colors duration-150 relative
        ${(!value && isActive) ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:opacity-50' : ''}
        print:border-none print:hover:border-none print:bg-transparent print:hover:bg-transparent print:empty:before:content-none
        hover:bg-primary-50 hover:ring-2 hover:ring-primary-200 hover:ring-inset dark:hover:bg-primary-900/30 dark:hover:ring-primary-800
        focus:bg-white focus:ring-2 focus:ring-primary-500 focus:ring-inset dark:focus:bg-slate-900 dark:focus:ring-primary-600
        ${isActive ? 'ring-2 ring-primary-400 ring-inset bg-primary-50/50 dark:bg-primary-900/20 dark:ring-primary-700' : ''}
        ${className}
      `}
      data-placeholder={placeholder}
      onClick={(e) => {
        // Prevent default link behavior if wrapping links
        if (tag === 'a') e.preventDefault();
        e.stopPropagation();
        setActivePath(path);
      }}
    >
      {/* Intentionally left empty. React shouldn't manage innerText of contentEditable directly. */}
    </Component>
  );
};
