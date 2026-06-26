import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Star, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { classNames } from '../../../utils/formatters.js';

export const ResumeActions = ({ resume, onRename, onMakePrimary, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="sr-only">Open options</span>
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:ring-slate-700">
          <Link
            to={`/resume/${resume._id}`}
            onClick={() => setIsOpen(false)}
            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <ExternalLink className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300" />
            View Details
          </Link>
          
          <button
            onClick={() => { setIsOpen(false); onRename(resume); }}
            className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <Edit2 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300" />
            Rename
          </button>

          {!resume.isPrimary && (
            <button
              onClick={() => { setIsOpen(false); onMakePrimary(resume); }}
              className="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
            >
              <Star className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300" />
              Make Primary
            </button>
          )}

          <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
          
          <button
            onClick={() => { setIsOpen(false); onDelete(resume); }}
            className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
