import React from 'react';
import { useEditorContext } from '../../contexts/EditorContext.jsx';

/**
 * Checks if a value is effectively present (truthy and not just empty whitespace).
 */
export const isPresent = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string' && val.trim() === '') return false;
  return true;
};

/**
 * Conditionally renders children if we are in Edit Mode OR if all the specified values are non-empty.
 * `when` can be a single value or an array of values.
 */
export const Show = ({ when, children, fallback = null }) => {
  const { isEditMode } = useEditorContext();
  
  const present = Array.isArray(when) 
    ? when.every(isPresent)
    : isPresent(when);

  if (isEditMode || present) {
    return <>{children}</>;
  }
  return fallback;
};

/**
 * A layout utility to join multiple elements with a delimiter.
 * Elements that are empty (falsy value and not in edit mode) are automatically omitted,
 * preventing dangling delimiters.
 * 
 * @param {Object[]} items - Array of objects: { value: any, element: ReactNode }
 * @param {ReactNode} separator - The element or string to use as a separator
 * @param {string} className - Optional container class
 * @param {Object} style - Optional container styles
 * @param {elementType} container - The container element (defaults to 'div', use React.Fragment for inline)
 */
export const Join = ({ separator, items = [], className = '', style = {}, container: Container = 'div' }) => {
  const { isEditMode } = useEditorContext();
  
  const validItems = items.filter(item => isPresent(item.value));
  const emptyItems = isEditMode ? items.filter(item => !isPresent(item.value)) : [];

  if (validItems.length === 0 && emptyItems.length === 0) return null;

  const content = [];

  // 1. Render valid items joined by separators
  validItems.forEach((item, i) => {
    content.push(<React.Fragment key={`valid-${i}`}>{item.element}</React.Fragment>);
    if (i < validItems.length - 1) {
      content.push(<React.Fragment key={`sep-${i}`}>{separator}</React.Fragment>);
    }
  });

  // 2. Render empty placeholders at the end without separators (Edit Mode only)
  if (emptyItems.length > 0) {
    emptyItems.forEach((item, i) => {
      content.push(
        <React.Fragment key={`empty-${i}`}>
          <span style={{ margin: '0 4px', display: 'inline-block' }}></span>
          {item.element}
        </React.Fragment>
      );
    });
  }

  if (Container === React.Fragment) {
    return <>{content}</>;
  }

  return (
    <Container className={className} style={style}>
      {content}
    </Container>
  );
};
