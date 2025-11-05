import express from 'express';
import cors from 'cors';
import type {Request, Response} from 'express';

import generate from './generate.ts';
import {ensureConversation, addMessage, getMessages} from './db.ts'; // database helpers

const app = express();

app.use(express.json({limit: '1mb'}));
app.use(cors({origin: '*'}));

// Log every request to the console
app.use((req: Request, _res: Response, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Simple health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('Server Running');
});

// Get all messages for a given conversation
app.get('/conversations/:id/messages', (req: Request, res: Response) => {
  try {
    const messages = getMessages(req.params.id);
    return res.json({messages});
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

// Handle chat message generation
app.post('/generate', async (req: Request, res: Response) => {
  const {queryDescription, conversationId: inputId} = req.body ?? {};

  // Make sure a prompt was sent
  if (typeof queryDescription !== 'string' || !queryDescription.trim()) {
    return res.status(400).json({error: 'queryDescription is required'});
  }

  // Create or reuse a conversation
  const conversationId = ensureConversation(inputId);

  try {
    // Save the user's message
    addMessage(conversationId, 'user', queryDescription.trim());

    // Get a reply from OpenAI
    const reply = await generate(queryDescription);

    // Save the assistant's reply
    const saved = addMessage(conversationId, 'assistant', reply || '');

    // Send everything back to the client
    return res.json({conversationId, reply: saved.content, message: saved});
  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

// Pick a port and start the server
const port = Number(process.env.PORT) || 3002;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// Graceful shutdown for when the app is stopped
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
