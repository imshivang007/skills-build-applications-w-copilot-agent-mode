/* Test data seed description: populate octofit_db with sample users, teams, activities, leaderboard entries, and workouts. */

import { connectDatabase } from '../config/database.js';
import { Activity } from '../models/activity.js';
import { LeaderboardEntry } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

async function seed() {
  await connectDatabase();

  await Promise.all([
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Team.deleteMany({}),
    User.deleteMany({}),
    Workout.deleteMany({})
  ]);

  const users = await User.insertMany([
    { displayName: 'Ava Johnson', email: 'ava.johnson@example.com', gradeLevel: '10', totalPoints: 65 },
    { displayName: 'Noah Martinez', email: 'noah.martinez@example.com', gradeLevel: '11', totalPoints: 52 },
    { displayName: 'Mia Chen', email: 'mia.chen@example.com', gradeLevel: '12', totalPoints: 74 }
  ]);

  const teams = await Team.insertMany([
    {
      name: 'Blue Hawks',
      description: 'Fast-paced team focused on consistency and endurance.',
      memberIds: [users[0]._id, users[2]._id]
    },
    {
      name: 'Golden Foxes',
      description: 'Balanced team with strong cardio and strength efforts.',
      memberIds: [users[1]._id]
    }
  ]);

  await Activity.insertMany([
    { userId: users[0]._id, type: 'running', durationMinutes: 30, points: 15 },
    { userId: users[1]._id, type: 'walking', durationMinutes: 45, points: 10 },
    { userId: users[2]._id, type: 'strength', durationMinutes: 40, points: 20 }
  ]);

  await LeaderboardEntry.insertMany([
    { season: '2026 Spring', teamId: teams[0]._id, score: 185 },
    { season: '2026 Spring', teamId: teams[1]._id, score: 168 }
  ]);

  await Workout.insertMany([
    { name: 'Morning Motion', focusArea: 'cardio', targetMinutes: 20 },
    { name: 'Power Circuit', focusArea: 'strength', targetMinutes: 25 },
    { name: 'Endurance Builder', focusArea: 'stamina', targetMinutes: 30 }
  ]);

  console.log('Seeded octofit_db with sample users, teams, activities, leaderboard entries, and workouts.');
}

void seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });