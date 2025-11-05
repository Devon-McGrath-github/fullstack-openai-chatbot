import express from 'express';
import cors from 'cors';
import type {Request, Response} from 'express';

import generate from './generate.ts';

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

app.post('/generate', async (req: Request, res: Response) => {
  const {queryDescription} = req.body ?? {};
  if (typeof queryDescription !== 'string' || !queryDescription.trim()) {
    return res.status(400).json({error: 'queryDescription is required'});
  }

  try {
    const query = await generate(queryDescription);
    return res.json({query});
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
