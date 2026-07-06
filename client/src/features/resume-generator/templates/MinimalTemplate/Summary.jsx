import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';

export const Summary = ({ data }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
        Professional Summary
      </h2>
      <EditableNode 
        path="professionalSummary" 
        value={data?.value} 
        multiline={true} 
        tag="p"
        className="text-sm text-slate-800 leading-relaxed text-justify whitespace-pre-wrap"
        placeholder="Add professional summary..."
      />
    </div>
  );
};
