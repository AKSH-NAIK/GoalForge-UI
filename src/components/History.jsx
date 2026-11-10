import { useNavigate } from "react-router-dom";

export default function History({ history, setRoadmap, setRoadmapId, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <nav className="navbar">
        <a href="/" className="nav-brand">
          <img src="/favicon.svg" alt="GoalForge Logo" className="nav-logo" />
          goal<span>forge</span>
        </a>

        <div className="nav-actions">
          <button className="btn-secondary" onClick={handleLogout}>logout</button>
        </div>
      </nav>

      <main className="history-view">
        <div className="history-view__header">
          <div>
            <h1 className="text-gradient">saved roadmaps</h1>
            <p>pick up where you left off with one of your saved learning plans.</p>
          </div>
          <button className="btn-ghost" onClick={() => navigate("/app")}>
            &larr; Back to Generator
          </button>
        </div>

        <div className="section-glass">
          <div className="history-grid">
            {history.length === 0 ? (
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>no roadmaps found yet.</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  className="history-card"
                  onClick={() => {
                    setRoadmap(item.data);
                    setRoadmapId(item.id);
                    navigate("/app");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="history-card__title">{item.title}</span>
                  <span className="history-card__duration">{item.duration}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
