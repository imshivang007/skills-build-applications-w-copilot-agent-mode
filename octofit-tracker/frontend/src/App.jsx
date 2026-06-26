import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

import { api, apiBaseUrl } from './api.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' }
];

function Shell({ children }) {
  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="brand-mark">
          <img src="/octofitapp-small.png" alt="OctoFit Tracker logo" />
        </div>
        <div>
          <p className="eyebrow mb-2">Mergington High School</p>
          <h1 className="display-5 fw-bold mb-3">OctoFit Tracker</h1>
          <p className="lead mb-0">
            Track workouts, build teams, and keep students engaged with healthy competition.
          </p>
        </div>
      </header>

      <nav className="nav nav-pills nav-fill gap-2 flex-wrap my-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-link rounded-pill px-4 ${isActive ? 'active' : 'link-dark bg-light-subtle'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main>{children}</main>
    </div>
  );
}

function OverviewCard({ label, value, caption }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

function HomePage() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    let active = true;

    Promise.all([api.getUsers(), api.getActivities(), api.getTeams(), api.getLeaderboard()])
      .then(([usersPayload, activitiesPayload, teamsPayload, leaderboardPayload]) => {
        if (!active) {
          return;
        }

        setUsers(usersPayload.users ?? []);
        setActivities(activitiesPayload.activities ?? []);
        setTeams(teamsPayload.teams ?? []);
        setLeaderboard(leaderboardPayload.leaderboard ?? []);
      })
      .catch(() => {
        if (active) {
          setUsers([]);
          setActivities([]);
          setTeams([]);
          setLeaderboard([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const topTeam = leaderboard[0]?.teamId?.name ?? 'No leaderboard yet';

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Live dashboard</p>
          <h2 className="h3 mb-2">Student progress at a glance</h2>
          <p className="mb-0 text-secondary-emphasis">
            Connected to {apiBaseUrl}. Updates below reflect the current backend data.
          </p>
        </div>
        <div className="badge text-bg-light border border-secondary-subtle rounded-pill px-3 py-2">
          Backend online
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <OverviewCard label="Active students" value={users.length} caption="Registered users" />
        </div>
        <div className="col-md-3">
          <OverviewCard label="This week" value={activities.length} caption="Logged activities" />
        </div>
        <div className="col-md-3">
          <OverviewCard label="Teams" value={teams.length} caption="Created groups" />
        </div>
        <div className="col-md-3">
          <OverviewCard label="Top team" value={topTeam} caption="Current ranking leader" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="content-card p-4 h-100">
            <h3 className="h5 mb-3">Recent users</h3>
            {users.length === 0 ? (
              <p className="text-secondary mb-0">No users yet. Add the first student on the Activities page.</p>
            ) : (
              <div className="list-group list-group-flush">
                {users.slice(0, 4).map((user) => (
                  <div key={user._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                    <span>{user.displayName}</span>
                    <span className="text-secondary">{user.totalPoints ?? 0} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="content-card p-4 h-100">
            <h3 className="h5 mb-3">Latest leaderboard entries</h3>
            {leaderboard.length === 0 ? (
              <p className="text-secondary mb-0">Leaderboard entries will appear once teams are scored.</p>
            ) : (
              <div className="list-group list-group-flush">
                {leaderboard.slice(0, 4).map((entry) => (
                  <div key={entry._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                    <span>{entry.teamId?.name ?? 'Unknown team'}</span>
                    <span className="text-secondary">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitiesPage() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ displayName: '', email: '', gradeLevel: '', userId: '', type: 'running', durationMinutes: 30, points: 10 });

  const refresh = async () => {
    const [usersPayload, activitiesPayload] = await Promise.all([api.getUsers(), api.getActivities()]);
    setUsers(usersPayload.users ?? []);
    setActivities(activitiesPayload.activities ?? []);
    setForm((current) => ({ ...current, userId: usersPayload.users?.[0]?._id ?? current.userId }));
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const payload = await api.createUser({
        displayName: form.displayName,
        email: form.email,
        gradeLevel: form.gradeLevel
      });

      setStatus(`Created ${payload.user.displayName}`);
      setForm((current) => ({ ...current, displayName: '', email: '', gradeLevel: '', userId: payload.user._id }));
      await refresh();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleCreateActivity = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      await api.createActivity({
        userId: form.userId,
        type: form.type,
        durationMinutes: Number(form.durationMinutes),
        points: Number(form.points)
      });

      setStatus('Activity logged');
      await refresh();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Activity logging</p>
          <h2 className="h3 mb-2">Add students and track workouts</h2>
          <p className="mb-0 text-secondary-emphasis">Create a user, then log an activity against that student.</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <form className="content-card p-4 h-100" onSubmit={handleCreateUser}>
            <h3 className="h5 mb-3">Create student</h3>
            <div className="mb-3">
              <label className="form-label">Display name</label>
              <input className="form-control" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Grade level</label>
              <input className="form-control" value={form.gradeLevel} onChange={(event) => setForm({ ...form, gradeLevel: event.target.value })} />
            </div>
            <button className="btn btn-dark w-100" type="submit">Create student</button>
          </form>
        </div>

        <div className="col-lg-6">
          <form className="content-card p-4 h-100" onSubmit={handleCreateActivity}>
            <h3 className="h5 mb-3">Log activity</h3>
            <div className="mb-3">
              <label className="form-label">Student</label>
              <select className="form-select" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} required>
                <option value="">Select a student</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.displayName}</option>
                ))}
              </select>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Activity type</label>
                <select className="form-select" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                  <option value="running">Running</option>
                  <option value="walking">Walking</option>
                  <option value="strength">Strength</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Minutes</label>
                <input className="form-control" type="number" min="1" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Points</label>
                <input className="form-control" type="number" min="0" value={form.points} onChange={(event) => setForm({ ...form, points: event.target.value })} />
              </div>
            </div>
            <button className="btn btn-success w-100 mt-3" type="submit">Log activity</button>
          </form>
        </div>
      </div>

      <div className="content-card p-4">
        <h3 className="h5 mb-3">Recent activities</h3>
        {activities.length === 0 ? (
          <p className="text-secondary mb-0">No activities logged yet.</p>
        ) : (
          <div className="list-group list-group-flush">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                <span>{activity.type}</span>
                <span className="text-secondary">{activity.durationMinutes} min · {activity.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamsPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', userId: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const [usersPayload, teamsPayload] = await Promise.all([api.getUsers(), api.getTeams()]);
    setUsers(usersPayload.users ?? []);
    setTeams(teamsPayload.teams ?? []);
    setForm((current) => ({ ...current, userId: usersPayload.users?.[0]?._id ?? current.userId }));
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      await api.createTeam({ name: form.name, description: form.description });
      setStatus(`Created ${form.name}`);
      setForm({ ...form, name: '', description: '' });
      await refresh();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleAddMember = async (teamId) => {
    if (!form.userId) {
      setError('Select a user first');
      return;
    }

    setError('');
    setStatus('');

    try {
      await api.addTeamMember(teamId, { userId: form.userId });
      setStatus('Member added');
      await refresh();
    } catch (memberError) {
      setError(memberError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Team management</p>
          <h2 className="h3 mb-2">Create teams and assign members</h2>
          <p className="mb-0 text-secondary-emphasis">Use the list below to keep competition organized.</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <form className="content-card p-4 h-100" onSubmit={handleCreateTeam}>
            <h3 className="h5 mb-3">Create team</h3>
            <div className="mb-3">
              <label className="form-label">Team name</label>
              <input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <button className="btn btn-dark w-100" type="submit">Create team</button>
          </form>
        </div>

        <div className="col-lg-7">
          <div className="content-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 mb-0">Assign a student to a team</h3>
              <select className="form-select w-auto" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })}>
                <option value="">Choose student</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.displayName}</option>
                ))}
              </select>
            </div>

            {teams.length === 0 ? (
              <p className="text-secondary mb-0">Create the first team to start assigning students.</p>
            ) : (
              <div className="row g-3">
                {teams.map((team) => (
                  <div key={team._id} className="col-md-6">
                    <div className="metric-card h-100">
                      <strong className="fs-5">{team.name}</strong>
                      <span>{team.description || 'No description yet'}</span>
                      <small>{team.memberIds?.length ?? 0} members</small>
                      <button className="btn btn-outline-dark mt-2" type="button" onClick={() => handleAddMember(team._id)}>
                        Add selected student
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderboardPage() {
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form, setForm] = useState({ season: '2026 Spring', teamId: '', score: 0 });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    const [teamsPayload, leaderboardPayload] = await Promise.all([api.getTeams(), api.getLeaderboard()]);
    setTeams(teamsPayload.teams ?? []);
    setLeaderboard(leaderboardPayload.leaderboard ?? []);
    setForm((current) => ({ ...current, teamId: teamsPayload.teams?.[0]?._id ?? current.teamId }));
  };

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  const scoresByTeam = useMemo(() => {
    return leaderboard.reduce((map, entry) => {
      const teamId = entry.teamId?._id ?? entry.teamId;
      map.set(teamId, entry.score);
      return map;
    }, new Map());
  }, [leaderboard]);

  const handleCreateEntry = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      await api.createLeaderboardEntry({
        season: form.season,
        teamId: form.teamId,
        score: Number(form.score)
      });

      setStatus('Leaderboard entry created');
      await refresh();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Leaderboard</p>
          <h2 className="h3 mb-2">Rank teams by season</h2>
          <p className="mb-0 text-secondary-emphasis">Create score snapshots for a season and review the current ranking order.</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <form className="content-card p-4 h-100" onSubmit={handleCreateEntry}>
            <h3 className="h5 mb-3">Create score snapshot</h3>
            <div className="mb-3">
              <label className="form-label">Season</label>
              <input className="form-control" value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Team</label>
              <select className="form-select" value={form.teamId} onChange={(event) => setForm({ ...form, teamId: event.target.value })} required>
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Score</label>
              <input className="form-control" type="number" min="0" value={form.score} onChange={(event) => setForm({ ...form, score: event.target.value })} required />
            </div>
            <button className="btn btn-dark w-100" type="submit">Save score</button>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="content-card p-4 h-100">
            <h3 className="h5 mb-3">Current rankings</h3>
            {leaderboard.length === 0 ? (
              <p className="text-secondary mb-0">No leaderboard entries yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {leaderboard.map((entry, index) => (
                  <div key={entry._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">#{index + 1} {entry.teamId?.name ?? 'Unknown team'}</div>
                      <small className="text-secondary">{entry.season}</small>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{entry.score} pts</div>
                      <small className="text-secondary">Snapshot score</small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 row g-3">
              {teams.slice(0, 4).map((team) => (
                <div key={team._id} className="col-md-6">
                  <div className="metric-card">
                    <span>{team.name}</span>
                    <strong>{scoresByTeam.get(team._id) ?? 0} pts</strong>
                    <small>{team.memberIds?.length ?? 0} members</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Shell>
  );
}