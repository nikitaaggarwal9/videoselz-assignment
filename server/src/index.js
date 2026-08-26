import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

