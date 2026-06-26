import { Router } from 'express';

import { User } from '../models/user.js';

export const usersRouter = Router();

usersRouter.get('/', async (_request, response) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();

  response.json({ users });
});

usersRouter.post('/', async (request, response) => {
  const { displayName, email, gradeLevel } = request.body as {
    displayName?: string;
    email?: string;
    gradeLevel?: string;
  };

  if (!displayName || !email) {
    response.status(400).json({ message: 'displayName and email are required' });
    return;
  }

  const user = await User.create({
    displayName,
    email,
    gradeLevel: gradeLevel ?? ''
  });

  response.status(201).json({ user });
});