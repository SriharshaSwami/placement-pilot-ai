import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, Loader2, Save, Undo2, Redo2, AlertCircle } from 'lucide-react';
import { getResume, patchResumeData } from '@/services/resume.service.js';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ResumeTemplateEngine } from '../components/ResumeTemplateEngine.jsx';
import { ResumeEditor } from '../components/editor/ResumeEditor.jsx';
import { useHistoryState } from '@/hooks/useHistoryState.js';
import { EditorProvider } from '../contexts/EditorContext.jsx';
import toast from 'react-hot-toast';

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState('editor');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => getResume(id),
  });

  const resume = data?.data;
  const initialStructuredData = resume?.parsedData?.structuredData;

  // Polyfill missing layout config for legacy resumes
  if (initialStructuredData && !initialStructuredData.layout) {
    initialStructuredData.layout = {
      sectionOrder: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications'],
    };
  }

  const [editableData, setEditableData, { undo, redo, canUndo, canRedo, overwrite }] =
    useHistoryState(null);

  useEffect(() => {
    if (initialStructuredData) {
      overwrite(initialStructuredData);
    }
  }, [initialStructuredData, overwrite]);

  const hasUnsavedChanges =
    initialStructuredData &&
    editableData &&
    JSON.stringify(editableData) !== JSON.stringify(initialStructuredData);

  const saveMutation = useMutation({
    mutationFn: (dataToSave) => patchResumeData(id, dataToSave),
    onSuccess: () => {
      toast.success('Edits saved successfully!');
      queryClient.invalidateQueries(['resume', id]);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to save edits');
    },
  });

  const handleSave = () => {
    if (!editableData) return;
    saveMutation.mutate(editableData);
  };

  const generateFilename = (format) => {
    const candidateName =
      editableData?.candidate?.name?.value?.replace(/\s+/g, '_') || 'Candidate';
    let roleStr = '';
    let companyStr = '';
    if (editableData?.experience?.length > 0) {
      const latestExp = editableData.experience[0];
      if (latestExp.role?.value) roleStr = `_${latestExp.role.value.replace(/\s+/g, '_')}`;
      if (latestExp.company?.value) companyStr = `_${latestExp.company.value.replace(/\s+/g, '_')}`;
    }
    const dateStr = new Date().toISOString().split('T')[0];
    return `${candidateName}${roleStr}${companyStr}_${dateStr}.${format}`;
  };

  const validateATS = (resumeData) => {
    const warnings = [];
    if (!resumeData?.candidate?.email?.value) warnings.push('Missing email address.');
    if (!resumeData?.candidate?.phone?.value) warnings.push('Missing phone number.');
    if (!resumeData?.experience?.length) warnings.push('No experience section found.');
    if (!resumeData?.education?.length) warnings.push('No education section found.');
    if (resumeData?.experience) {
      for (const exp of resumeData.experience) {
        if (exp.responsibilities) {
          for (const resp of exp.responsibilities) {
            if (resp.value && resp.value.split(/\s+/).length > 40) {
              warnings.push('One or more experience bullets are longer than 40 words.');
              break;
            }
          }
        }
      }
    }
    if (warnings.length > 0) {
      warnings.forEach((w) => toast.error(`ATS Warning: ${w}`, { icon: '⚠️', duration: 5000 }));
    }
  };

  // Array-aware path traversal for inline preview edits
  const handlePreviewEdit = (path, value) => {
    if (!editableData) return;
    const newData = { ...editableData };
    const keys = path.split('.');
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
    if (
      typeof current[lastKey] === 'object' &&
      current[lastKey] !== null &&
      'value' in current[lastKey]
    ) {
      current[lastKey] = { ...current[lastKey], value };
    } else {
      current[lastKey] = value;
    }
    setEditableData(newData);
  };

  const handleDownload = async (format = 'pdf') => {
    if (hasUnsavedChanges) {
      toast.error('Please save your changes before downloading.');
      return;
    }
    if (editableData) validateATS(editableData);
    if (isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/resumes/${id}/${format}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `Failed to generate ${format.toUpperCase()}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateFilename(format);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Resume downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Download failed. Please try again.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const hasValidData =
    initialStructuredData &&
    (initialStructuredData.candidate?.name?.value ||
      initialStructuredData.candidate?.email?.value ||
      initialStructuredData.experience?.length > 0 ||
      initialStructuredData.education?.length > 0);

  if (isLoading) return <LoadingSkeleton className="h-screen w-full" />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  if (!hasValidData) {
    return (
      <ErrorState message="No structured data found for this resume. Please parse the resume first by visiting Resume Details and clicking Reparse." />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden print:h-auto print:bg-white">

      {/* ── Top Navigation Bar ── */}
      <div className="flex-none bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm print:hidden z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: back + title */}
          <div className="flex items-center gap-4">
            <Link
              to={`/resume/${id}`}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                  {resume.title || 'Resume Preview'}
                </h1>
                {hasUnsavedChanges && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Unsaved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live Editing Mode</p>
            </div>
          </div>

          {/* Right: undo/redo + save + export */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saveMutation.isPending}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">Save Edits</span>
            </button>

            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading || hasUnsavedChanges}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={hasUnsavedChanges ? 'Save changes before downloading' : 'Download PDF'}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* ── Main Split Content ── */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible relative">
        <EditorProvider onUpdateData={handlePreviewEdit}>

          {/* Mobile tab switcher */}
          <div className="lg:hidden flex items-center justify-around border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 print:hidden z-20 absolute top-0 w-full shadow-sm">
            <button
              onClick={() => setActiveSidebarTab('editor')}
              className={`pb-1 font-semibold text-sm transition-colors border-b-2 ${activeSidebarTab === 'editor' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveSidebarTab('preview')}
              className={`pb-1 font-semibold text-sm transition-colors border-b-2 ${activeSidebarTab === 'preview' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500'}`}
            >
              Preview
            </button>
          </div>

          {/* Left: Resume Editor panel */}
          <div className={`w-full lg:w-[480px] xl:w-[500px] flex-none bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col print:hidden shadow-lg z-10 relative pt-12 lg:pt-0 ${activeSidebarTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex items-center justify-between p-4 pb-0 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-800 dark:text-white pb-3">Resume Editor</h2>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-1 mb-2">
                <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all shadow-sm disabled:shadow-none" title="Undo">
                  <Undo2 className="w-4 h-4" />
                </button>
                <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-all shadow-sm disabled:shadow-none" title="Redo">
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                <ResumeEditor data={editableData} onChange={setEditableData} />
              </div>
            </div>
          </div>

          {/* Right: Live Preview pane */}
          <div className={`flex-1 overflow-y-auto print:overflow-visible bg-slate-100 dark:bg-slate-900 p-8 pt-20 lg:pt-8 print:p-0 flex justify-center custom-scrollbar ${activeSidebarTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="transition-all duration-300 origin-top">
              <ResumeTemplateEngine structuredData={editableData} templateId="classic" />
            </div>
          </div>

        </EditorProvider>
      </div>

    </div>
  );
};

export default ResumePreview;
