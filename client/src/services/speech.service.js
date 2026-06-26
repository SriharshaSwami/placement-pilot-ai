/**
 * Reusable Speech-to-Text and Text-to-Speech Abstraction Layer.
 * Interoperable interface for future STT/TTS custom cloud integrations.
 */

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.activeUtterance = null;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  // Speak text via browser speech synthesis
  speak(text, onStart = () => {}, onEnd = () => {}) {
    if (!this.synthesis) return;
    this.stopSpeaking();

    this.activeUtterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance.onstart = onStart;
    this.activeUtterance.onend = onEnd;
    this.activeUtterance.onerror = (e) => {
      console.error('[SpeechService] Synthesis error:', e);
      onEnd();
    };

    // Optional: Choose a default premium-sounding voice if available
    const voices = this.synthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) {
      this.activeUtterance.voice = englishVoice;
    }

    this.synthesis.speak(this.activeUtterance);
  }

  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  // Listen to microphone input via browser speech recognition
  startListening(onResult = () => {}, onError = () => {}, onEnd = () => {}) {
    if (!this.recognition || this.isListening) return;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('[SpeechService] Recognition error:', event.error);
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('[SpeechService] Start failed:', e);
      onError('already-running');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async checkPermission() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudio = devices.some(d => d.kind === 'audioinput');
      if (!hasAudio) return 'unavailable';

      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      return permissionStatus.state; // 'granted', 'prompt', 'denied'
    } catch (e) {
      return 'prompt';
    }
  }

  async requestMicrophoneAccess() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default new SpeechService();
