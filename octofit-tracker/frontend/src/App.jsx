import { NavLink, Route, Routes } from 'react-router-dom';

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

function HomePage() {
  return (
    <section className="content-card p-4 p-md-5">
      <h2 className="h3 mb-3">Student progress at a glance</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="metric-card">
            <span>Active students</span>
            <strong>48</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="metric-card">
            <span>This week</span>
            <strong>186 activities</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="metric-card">
            <span>Top team</span>
            <strong>Blue Hawks</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitiesPage() {
  return (
    <section className="content-card p-4 p-md-5">
      <h2 className="h3 mb-3">Activity logging</h2>
      <p className="mb-0">Log runs, walks, and strength workouts while the API and database layer come online.</p>
    </section>
  );
}

function TeamsPage() {
  return (
    <section className="content-card p-4 p-md-5">
      <h2 className="h3 mb-3">Team management</h2>
      <p className="mb-0">Create teams, assign students, and prepare for monthly challenges.</p>
    </section>
  );
}

function LeaderboardPage() {
  return (
    <section className="content-card p-4 p-md-5">
      <h2 className="h3 mb-3">Leaderboard</h2>
      <p className="mb-0">Track friendly competition and reward consistent participation.</p>
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