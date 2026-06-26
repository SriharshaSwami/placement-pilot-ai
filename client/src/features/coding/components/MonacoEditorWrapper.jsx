import Editor from '@monaco-editor/react';

export function MonacoEditorWrapper({ language, code, onChange }) {
  const languageMap = {
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java'
  };

  return (
    <div className="h-[600px] w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
      <Editor
        height="100%"
        defaultLanguage={languageMap[language] || 'javascript'}
        language={languageMap[language] || 'javascript'}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
