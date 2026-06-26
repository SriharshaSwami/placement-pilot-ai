import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInterview, submitAnswer, generateNextQuestion, finishInterview } from '@/services/interview.service.js';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton.jsx';
import { ErrorState } from '@/components/feedback/ErrorState.jsx';
import { Flag, Play, AlertTriangle } from 'lucide-react';
import speechService from '@/services/speech.service.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

import React, { Suspense, lazy } from 'react';
import SessionHeader from '../components/SessionHeader.jsx';
import Timer from '../components/Timer.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
const VoiceControls = lazy(() => import('../components/VoiceControls.jsx'));
import TranscriptPanel from '../components/TranscriptPanel.jsx';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [transcriptDraft, setTranscriptDraft] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt');
  
  // Ref to track which question index we have already spoken, to avoid double-speaking on re-renders
  const lastSpokenSeqRef = useRef(null);

  const { data: sessionRes, isLoading, error } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => getInterview(id),
    refetchInterval: false, // Turn off polling since we want state to remain stable during voice inputs
  });

  const session = sessionRes?.data;

  // Check microphone permissions on mount
  useEffect(() => {
    const checkMic = async () => {
      const status = await speechService.checkPermission();
      setMicPermission(status);
    };
    checkMic();
  }, []);

  const requestPermission = async () => {
    const granted = await speechService.requestMicrophoneAccess();
    const status = await speechService.checkPermission();
    setMicPermission(status);
  };

  const answerMutation = useMutation({
    mutationFn: ({ seq, text }) => submitAnswer(id, seq, text),
    onSuccess: () => {
      setTranscriptDraft('');
      queryClient.invalidateQueries({ queryKey: ['interview', id] }).then(() => {
        nextQuestionMutation.mutate();
      });
    }
  });

  const nextQuestionMutation = useMutation({
    mutationFn: () => generateNextQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', id] });
    }
  });

  const finishMutation = useMutation({
    mutationFn: () => finishInterview(id),
    onSuccess: () => {
      speechService.stopSpeaking();
      speechService.stopListening();
      navigate(`/interview/results/${id}`, { replace: true });
    }
  });

  const questions = session?.questions || [];
  const currentQuestion = questions.length > 0 ? questions[questions.length - 1] : null;
  const isAwaitingAnswer = currentQuestion && !currentQuestion.candidateAnswer;

  // Speak the question when it's new
  useEffect(() => {
    if (currentQuestion && isAwaitingAnswer && lastSpokenSeqRef.current !== currentQuestion.sequenceNumber) {
      lastSpokenSeqRef.current = currentQuestion.sequenceNumber;
      
      // Stop listening if we were listening, speak, then auto-listen
      speechService.stopListening();
      setIsListening(false);

      speechService.speak(
        currentQuestion.questionText,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          // Auto-start listening after question finishes speaking if mic permitted
          if (micPermission === 'granted') {
            startVoiceCapture();
          }
        }
      );
    }
  }, [currentQuestion, isAwaitingAnswer, micPermission]);

  // Clean up synthesis/recognition on unmount
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, []);

  useEffect(() => {
    if (session?.status === 'Completed') {
      navigate(`/interview/results/${id}`, { replace: true });
    }
  }, [session, navigate, id]);

  const handleReplay = () => {
    if (!currentQuestion) return;
    speechService.stopListening();
    setIsListening(false);
    speechService.speak(
      currentQuestion.questionText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const startVoiceCapture = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    
    speechService.startListening(
      (text) => {
        setTranscriptDraft((prev) => (prev ? prev + ' ' + text : text));
      },
      (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  const handleToggleListening = async () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      if (micPermission === 'prompt') {
        const ok = await speechService.requestMicrophoneAccess();
        const status = await speechService.checkPermission();
        setMicPermission(status);
        if (ok) startVoiceCapture();
      } else {
        startVoiceCapture();
      }
    }
  };

  const handleSubmitAnswer = () => {
    if (!transcriptDraft.trim() || answerMutation.isPending || isListening) return;
    speechService.stopSpeaking();
    answerMutation.mutate({
      seq: currentQuestion.sequenceNumber,
      text: transcriptDraft
    });
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error || !session) return <ErrorState message="Interview session not found." />;

  const isProcessing = answerMutation.isPending || nextQuestionMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 py-8">
      {/* Session Details Header */}
      <SessionHeader session={session} />

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Question area and Voice actions */}
        <div className="lg:col-span-2 space-y-6">
          <QuestionCard
            questionText={currentQuestion?.questionText}
            isFollowUp={currentQuestion?.isFollowUp}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            questionNumber={currentQuestion?.sequenceNumber}
          />

          {isAwaitingAnswer && (
            <Suspense fallback={<div className="h-48 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800 w-full"></div>}>
              <VoiceControls
                interviewId={id}
                userId={user?._id}
                isListening={isListening}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
                micPermission={micPermission}
                transcriptDraft={transcriptDraft}
                onTranscriptChange={setTranscriptDraft}
                onToggleListen={handleToggleListening}
                onReplayQuestion={handleReplay}
                onSubmit={handleSubmitAnswer}
                onReqPermission={requestPermission}
              />
            </Suspense>
          )}
        </div>

        {/* Right Side: Timer & History Dialog Log */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400">Session Timer</span>
            <Timer
              startTime={session.createdAt}
              durationMinutes={session.config.duration}
              onTimeUp={() => finishMutation.mutate()}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <TranscriptPanel questions={questions} />

            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <button
                onClick={() => finishMutation.mutate()}
                disabled={finishMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-x-2 py-2.5 rounded-xl border border-red-900/30 hover:border-red-900/60 bg-red-950/20 hover:bg-red-950/40 text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-40 transition-all duration-200"
              >
                <Flag className="h-4 w-4" />
                Finish Interview & Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
