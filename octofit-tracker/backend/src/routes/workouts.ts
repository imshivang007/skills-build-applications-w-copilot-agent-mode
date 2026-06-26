import { Router } from 'express';

import { Workout } from '../models/workout.js';

export const workoutsRouter = Router();

workoutsRouter.get('/', async (_request, response) => {
  const workouts = await Workout.find().sort({ createdAt: -1 }).lean();

  response.json({ workouts });
});

workoutsRouter.post('/', async (request, response) => {
  const { name, focusArea, targetMinutes } = request.body as {
    name?: string;
    focusArea?: string;
    targetMinutes?: number;
  };

  if (!name || !focusArea || typeof targetMinutes !== 'number') {
    response.status(400).json({ message: 'name, focusArea, and targetMinutes are required' });
    return;
  }

  const workout = await Workout.create({
    name,
    focusArea,
    targetMinutes
  });

  response.status(201).json({ workout });
});