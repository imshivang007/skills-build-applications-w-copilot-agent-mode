import { Schema, model } from 'mongoose';

const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    focusArea: { type: String, required: true },
    targetMinutes: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Workout = model('Workout', workoutSchema);