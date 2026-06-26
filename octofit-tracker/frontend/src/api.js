const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

export function normalizeCollection(payload, key) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.[key])) {
    return payload[key];
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed');
  }

  return payload;
}

export const api = {
  getUsers: async () => normalizeCollection(await request('/users'), 'users'),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  getActivities: async (userId) => normalizeCollection(await request(userId ? `/activities?userId=${encodeURIComponent(userId)}` : '/activities'), 'activities'),
  createActivity: (body) => request('/activities', { method: 'POST', body: JSON.stringify(body) }),
  getTeams: async () => normalizeCollection(await request('/teams'), 'teams'),
  createTeam: (body) => request('/teams', { method: 'POST', body: JSON.stringify(body) }),
  addTeamMember: (teamId, body) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify(body) }),
  getLeaderboard: async () => normalizeCollection(await request('/leaderboard'), 'leaderboard'),
  createLeaderboardEntry: (body) => request('/leaderboard', { method: 'POST', body: JSON.stringify(body) }),
  getWorkouts: async () => normalizeCollection(await request('/workouts'), 'workouts'),
  createWorkout: (body) => request('/workouts', { method: 'POST', body: JSON.stringify(body) })
};