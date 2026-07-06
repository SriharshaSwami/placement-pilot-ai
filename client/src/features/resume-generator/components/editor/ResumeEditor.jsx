import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { EDITOR_SCHEMA } from '../../config/editorSchema.js';
import { useEditorContext } from '../../contexts/EditorContext.jsx';

const SectionAccordion = ({ title, children, defaultOpen = false, isActive = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  React.useEffect(() => {
    if (isActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isActive]);

  return (
    <div className={`border rounded-lg mb-4 bg-white dark:bg-slate-800 overflow-hidden shadow-sm transition-colors duration-300 ${isActive ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-700'}`}>
      <button 
        className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors ${isActive ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
      </button>
      {isOpen && <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">{children}</div>}
    </div>
  );
};

const TextInput = ({ label, value, onChange, placeholder, type = "text", multiline = false, isActive = false }) => {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  const activeClasses = isActive ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50/30' : 'ring-1 ring-slate-300 dark:ring-slate-600 border-0';

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className={`text-sm font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</label>}
      {multiline ? (
        <textarea 
          ref={inputRef}
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className={`rounded-md py-1.5 px-3 text-slate-900 ring-inset focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-white min-h-[100px] transition-all ${activeClasses}`}
        />
      ) : (
        <input 
          ref={inputRef}
          type={type}
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className={`rounded-md py-1.5 px-3 text-slate-900 ring-inset focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-white transition-all ${activeClasses}`}
        />
      )}
    </div>
  );
};

export const ResumeEditor = React.memo(({ data, onChange }) => {
  const { activePath, setActivePath } = useEditorContext();
  if (!data) return null;

  // --- Core State Mutators ---
  
  const updateField = (path, value, isSimple = false) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (Array.isArray(current[k])) {
        current[k] = [...current[k]];
      } else {
        current[k] = current[k] ? { ...current[k] } : {};
      }
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    if (isSimple) {
      current[lastKey] = value;
    } else {
      current[lastKey] = { ...current[lastKey], value };
    }
    
    onChange(newData);
  };

  const addArrayItem = (path, emptyItem) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      current[k] = Array.isArray(current[k]) ? [...current[k]] : (current[k] ? { ...current[k] } : {});
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    if (!current[lastKey]) current[lastKey] = [];
    current[lastKey] = [...current[lastKey], emptyItem];
    
    onChange(newData);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      current[k] = Array.isArray(current[k]) ? [...current[k]] : { ...current[k] };
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = [...current[lastKey]];
    current[lastKey].splice(index, 1);
    
    onChange(newData);
  };

  const moveArrayItem = (path, index, direction) => {
    if (direction === 'up' && index === 0) return;
    
    const keys = path.split('.');
    const newData = { ...data };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      current[k] = Array.isArray(current[k]) ? [...current[k]] : { ...current[k] };
      current = current[k];
    }
    
    const lastKey = keys[keys.length - 1];
    const arr = [...current[lastKey]];
    
    if (direction === 'down' && index === arr.length - 1) return;
    
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = arr[index];
    arr[index] = arr[swapIndex];
    arr[swapIndex] = temp;
    
    current[lastKey] = arr;
    onChange(newData);
  };

  // Specific for String Arrays (e.g. responsibilities)
  const addStringArrayItem = (path, arrayIndex, field) => {
    const newArray = [...(data[path] || [])];
    if (!newArray[arrayIndex][field]) newArray[arrayIndex][field] = [];
    newArray[arrayIndex] = {
      ...newArray[arrayIndex],
      [field]: [...newArray[arrayIndex][field], { value: '', confidence: 100 }]
    };
    onChange({ ...data, [path]: newArray });
  };

  const updateStringArrayItem = (path, arrayIndex, field, stringIndex, value) => {
    const newArray = [...(data[path] || [])];
    const newStrings = [...newArray[arrayIndex][field]];
    newStrings[stringIndex] = { ...newStrings[stringIndex], value };
    newArray[arrayIndex] = {
      ...newArray[arrayIndex],
      [field]: newStrings
    };
    onChange({ ...data, [path]: newArray });
  };

  const removeStringArrayItem = (path, arrayIndex, field, stringIndex) => {
    const newArray = [...(data[path] || [])];
    const newStrings = [...newArray[arrayIndex][field]];
    newStrings.splice(stringIndex, 1);
    newArray[arrayIndex] = {
      ...newArray[arrayIndex],
      [field]: newStrings
    };
    onChange({ ...data, [path]: newArray });
  };

  // --- Skills Specific ---
  const updateSkillCategory = (category, commaStr) => {
    const arr = commaStr.split(',').map(s => ({ value: s.trim(), confidence: 100 })).filter(s => s.value);
    onChange({
      ...data,
      skills: { ...data.skills, [category]: arr }
    });
  };

  const getSkillCategoryString = (category) => {
    return (data.skills?.[category] || []).map(s => s.value).join(', ');
  };

  // --- Recursive Renderers ---

  const renderField = (field, basePath, itemData, isSimple = false) => {
    const valuePath = basePath ? `${basePath}.${field.key}` : field.key;
    const val = isSimple ? itemData?.[field.key] : itemData?.[field.key]?.value;
    const isActive = activePath === valuePath;
    
    return (
      <TextInput 
        key={field.key}
        label={field.label}
        type={field.type === 'email' ? 'email' : 'text'}
        multiline={field.type === 'multiline'}
        value={val}
        isActive={isActive}
        onChange={(v) => {
          updateField(valuePath, v, isSimple);
          if (activePath !== valuePath) setActivePath(valuePath);
        }}
      />
    );
  };

  const renderStringArray = (field, basePath, arrayIndex, itemData) => {
    const items = itemData[field.key] || [];
    return (
      <div key={field.key} className="mt-4 border-t border-slate-100 dark:border-slate-700/50 pt-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">{field.label}</label>
        <div className="space-y-2">
          {items.map((item, sIdx) => (
            <div key={sIdx} className="flex gap-2">
              <div className="flex-1">
                <TextInput 
                  value={item.value} 
                  onChange={(v) => updateStringArrayItem(basePath, arrayIndex, field.key, sIdx, v)} 
                  multiline={true}
                />
              </div>
              <button onClick={() => removeStringArrayItem(basePath, arrayIndex, field.key, sIdx)} className="mt-6 text-slate-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={() => addStringArrayItem(basePath, arrayIndex, field.key)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>
    );
  };

  const renderSchemaSection = (section, index) => {
    if (section.type === 'object') {
      const objData = data[section.key] || {};
      const isSectionActive = activePath?.startsWith(section.key);
      return (
        <SectionAccordion key={section.key} title={section.title} defaultOpen={index === 0} isActive={isSectionActive}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map(f => (
              <div key={f.key} className={f.col ? "" : "md:col-span-2"}>
                {renderField(f, section.key, objData, false)}
              </div>
            ))}
          </div>
        </SectionAccordion>
      );
    }

    if (section.type === 'field') {
      const objData = data[section.key] || {};
      const isSectionActive = activePath === section.key;
      return (
        <SectionAccordion key={section.key} title={section.title} isActive={isSectionActive}>
          <TextInput 
            label={section.label} 
            value={objData.value} 
            isActive={isSectionActive}
            onChange={(v) => {
              updateField(section.key, v, false);
              if (!isSectionActive) setActivePath(section.key);
            }} 
            multiline={section.fieldType === 'multiline'} 
          />
        </SectionAccordion>
      );
    }

    if (section.type === 'skills') {
      const isSectionActive = activePath?.startsWith('skills');
      return (
        <SectionAccordion key={section.key} title={section.title} isActive={isSectionActive}>
          <div className="space-y-4">
            <p className="text-xs text-slate-500 mb-2">Enter skills separated by commas.</p>
            {['languages', 'frameworks', 'libraries', 'databases', 'cloud', 'devOps', 'tools', 'other'].map(cat => (
              <TextInput 
                key={cat} 
                label={cat.charAt(0).toUpperCase() + cat.slice(1)} 
                value={getSkillCategoryString(cat)} 
                onChange={(v) => updateSkillCategory(cat, v)} 
              />
            ))}
          </div>
        </SectionAccordion>
      );
    }

    if (section.type === 'array' || section.type === 'array-simple') {
      const isSimple = section.type === 'array-simple';
      
      // Resolve deeply nested arrays like candidate.links
      const keys = section.key.split('.');
      let arrData = data;
      for (const k of keys) {
        if (!arrData) break;
        arrData = arrData[k];
      }
      arrData = arrData || [];

      const isSectionActive = activePath?.startsWith(section.key);
      return (
        <SectionAccordion key={section.key} title={section.title} isActive={isSectionActive}>
          {arrData.map((item, idx) => {
            const isItemActive = activePath?.startsWith(`${section.key}.${idx}`);
            return (
            <div key={idx} className={`p-4 border rounded-lg relative mb-4 transition-colors ${isItemActive ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/30' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'}`}>
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button onClick={() => moveArrayItem(section.key, idx, 'up')} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveArrayItem(section.key, idx, 'down')} disabled={idx === arrData.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button onClick={() => removeArrayItem(section.key, idx)} className="p-1 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {section.fields.map(f => {
                  if (f.type === 'string-array') {
                    return <div key={f.key} className="md:col-span-2">{renderStringArray(f, section.key, idx, item)}</div>;
                  }
                  return (
                    <div key={f.key} className={f.col ? "" : "md:col-span-2"}>
                      {renderField(f, `${section.key}.${idx}`, item, isSimple)}
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}
          <button 
            onClick={() => addArrayItem(section.key, section.defaultItem)}
            className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-700 hover:border-slate-400 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add {section.itemTitle}
          </button>
        </SectionAccordion>
      );
    }

    return null;
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-20 custom-scrollbar">
      {EDITOR_SCHEMA.map((section, index) => renderSchemaSection(section, index))}
    </div>
  );
});
