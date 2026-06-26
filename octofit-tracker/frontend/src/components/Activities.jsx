import { useEffect, useState } from 'react';

import { api, apiBaseUrl } from '../api.js';

export function Activities() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [userForm, setUserForm] = useState({ displayName: '', email: '', gradeLevel: '' });
  const [activityForm, setActivityForm] = useState({ userId: '', type: 'running', durationMinutes: 30, points: 10 });

  const loadData = async () => {
    const [nextUsers, nextActivities] = await Promise.all([api.getUsers(), api.getActivities()]);
    setUsers(nextUsers);
    setActivities(nextActivities);
    setActivityForm((current) => ({ ...current, userId: nextUsers[0]?._id ?? current.userId }));
  };

  useEffect(() => {
    loadData().catch(() => undefined);
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const payload = await api.createUser(userForm);
      setStatus(`Created ${payload.user.displayName}`);
      setUserForm({ displayName: '', email: '', gradeLevel: '' });
      setActivityForm((current) => ({ ...current, userId: payload.user._id }));
      await loadData();
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
        userId: activityForm.userId,
        type: activityForm.type,
        durationMinutes: Number(activityForm.durationMinutes),
        points: Number(activityForm.points)
      });

      setStatus('Activity logged');
      await loadData();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Activities</p>
          <h2 className="h3 mb-2">Track workouts and activity logs</h2>
          <p className="mb-0 text-secondary-emphasis">Connected to {apiBaseUrl}</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <form className="content-card p-4 h-100" onSubmit={handleCreateUser}>
            <h3 className="h5 mb-3">Create user</h3>
            <div className="mb-3">
              <label className="form-label">Display name</label>
              <input className="form-control" value={userForm.displayName} onChange={(event) => setUserForm({ ...userForm, displayName: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Grade level</label>
              <input className="form-control" value={userForm.gradeLevel} onChange={(event) => setUserForm({ ...userForm, gradeLevel: event.target.value })} />
            </div>
            <button className="btn btn-dark w-100" type="submit">Create user</button>
          </form>
        </div>

        <div className="col-lg-6">
          <form className="content-card p-4 h-100" onSubmit={handleCreateActivity}>
            <h3 className="h5 mb-3">Log activity</h3>
            <div className="mb-3">
              <label className="form-label">Student</label>
              <select className="form-select" value={activityForm.userId} onChange={(event) => setActivityForm({ ...activityForm, userId: event.target.value })} required>
                <option value="">Select a student</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.displayName}</option>
                ))}
              </select>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Activity type</label>
                <select className="form-select" value={activityForm.type} onChange={(event) => setActivityForm({ ...activityForm, type: event.target.value })}>
                  <option value="running">Running</option>
                  <option value="walking">Walking</option>
                  <option value="strength">Strength</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Minutes</label>
                <input className="form-control" type="number" min="1" value={activityForm.durationMinutes} onChange={(event) => setActivityForm({ ...activityForm, durationMinutes: event.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Points</label>
                <input className="form-control" type="number" min="0" value={activityForm.points} onChange={(event) => setActivityForm({ ...activityForm, points: event.target.value })} />
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
            {activities.map((activity) => (
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