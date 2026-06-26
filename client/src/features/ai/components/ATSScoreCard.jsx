import { classNames } from '../../../utils/formatters.js';

export const ATSScoreCard = ({ score }) => {
  const isExcellent = score >= 85;
  const isGood = score >= 70 && score < 85;
  const isFair = score >= 50 && score < 70;
  const isPoor = score < 50;

  const colorClass = classNames(
    isExcellent && 'text-green-500',
    isGood && 'text-blue-500',
    isFair && 'text-yellow-500',
    isPoor && 'text-red-500'
  );

  const strokeClass = classNames(
    isExcellent && 'stroke-green-500',
    isGood && 'stroke-blue-500',
    isFair && 'stroke-yellow-500',
    isPoor && 'stroke-red-500'
  );

  // Circle math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">ATS Compatibility Score</h3>
      
      <div className="relative inline-flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          {/* Progress Circle */}
          <circle
            className={classNames('transition-all duration-1000 ease-out', strokeClass)}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={classNames('text-4xl font-bold', colorClass)}>{score}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">/ 100</span>
        </div>
      </div>
      
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        {isExcellent && 'Outstanding! Your resume is highly optimized for ATS.'}
        {isGood && 'Good job! A few tweaks could push it to excellent.'}
        {isFair && 'Fair. Significant improvements are needed for better visibility.'}
        {isPoor && 'Needs work. Your resume may be getting filtered out.'}
      </p>
    </div>
  );
};
