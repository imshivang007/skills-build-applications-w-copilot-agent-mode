import { useEffect, useState } from 'react';

import { api, apiBaseUrl } from '../api.js';

const teamsApiEndpoint = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams`
  : 'http://localhost:8000/api/teams';

export function Teams() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', userId: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [nextUsers, nextTeams] = await Promise.all([api.getUsers(), api.getTeams()]);
    setUsers(nextUsers);
    setTeams(nextTeams);
    setForm((current) => ({ ...current, userId: nextUsers[0]?._id ?? current.userId }));
  };

  useEffect(() => {
    loadData().catch(() => undefined);
  }, []);

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      await api.createTeam({ name: form.name, description: form.description });
      setStatus(`Created ${form.name}`);
      setForm((current) => ({ ...current, name: '', description: '' }));
      await loadData();
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
      await loadData();
    } catch (memberError) {
      setError(memberError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Teams</p>
          <h2 className="h3 mb-2">Create teams and assign members</h2>
          <p className="mb-0 text-secondary-emphasis">Connected to {apiBaseUrl}</p>
          <p className="mb-0 text-secondary-emphasis">Endpoint: {teamsApiEndpoint}</p>
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