import { createApp } from './app.js';
import { port } from './config/env.js';
import { connectDatabase } from './db/mongoose.js';

async function startServer() {
  await connectDatabase();

  const app = createApp();

  app.listen(port, () => {
    console.log(`OctoFit backend listening on port ${port}`);
  });
}

void startServer();