import React from 'react';
import { Mic, MicOff, Send, Volume2, RefreshCw, AlertCircle } from 'lucide-react';

export default function VoiceControls({
  isListening,
  isSpeaking,
  isProcessing,
  micPermission,
  transcriptDraft,
  onTranscriptChange,
  onToggleListen,
  onReplayQuestion,
  onSubmit,
  onReqPermission
}) {
  const isMicBlocked = micPermission === 'denied';
  const isMicUnavailable = micPermission === 'unavailable';

  return (
    <div className="space-y-6">
      {/* Mic Permission Banner */}
      {(isMicBlocked || isMicUnavailable) && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-200">Microphone Access Restricted</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isMicBlocked 
                ? "Microphone permission has been denied. Please enable microphone permissions in your browser settings to continue with voice mode, or use text fallback below."
                : "No microphone device detected on this system. You can type your answers in the input box below."
              }
            </p>
            {isMicBlocked && (
              <button 
                onClick={onReqPermission} 
                className="mt-2 text-xs font-semibold text-primary-400 hover:text-primary-300"
              >
                Request Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Controller Buttons Grid */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
        <button
          onClick={onReplayQuestion}
          disabled={isProcessing || isSpeaking}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-800/55 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Replay question audio"
        >
          <Volume2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold">Replay Question</span>
        </button>

        <button
          onClick={onToggleListen}
          disabled={isProcessing || isMicBlocked || isMicUnavailable}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 animate-pulse" />
              <span>Start Speaking</span>
            </>
          )}
        </button>
      </div>

      {/* Answer transcript drafting panel */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
          Your Answer Draft (Transcribed Speech or Manual Input)
        </label>
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 focus-within:border-primary-500/60 overflow-hidden transition-all duration-300">
          <textarea
            value={transcriptDraft}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : "Click 'Start Speaking' to transcribe your answer, or type your answer here..."}
            rows={5}
            disabled={isProcessing}
            className="block w-full border-0 bg-transparent py-4 px-5 text-slate-100 placeholder-slate-600 focus:ring-0 sm:text-sm resize-none focus:outline-none"
          />
          
          <div className="flex items-center justify-between border-t border-slate-900 bg-slate-950/90 py-2.5 px-4">
            <span className="text-xs text-slate-500">
              {transcriptDraft ? `${transcriptDraft.split(/\s+/).filter(Boolean).length} words` : 'Empty response'}
            </span>

            <button
              onClick={onSubmit}
              disabled={!transcriptDraft.trim() || isProcessing || isListening}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary-600/10 transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
