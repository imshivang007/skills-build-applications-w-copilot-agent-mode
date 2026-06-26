import { Router } from 'express';

import { Team } from '../models/team.js';
import { User } from '../models/user.js';

export const teamsRouter = Router();

teamsRouter.get('/', async (_request, response) => {
  const teams = await Team.find().sort({ createdAt: -1 }).lean();

  response.json({ teams });
});

teamsRouter.post('/', async (request, response) => {
  const { name, description } = request.body as {
    name?: string;
    description?: string;
  };

  if (!name) {
    response.status(400).json({ message: 'name is required' });
    return;
  }

  const team = await Team.create({
    name,
    description: description ?? ''
  });

  response.status(201).json({ team });
});

teamsRouter.post('/:teamId/members', async (request, response) => {
  const { teamId } = request.params;
  const { userId } = request.body as { userId?: string };

  if (!userId) {
    response.status(400).json({ message: 'userId is required' });
    return;
  }

  const [team, user] = await Promise.all([Team.findById(teamId), User.findById(userId)]);

  if (!team) {
    response.status(404).json({ message: 'Team not found' });
    return;
  }

  if (!user) {
    response.status(404).json({ message: 'User not found' });
    return;
  }

  if (!team.memberIds.some((memberId) => memberId.toString() === userId)) {
    team.memberIds.push(user._id);
    await team.save();
  }

  response.json({ team });
});