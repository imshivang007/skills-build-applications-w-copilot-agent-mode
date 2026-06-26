import { Router } from 'express';

import { LeaderboardEntry } from '../models/leaderboard.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/', async (request, response) => {
  const season = typeof request.query.season === 'string' ? request.query.season : undefined;
  const filter = season ? { season } : {};

  const leaderboard = await LeaderboardEntry.find(filter)
    .sort({ score: -1, createdAt: -1 })
    .populate('teamId')
    .lean();

  response.json({ leaderboard });
});

leaderboardRouter.post('/', async (request, response) => {
  const { season, teamId, score } = request.body as {
    season?: string;
    teamId?: string;
    score?: number;
  };

  if (!season || !teamId) {
    response.status(400).json({ message: 'season and teamId are required' });
    return;
  }

  const leaderboardEntry = await LeaderboardEntry.create({
    season,
    teamId,
    score: score ?? 0
  });

  response.status(201).json({ leaderboardEntry });
});