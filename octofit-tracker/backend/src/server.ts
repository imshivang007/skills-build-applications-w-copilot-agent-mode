import { createApp } from './app.js';
import { port } from './config/env.js';
import { connectDatabase } from './config/database.js';

const codespaceName = process.env.CODESPACE_NAME;

const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

async function startServer() {
  await connectDatabase();

  const app = createApp();

  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
}

void startServer();