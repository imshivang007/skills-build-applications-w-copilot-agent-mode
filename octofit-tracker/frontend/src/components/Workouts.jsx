import { useEffect, useState } from 'react';

import { api, apiBaseUrl } from '../api.js';

export function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: '', focusArea: '', targetMinutes: 20 });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setWorkouts(await api.getWorkouts());
  };

  useEffect(() => {
    loadData().catch(() => undefined);
  }, []);

  const handleCreateWorkout = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const payload = await api.createWorkout({
        name: form.name,
        focusArea: form.focusArea,
        targetMinutes: Number(form.targetMinutes)
      });

      setStatus(`Created ${payload.workout.name}`);
      setForm({ name: '', focusArea: '', targetMinutes: 20 });
      await loadData();
    } catch (createError) {
      setError(createError.message);
    }
  };

  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Workouts</p>
          <h2 className="h3 mb-2">Curate workout suggestions</h2>
          <p className="mb-0 text-secondary-emphasis">Connected to {apiBaseUrl}</p>
        </div>
        {status ? <div className="alert alert-success mb-0 py-2 px-3">{status}</div> : null}
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <form className="content-card p-4 h-100" onSubmit={handleCreateWorkout}>
            <h3 className="h5 mb-3">Create workout</h3>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Focus area</label>
              <input className="form-control" value={form.focusArea} onChange={(event) => setForm({ ...form, focusArea: event.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Target minutes</label>
              <input className="form-control" type="number" min="1" value={form.targetMinutes} onChange={(event) => setForm({ ...form, targetMinutes: event.target.value })} required />
            </div>
            <button className="btn btn-dark w-100" type="submit">Save workout</button>
          </form>
        </div>

        <div className="col-lg-8">
          <div className="content-card p-4 h-100">
            <h3 className="h5 mb-3">Available workouts</h3>
            {workouts.length === 0 ? (
              <p className="text-secondary mb-0">No workouts available yet.</p>
            ) : (
              <div className="row g-3">
                {workouts.map((workout) => (
                  <div key={workout._id} className="col-md-6">
                    <div className="metric-card h-100">
                      <strong className="fs-5">{workout.name}</strong>
                      <span>{workout.focusArea}</span>
                      <small>{workout.targetMinutes} target minutes</small>
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