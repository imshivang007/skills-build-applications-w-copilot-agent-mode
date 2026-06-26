import mongoose from 'mongoose';

import { mongoUri } from '../config/env.js';

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  return mongoose.connect(mongoUri, {
    dbName: 'octofit_db'
  });
}