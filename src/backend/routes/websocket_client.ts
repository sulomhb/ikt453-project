import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to server');
});

ws.on('message', (message: string) => {
  console.log(`Received from server: ${message}`);
});

ws.on('close', () => {
  console.log('Disconnected from server');
});