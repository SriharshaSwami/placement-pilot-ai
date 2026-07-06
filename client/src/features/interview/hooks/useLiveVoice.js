import { useState, useEffect, useCallback } from 'react';
import liveVoiceService from '../../../services/liveVoice.service.js';

export function useLiveVoice(interviewId, userId) {
  const [state, setState] = useState('Disconnected');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      liveVoiceService.disconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    try {
      await liveVoiceService.connect(
        interviewId,
        userId,
        (newState) => setState(newState),
        (text) => setTranscript((prev) => (prev ? prev + ' ' + text : text))
      );
    } catch (err) {
      setError(err.message || 'Failed to connect');
    }
  }, [interviewId, userId]);

  const disconnect = useCallback(() => {
    liveVoiceService.disconnect();
    setState('Disconnected');
  }, []);

  const startListening = useCallback(() => {
    liveVoiceService.startListening();
  }, []);

  const stopListening = useCallback(() => {
    liveVoiceService.stopListening();
  }, []);

  const interrupt = useCallback(() => {
    liveVoiceService.interrupt();
  }, []);

  const sendText = useCallback((text) => {
    liveVoiceService.sendText(text);
  }, []);

  const sendUserTranscript = useCallback((text) => {
    liveVoiceService.sendUserTranscript(text);
  }, []);

  return {
    state,
    transcript,
    error,
    connect,
    disconnect,
    startListening,
    stopListening,
    interrupt,
    sendText,
    sendUserTranscript,
    setTranscript
  };
}
