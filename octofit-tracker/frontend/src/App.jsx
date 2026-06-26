import { NavLink, Route, Routes } from 'react-router-dom';

import { Activities } from './components/Activities.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { Teams } from './components/Teams.jsx';
import { Users } from './components/Users.jsx';
import { Workouts } from './components/Workouts.jsx';
import { apiBaseUrl } from './api.js';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/users', label: 'Users' },
  { to: '/activities', label: 'Activities' },
  { to: '/teams', label: 'Teams' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' }
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

function HomePage() {
  return (
    <section className="content-card p-4 p-md-5">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-end mb-4">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h2 className="h3 mb-2">Student progress at a glance</h2>
          <p className="mb-0 text-secondary-emphasis">
            Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> so the UI can build the
            Codespaces API URL automatically.
          </p>
        </div>
        <div className="badge text-bg-light border border-secondary-subtle rounded-pill px-3 py-2">
          API base URL: {apiBaseUrl}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="metric-card">
            <span>Users</span>
            <strong>Profiles</strong>
            <small>Register students and track total points.</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="metric-card">
            <span>Activities</span>
            <strong>Logs</strong>
            <small>Capture running, walking, and strength sessions.</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="metric-card">
            <span>Workouts</span>
            <strong>Plans</strong>
            <small>Curate personalized workout suggestions.</small>
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
        <Route path="/users" element={<Users />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </Shell>
  );
}