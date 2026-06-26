import { WebSocketServer } from 'ws';
import liveSessionController from './liveSession.controller.js';
import logger from '../utils/logger.js';

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/api/v1/live-session' });

  wss.on('connection', (ws, req) => {
    logger.info(`New WebSocket connection established from ${req.socket.remoteAddress}`);
    liveSessionController.handleConnection(ws, req);
  });

  wss.on('error', (error) => {
    logger.error(`WebSocket Server Error: ${error.message}`);
  });

  return wss;
};
