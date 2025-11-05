import express from 'express';
import cors from 'cors';
import type {Request, Response} from 'express';

import generate from './generate.ts';
import {ensureConversation, addMessage, getMessages} from './db.ts'; // 🆕 import

const app = express();

app.use(express.json({limit: '1mb'}));
app.use(cors({origin: '*'}));

// Request logger
app.use((req: Request, _res: Response, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Server Running');
});

app.get('/conversations/:id/messages', (req: Request, res: Response) => {
  try {
    const messages = getMessages(req.params.id);
    return res.json({messages});
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

app.post('/generate', async (req: Request, res: Response) => {
  const {queryDescription, conversationId: inputId} = req.body ?? {};
  if (typeof queryDescription !== 'string' || !queryDescription.trim()) {
    return res.status(400).json({error: 'queryDescription is required'});
  }

  const conversationId = ensureConversation(inputId);

  try {
    addMessage(conversationId, 'user', queryDescription.trim());

    const reply = await generate(queryDescription);

    const saved = addMessage(conversationId, 'assistant', reply || '');

    // return both the id (so client can store it) and the reply
    return res.json({conversationId, reply: saved.content, message: saved});
  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({error: 'Internal Server Error'});
  }
});

const port = Number(process.env.PORT) || 3002;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
