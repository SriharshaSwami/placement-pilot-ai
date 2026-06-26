import { ResumeCard } from './ResumeCard.jsx';
import { ResumeEmptyState } from './ResumeEmptyState.jsx';

export const ResumeList = ({ resumes = [], onRename, onMakePrimary, onDelete }) => {
  if (resumes.length === 0) {
    return <ResumeEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume._id}
          resume={resume}
          onRename={onRename}
          onMakePrimary={onMakePrimary}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
