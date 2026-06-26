import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeBadge } from './ResumeBadge.jsx';
import { ResumeActions } from './ResumeActions.jsx';
import { formatDate } from '../../../utils/formatters.js';

export const ResumeCard = ({ resume, onRename, onMakePrimary, onDelete }) => {
  const sizeInMB = (resume.fileSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="col-span-1 divide-y divide-slate-200 dark:divide-slate-700 rounded-lg bg-surface-light dark:bg-surface-dark shadow dark:border dark:border-slate-800 transition-all hover:shadow-md">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">{resume.title}</h3>
            <ResumeBadge isPrimary={resume.isPrimary} />
          </div>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {resume.originalFilename} • {sizeInMB} MB
          </p>
          <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
            Uploaded {formatDate(resume.createdAt)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 p-3">
          <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-slate-200 dark:divide-slate-700">
          <div className="flex w-0 flex-1">
            <Link
              to={`/resume/${resume._id}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-slate-400" aria-hidden="true" />
              View Details
            </Link>
          </div>
          <div className="-ml-px flex items-center justify-center px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-br-lg transition-colors">
            <ResumeActions
              resume={resume}
              onRename={onRename}
              onMakePrimary={onMakePrimary}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
