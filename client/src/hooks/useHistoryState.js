import { useState, useCallback } from 'react';

/**
 * A custom hook to manage state with undo/redo capabilities.
 * 
 * @param {any} initialValue The initial state
 * @returns {Array} [state, set, undo, redo, canUndo, canRedo]
 */
export function useHistoryState(initialValue) {
  const [state, setState] = useState({
    past: [],
    present: initialValue,
    future: []
  });

  const set = useCallback((newPresent) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) {
        return currentState;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: [] 
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) return currentState;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const overwrite = useCallback((newPresent) => {
    setState({
      past: [],
      present: newPresent,
      future: []
    });
  }, []);

  return [
    state.present,
    set,
    {
      undo,
      redo,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      overwrite
    }
  ];
}
