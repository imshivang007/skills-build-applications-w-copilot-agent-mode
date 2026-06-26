export const port = Number(process.env.PORT ?? 8000);

export const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';