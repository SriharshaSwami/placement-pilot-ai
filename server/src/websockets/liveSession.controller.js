import { GeminiLiveService } from '../services/live/geminiLive.service.js';
import interviewService from '../services/interview.service.js';
import logger from '../utils/logger.js';

class LiveSessionController {
  constructor() {
    // We could store multiple active sessions here if needed
    this.sessions = new Map();
  }

  handleConnection(ws, req) {
    const sessionId = req.headers['sec-websocket-key'];
    logger.info(`[LiveSessionController] Client connected: ${sessionId}`);
    
    // Instantiate a new provider for this client
    const provider = new GeminiLiveService();
    // Keep track of transcripts for background evaluation
    this.sessions.set(sessionId, { 
      ws, 
      provider,
      interviewId: null,
      userId: null,
      lastAIQuestion: '',
      currentUserAnswer: '' 
    });

    // Send connection initializing state
    ws.send(JSON.stringify({ type: 'state', value: 'Initializing' }));

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const sessionData = this.sessions.get(sessionId);

        
        switch (message.type) {
          case 'setup':
            ws.send(JSON.stringify({ type: 'state', value: 'Connecting' }));
            try {
              sessionData.interviewId = message.interviewId;
              sessionData.userId = message.userId;
              
              const systemInstruction = await interviewService.getLiveSessionPrompt(message.userId, message.interviewId);
              
              await provider.connect({
                systemInstruction: systemInstruction
              }, (event, payload) => {
                this.handleProviderEvent(sessionId, ws, event, payload);
              });
            } catch (err) {
              ws.send(JSON.stringify({ type: 'state', value: 'Error', error: err.message }));
            }
            break;
            
          case 'audio':
            // Client sends base64 audio
            provider.sendAudio(message.data);
            break;

          case 'text':
            sessionData.currentUserAnswer += ' ' + message.data;
            provider.sendText(message.data);
            break;

          case 'userTranscript':
            // Received STT transcript from frontend
            sessionData.currentUserAnswer += ' ' + message.text;
            break;

          case 'interrupt':
            provider.interrupt();
            break;

          default:
            logger.warn(`[LiveSessionController] Unknown message type: ${message.type}`);
        }
      } catch (err) {
        logger.error(`[LiveSessionController] Error parsing message: ${err.message}`);
      }
    });

    ws.on('close', () => {
      logger.info(`[LiveSessionController] Client disconnected: ${sessionId}`);
      provider.disconnect();
      this.sessions.delete(sessionId);
    });
    
    ws.on('error', (err) => {
      logger.error(`[LiveSessionController] WebSocket error: ${err.message}`);
      provider.disconnect();
      this.sessions.delete(sessionId);
    });
  }

  handleProviderEvent(sessionId, ws, event, payload) {
    if (ws.readyState !== 1) return; // Not open
    const sessionData = this.sessions.get(sessionId);

    switch (event) {
      case 'Connected':
        ws.send(JSON.stringify({ type: 'state', value: 'Connected' }));
        break;
      case 'Disconnected':
        ws.send(JSON.stringify({ type: 'state', value: 'Disconnected' }));
        break;
      case 'Audio':
        ws.send(JSON.stringify({ type: 'audio', data: payload }));
        ws.send(JSON.stringify({ type: 'state', value: 'AISpeaking' }));
        break;
      case 'Transcript':
        ws.send(JSON.stringify({ type: 'transcript', text: payload }));
        if (sessionData) {
          sessionData.lastAIQuestion += payload;
        }
        break;
      case 'TurnComplete':
        ws.send(JSON.stringify({ type: 'state', value: 'Listening' }));
        
        // Evaluate the previous turn if we have both AI question and User answer
        if (sessionData && sessionData.lastAIQuestion && sessionData.currentUserAnswer.trim()) {
           const question = sessionData.lastAIQuestion.trim();
           const answer = sessionData.currentUserAnswer.trim();
           // Clear them for the next turn
           sessionData.lastAIQuestion = '';
           sessionData.currentUserAnswer = '';
           
           interviewService.evaluateAndSaveLiveTurn(sessionData.userId, sessionData.interviewId, question, answer)
             .catch(err => logger.error(`[LiveSessionController] Background evaluation error: ${err.message}`));
        }
        break;
      case 'Error':
        ws.send(JSON.stringify({ type: 'state', value: 'Error', error: payload }));
        break;
    }
  }
}

export default new LiveSessionController();
