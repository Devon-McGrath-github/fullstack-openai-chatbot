import express from 'express';
import cors from 'cors';

import generate from './generate.ts';

const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));

const port = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

app.post('/generate', async (req, res) => {
  const {queryDescription} = req.body;
  try {
    const query = await generate(queryDescription);
    res.json({query});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
