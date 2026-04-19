import { useState } from "react";

export default function Form({ onSubmit, isLoading }) {
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [knowledge, setKnowledge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      goal,
      duration,
      level,
      knowledge,
    });
  };

  return (
    <div className="form-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--color-primary-light)' }}>✦</span> roadmap configuration
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="goal">learning goal</label>
            <input
              id="goal"
              placeholder="e.g. master react.js"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">duration</label>
            <input
              id="duration"
              placeholder="e.g. 4 weeks"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">skill level</label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="knowledge">existing knowledge</label>
            <input
              id="knowledge"
              placeholder="e.g. html, css basics"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" type="submit" disabled={isLoading} style={{ minWidth: '180px' }}>
            {isLoading ? (
              <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
            ) : (
              "forge roadmap"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}