/**
 * VoiceProvider Interface
 * 
 * This defines the standard contract for any live voice streaming integration 
 * (Gemini Live, OpenAI Realtime, etc.) to ensure the interview engine is decoupled 
 * from the underlying AI streaming implementation.
 */

export class VoiceProviderInterface {
  /**
   * Initialize and connect to the underlying service (WebSocket, gRPC, etc.).
   * @param {Object} options - Configuration for the session.
   * @param {Function} onEvent - Callback for events: (event, payload) => {}
   */
  async connect(options, onEvent) {
    throw new Error('Method not implemented: connect');
  }

  /**
   * Disconnect and clean up resources.
   */
  disconnect() {
    throw new Error('Method not implemented: disconnect');
  }

  /**
   * Send binary audio chunk to the AI.
   * @param {Buffer} chunk 
   */
  sendAudio(chunk) {
    throw new Error('Method not implemented: sendAudio');
  }

  /**
   * Signal that the client has stopped listening/speaking and awaits response.
   */
  stopListening() {
    throw new Error('Method not implemented: stopListening');
  }

  /**
   * Signal that the client has started listening/speaking.
   */
  startListening() {
    throw new Error('Method not implemented: startListening');
  }

  /**
   * Force interrupt the AI's current speech/generation.
   */
  interrupt() {
    throw new Error('Method not implemented: interrupt');
  }

  /**
   * Attempt to reconnect if disconnected prematurely.
   */
  async reconnect() {
    throw new Error('Method not implemented: reconnect');
  }
}
