import { UploadCloud } from 'lucide-react';
import { useCallback } from 'react';
import { classNames } from '../../../utils/formatters.js';

export const UploadZone = ({ onFileSelected, isUploading }) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (isUploading) return;
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected, isUploading]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    if (isUploading) return;
    const file = e.target.files[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={classNames(
        isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10',
        'mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-6 py-10 transition-colors'
      )}
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" aria-hidden="true" />
        <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">PDF up to 5MB</p>
      </div>
    </div>
  );
};
