/**
 * Frontend Service for managing Live Voice WebSocket and Audio I/O
 */

class LiveVoiceService {
  constructor() {
    this.ws = null;
    this.audioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.onStateChange = null;
    this.onTranscript = null;
    this.isPlaying = false;
  }

  async connect(interviewId, userId, onStateChange, onTranscript) {
    this.onStateChange = onStateChange;
    this.onTranscript = onTranscript;

    if (this.ws) this.disconnect();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Using environment variable or default backend port
    const wsUrl = `${protocol}//${window.location.hostname}:5000/api/v1/live-session`;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({ type: 'setup', interviewId, userId }));
        resolve();
      };

      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'state') {
          if (this.onStateChange) this.onStateChange(msg.value);
        } else if (msg.type === 'transcript') {
          if (this.onTranscript) this.onTranscript(msg.text);
        } else if (msg.type === 'audio') {
          this.playAudioChunk(msg.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        if (this.onStateChange) this.onStateChange('Error');
        reject(error);
      };

      this.ws.onclose = () => {
        if (this.onStateChange) this.onStateChange('Disconnected');
      };
    });
  }

  async startListening() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000 // Gemini expects 16kHz
      });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      // Deprecated but works everywhere without needing an external script file (AudioWorklet requires one)
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.sendAudioData(inputData);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      if (this.onStateChange) this.onStateChange('Listening');
    } catch (err) {
      console.error('Microphone access error:', err);
      if (this.onStateChange) this.onStateChange('Error');
    }
  }

  stopListening() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.onStateChange) this.onStateChange('Connected');
  }

  sendAudioData(float32Array) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    // Convert Float32Array to PCM16
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    const base64Audio = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    this.ws.send(JSON.stringify({ type: 'audio', data: base64Audio }));
  }

  async playAudioChunk(base64Audio) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    }

    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // We assume the incoming data is raw PCM16 at 24000Hz (Gemini output default)
      // Converting PCM16 bytes to AudioBuffer
      const pcm16 = new Int16Array(bytes.buffer);
      const audioBuffer = this.audioContext.createBuffer(1, pcm16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  }

  interrupt() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'interrupt' }));
    }
  }

  sendText(text) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', data: text }));
    }
  }

  sendUserTranscript(text) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'userTranscript', text }));
    }
  }

  disconnect() {
    this.stopListening();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default new LiveVoiceService();
