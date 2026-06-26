import { Router } from 'express';

import { healthRouter } from './health.js';
import { activitiesRouter } from './activities.js';
import { usersRouter } from './users.js';
import { teamsRouter } from './teams.js';
import { leaderboardRouter } from './leaderboard.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/teams', teamsRouter);
apiRouter.use('/leaderboard', leaderboardRouter);