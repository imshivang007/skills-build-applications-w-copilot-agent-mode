import { Router } from 'express';

import { Activity } from '../models/activity.js';
import { User } from '../models/user.js';

export const activitiesRouter = Router();

activitiesRouter.get('/', async (request, response) => {
  const userId = typeof request.query.userId === 'string' ? request.query.userId : undefined;
  const filter = userId ? { userId } : {};

  const activities = await Activity.find(filter).sort({ loggedAt: -1 }).lean();

  response.json({ activities });
});

activitiesRouter.post('/', async (request, response) => {
  const { userId, type, durationMinutes, points } = request.body as {
    userId?: string;
    type?: string;
    durationMinutes?: number;
    points?: number;
  };

  if (!userId || !type || typeof durationMinutes !== 'number' || typeof points !== 'number') {
    response.status(400).json({ message: 'userId, type, durationMinutes, and points are required' });
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    response.status(404).json({ message: 'User not found' });
    return;
  }

  const activity = await Activity.create({
    userId,
    type,
    durationMinutes,
    points
  });

  user.totalPoints += points;
  await user.save();

  response.status(201).json({ activity, user });
});