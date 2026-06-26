import { useEffect, useState } from 'react';

import { api, apiBaseUrl } from '../api.js';

export function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ displayName: '', email: '', gradeLevel: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setUsers(await api.getUsers());
  };

  useEffect(() => {
    loadUsers().catch(() => undefined);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    try {
      const payload = await api.createUser(form);
      setForm({ displayName: '', email: '', gradeLevel: '' });
      setStatus(`Created ${payload.user.displayName}`);
      await loadUsers();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Users</p>
          <h2 className="h3 mb-2">Manage student profiles</h2>
          <p className="mb-0 text-secondary-emphasis">API base URL: {apiBaseUrl}</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4">
        <div className="col-lg-5">
          <form className="content-card p-4 h-100" onSubmit={handleSubmit}>
            <h3 className="h5 mb-3">Create user</h3>
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
            <button className="btn btn-dark w-100" type="submit">Create user</button>
          </form>
        </div>

        <div className="col-lg-7">
          <div className="content-card p-4 h-100">
            <h3 className="h5 mb-3">Current users</h3>
            {users.length === 0 ? (
              <p className="text-secondary mb-0">No users yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {users.map((user) => (
                  <div key={user._id} className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                    <span>
                      <span className="fw-semibold d-block">{user.displayName}</span>
                      <small className="text-secondary">{user.email}</small>
                    </span>
                    <span className="text-secondary">{user.gradeLevel || 'No grade'} · {user.totalPoints ?? 0} pts</span>
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