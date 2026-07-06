import React from 'react';
import { EditableNode } from '../../components/editor/EditableNode.jsx';
import { SectionHeading } from './Header.jsx';

export const Summary = ({ data }) => {
  if (!data?.value) return null;
  return (
    <div style={{ marginBottom: '10px', pageBreakInside: 'avoid' }}>
      <SectionHeading title="Summary" />
      <EditableNode
        path="professionalSummary"
        value={data?.value}
        multiline={true}
        tag="p"
        className="whitespace-pre-wrap"
        style={{
          fontFamily: '"Arial", "Helvetica", sans-serif',
          fontSize: '9pt',
          color: '#1e293b',
          lineHeight: '1.55',
          textAlign: 'justify',
          margin: 0,
        }}
        placeholder="Add professional summary..."
      />
    </div>
  );
};
