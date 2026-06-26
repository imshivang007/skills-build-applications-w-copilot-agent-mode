import { Schema, model } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    points: { type: Number, required: true },
    loggedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Activity = model('Activity', activitySchema);