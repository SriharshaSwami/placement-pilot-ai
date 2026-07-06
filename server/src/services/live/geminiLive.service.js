import WebSocket from 'ws';
import { VoiceProviderInterface } from './voiceProvider.interface.js';
import logger from '../../utils/logger.js';
import config from '../../config/index.js';

export class GeminiLiveService extends VoiceProviderInterface {
  constructor() {
    super();
    this.ws = null;
    this.onEvent = null;
    this.apiKey = config.gemini.apiKey;
    this.model = 'models/gemini-2.0-flash-exp';
    this.isConnected = false;
  }

  async connect(options, onEvent) {
    this.onEvent = onEvent;
    
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const host = 'generativelanguage.googleapis.com';
    const url = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.apiKey}`;
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        logger.info('[GeminiLiveService] Connected to Gemini Live API');
        this.isConnected = true;
        this.onEvent('Connected');
        
        // Send initial setup
        const systemInstruction = options.systemInstruction || "You are a helpful interviewer.";
        const setupMessage = {
          setup: {
            model: this.model,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            }
          }
        };
        this.ws.send(JSON.stringify(setupMessage));
        
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const response = JSON.parse(data.toString());
          this.handleResponse(response);
        } catch (error) {
          logger.error(`[GeminiLiveService] Message parsing error: ${error}`);
        }
      });

      this.ws.on('close', () => {
        logger.info('[GeminiLiveService] Disconnected');
        this.isConnected = false;
        this.onEvent('Disconnected');
      });

      this.ws.on('error', (err) => {
        logger.error(`[GeminiLiveService] WebSocket error: ${err.message}`);
        this.isConnected = false;
        this.onEvent('Error', err.message);
        reject(err);
      });
    });
  }

  handleResponse(response) {
    if (response.serverContent && response.serverContent.modelTurn) {
      const parts = response.serverContent.modelTurn.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            // It's audio data (base64)
            this.onEvent('Audio', part.inlineData.data);
          }
          if (part.text) {
            this.onEvent('Transcript', part.text);
          }
        }
      }
    }
    
    if (response.serverContent && response.serverContent.turnComplete) {
      this.onEvent('TurnComplete');
    }
  }

  sendAudio(base64Audio) {
    if (!this.isConnected || !this.ws) return;
    
    const message = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Audio
          }
        ]
      }
    };
    this.ws.send(JSON.stringify(message));
  }

  sendText(text) {
    if (!this.isConnected || !this.ws) return;
    const message = {
      clientContent: {
        turns: [{
          role: 'user',
          parts: [{ text }]
        }],
        turnComplete: true
      }
    };
    this.ws.send(JSON.stringify(message));
  }

  startListening() {
    this.onEvent('Listening');
  }

  stopListening() {
    this.onEvent('Thinking');
  }

  interrupt() {
    if (!this.isConnected || !this.ws) return;
    // Sending a new client content message interrupts the model's current generation turn
    const message = {
      clientContent: {
        turns: [{
          role: 'user',
          parts: []
        }],
        turnComplete: false
      }
    };
    this.ws.send(JSON.stringify(message));
    this.onEvent('Interrupted');
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.onEvent = null;
  }

  async reconnect(options, onEvent) {
    this.disconnect();
    return this.connect(options, onEvent || this.onEvent);
  }
}

export default new GeminiLiveService();
