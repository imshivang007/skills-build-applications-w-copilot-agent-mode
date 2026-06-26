import { useEffect, useMemo, useState } from 'react';

import { api, apiBaseUrl } from '../api.js';

export function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form, setForm] = useState({ season: '2026 Spring', teamId: '', score: 0 });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [nextTeams, nextLeaderboard] = await Promise.all([api.getTeams(), api.getLeaderboard()]);
    setTeams(nextTeams);
    setLeaderboard(nextLeaderboard);
    setForm((current) => ({ ...current, teamId: nextTeams[0]?._id ?? current.teamId }));
  };

  useEffect(() => {
    loadData().catch(() => undefined);
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
      await loadData();
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
          <p className="mb-0 text-secondary-emphasis">Connected to {apiBaseUrl}</p>
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