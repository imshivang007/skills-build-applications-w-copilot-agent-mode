import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gradeLevel: { type: String, default: '' },
    totalPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = model('User', userSchema);