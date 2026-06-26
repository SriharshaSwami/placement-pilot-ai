import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, AlertCircle } from 'lucide-react';

export default function Timer({ startTime, durationMinutes, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!startTime) return;
    
    const calculateTimeLeft = () => {
      const startMs = new Date(startTime).getTime();
      const nowMs = Date.now();
      const elapsedSeconds = Math.floor((nowMs - startMs) / 1000);
      const totalSeconds = durationMinutes * 60;
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      
      setTimeLeft(remaining);
      
      if (remaining === 0 && onTimeUp) {
        onTimeUp();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 180; // 3 minutes
  const isCriticalTime = timeLeft < 60; // 1 minute

  let timerColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  if (isLowTime) {
    timerColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5 animate-pulse';
  }
  if (isCriticalTime) {
    timerColor = 'text-red-400 border-red-500/25 bg-red-500/10 animate-pulse';
  }

  return (
    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm font-mono font-medium tracking-wider transition-all duration-300 ${timerColor}`}>
      {isCriticalTime ? (
        <AlertCircle className="w-4 h-4 text-red-400 animate-bounce" />
      ) : (
        <TimerIcon className={`w-4 h-4 ${isLowTime ? 'text-amber-400' : 'text-emerald-400'}`} />
      )}
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
}
