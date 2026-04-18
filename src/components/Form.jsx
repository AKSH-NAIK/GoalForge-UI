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
      <h2 className="form-card__title">Create Your Roadmap</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="goal">Learning Goal</label>
            <input
              id="goal"
              placeholder="e.g. Learn React.js"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              placeholder="e.g. 4 weeks"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Skill Level</label>
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
            <label htmlFor="knowledge">Existing Knowledge</label>
            <input
              id="knowledge"
              placeholder="e.g. HTML, CSS basics"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Generating…" : " Generate Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}