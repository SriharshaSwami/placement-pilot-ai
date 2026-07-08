import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, Loader2, Save, Undo2, Redo2, AlertCircle, PanelLeftClose, PanelLeftOpen, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { getResume, patchResumeData } from '@/services/resume.service.js';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { ResumeLayoutEngine } from '../components/ResumeLayoutEngine.jsx';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const templateRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [exceedsOnePage, setExceedsOnePage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const [zoom, setZoom] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);

  useEffect(() => {
    if (!isAutoFit || !previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // A4 width ~794px, height ~1123px (subtract 64px for padding)
        const scaleX = (width - 64) / 794;
        const scaleY = (height - 64) / 1123;
        // Fit within container, max 1.5x zoom
        const fitScale = Math.min(scaleX, scaleY, 1.5);
        setZoom(fitScale > 0.1 ? fitScale : 0.1);
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [isAutoFit, activeSidebarTab]);



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

  // ResizeObserver logic has been moved to ResumeLayoutEngine

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
    const sanitize = (str) =>
      (str || '').replace(/[^a-zA-Z0-9 \-_]/g, '').trim().replace(/\s+/g, '_');

    // Prefer the candidate's actual name from parsed data
    const candidateName = sanitize(
      editableData?.candidate?.name?.value || resume?.title || 'Resume'
    );

    // Build a context tag from the resume title
    // e.g. "Tailored for Google" -> "_Tailored_Google"
    // e.g. resume title "SDE Intern" (different from candidate name) -> "_SDE_Intern"
    let context = '';
    const title = resume?.title || '';
    const tailoredMatch = title.match(/Tailored for (.+?)(?:\s*v\d+)?$/i);
    if (tailoredMatch) {
      context = `_Tailored_${sanitize(tailoredMatch[1])}`;
    } else if (title && sanitize(title) !== candidateName) {
      context = `_${sanitize(title)}`;
    }

    // Append today's date for uniqueness: e.g. 2025-07-08
    const today = new Date().toISOString().slice(0, 10);

    return `${candidateName}_Resume${context}_${today}.${format}`;
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

  const handleOptimizeFit = async () => {
    // This feature is being phased out in favor of manual editing for 100% exact WYSIWYG
    toast.error('Auto-optimization is deprecated. Please manually trim your content to fit one page.');
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
        { credentials: 'include' }
      );
      if (response.status === 401) {
        window.dispatchEvent(new Event('unauthorized'));
        throw new Error('Session expired. Please log in again.');
      }
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

  // Handle pinch-to-zoom on trackpads
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // ctrlKey is true for pinch-to-zoom gestures on trackpads
      if (e.ctrlKey) {
        e.preventDefault();
        setIsAutoFit(false);
        setZoom(z => {
          // Adjust sensitivity
          const newZoom = z - (e.deltaY * 0.01);
          // Clamp between 20% and 250%
          return Math.min(Math.max(0.2, newZoom), 2.5);
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isLoading, hasValidData, activeSidebarTab]);

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
            
            {/* Sidebar Toggle Button (Desktop only) */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              title={isSidebarOpen ? "Close Editor Sidebar" : "Open Editor Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>

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
            
            {/* One-Page Fit Indicator & Actions */}
            <div className="ml-4 flex items-center gap-2">
              <div className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 transition-colors ${
                exceedsOnePage 
                  ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${exceedsOnePage ? 'bg-red-500' : 'bg-emerald-500'}`} />
                {exceedsOnePage ? 'Overflows 1 Page' : '1-Page Fit'}
              </div>
              
              {/* Removed Optimize Fit button since auto-compression is deprecated */}
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
              disabled={isDownloading || isCompressing || hasUnsavedChanges}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={hasUnsavedChanges ? 'Save changes before downloading' : 'Download PDF'}
            >
              {isDownloading || isCompressing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
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
          <div className={`w-full lg:w-[480px] xl:w-[500px] flex-none bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-col print:hidden shadow-lg z-10 relative pt-12 lg:pt-0 ${
            activeSidebarTab === 'editor' 
              ? (isSidebarOpen ? 'flex' : 'flex lg:hidden') 
              : (isSidebarOpen ? 'hidden lg:flex' : 'hidden')
          }`}>
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
          <div 
            ref={previewContainerRef}
            className={`flex-1 overflow-auto print:overflow-visible bg-slate-100 dark:bg-slate-900 custom-scrollbar relative ${activeSidebarTab === 'preview' ? 'block' : 'hidden lg:block'}`}
          >
            {/* Zoom Controls */}
            <div className="fixed bottom-6 right-6 flex items-center gap-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-full p-1 z-30 print:hidden">
              <button onClick={() => { setIsAutoFit(false); setZoom(z => Math.max(0.3, z - 0.1)) }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-medium text-slate-700 dark:text-slate-200 min-w-[4ch] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={() => { setIsAutoFit(false); setZoom(z => Math.min(2, z + 0.1)) }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <button onClick={() => setIsAutoFit(true)} className={`p-2 rounded-full transition-colors ${isAutoFit ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`} title="Fit to Screen">
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            {/* Perfect Centering Wrapper */}
            <div className="min-h-full min-w-max flex flex-col print:block">
              {/* Top Spacer */}
              <div className="flex-1 min-h-8 shrink-0 print:hidden"></div>
              
              <div className="px-8 flex justify-center print:px-0">
                {/* Scaled Wrapper */}
                <div 
                  style={{ width: 794 * zoom, height: 1123 * zoom }} 
                  className="transition-all duration-200 ease-out shrink-0 print:!w-auto print:!height-auto"
                >
                  <div 
                    ref={templateRef} 
                    style={{ transform: `scale(${zoom})`, width: 794, height: 1123 }}
                    className="origin-top-left print:!transform-none"
                  >
                    <ResumeLayoutEngine 
                      structuredData={editableData} 
                      templateId="classic" 
                      onOverflowChange={setExceedsOnePage}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bottom Spacer */}
              <div className="flex-1 min-h-8 shrink-0 print:hidden"></div>
            </div>
          </div>

        </EditorProvider>
      </div>

    </div>
  );
};

export default ResumePreview;
