import cors from 'cors';
import express from 'express';
import { initializeDatabase } from './models/index.js';
import analyticsRouter from './routes/analytics.js';
import eventsRouter from './routes/events.js';

const app = express();
const port = process.env.PORT || 3001;

await initializeDatabase();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/analytics', analyticsRouter);
app.use('/api/events', eventsRouter);

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    return response.status(400).json({ error: 'Request body must be valid JSON.' });
  }

  console.error(error);
  return response.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
