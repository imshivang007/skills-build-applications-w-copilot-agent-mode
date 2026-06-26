const codespaceName = import.meta.env.VITE_CODESPACE_NAME ?? import.meta.env.CODESPACE_NAME;

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

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
  getUsers: () => request('/users'),
  createUser: (body) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  getActivities: (userId) => request(userId ? `/activities?userId=${encodeURIComponent(userId)}` : '/activities'),
  createActivity: (body) => request('/activities', { method: 'POST', body: JSON.stringify(body) }),
  getTeams: () => request('/teams'),
  createTeam: (body) => request('/teams', { method: 'POST', body: JSON.stringify(body) }),
  addTeamMember: (teamId, body) => request(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify(body) }),
  getLeaderboard: () => request('/leaderboard'),
  createLeaderboardEntry: (body) => request('/leaderboard', { method: 'POST', body: JSON.stringify(body) })
};