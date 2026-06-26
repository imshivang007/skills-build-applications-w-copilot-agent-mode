import { Schema, model } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    season: { type: String, required: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    score: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const LeaderboardEntry = model('LeaderboardEntry', leaderboardSchema);