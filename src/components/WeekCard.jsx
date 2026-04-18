import { useState } from "react";

export default function WeekCard({ week, index }) {
  const [checkedTasks, setCheckedTasks] = useState({});

  const toggleTask = (i) => {
    setCheckedTasks((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div
      className="week-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Week label */}
      <span className="week-card__week-label">{week.week}</span>

      {/* Goal */}
      <h3 className="week-card__goal-title">{week.goal}</h3>

      {/* Learn */}
      <h4 className="week-card__section-title">Learn</h4>
      <ul className="learn-list">
        {week.learn.map((item, i) => (
          <li key={i}>
            {typeof item === "object" ? (item.topic || item.title || item.concept || item.description || Object.values(item)[0]) : item}
          </li>
        ))}
      </ul>

      {/* Tasks */}
      <h4 className="week-card__section-title">Tasks</h4>
      <ul className="task-list">
        {week.tasks.map((task, i) => (
          <li
            key={i}
            className={`task-item${checkedTasks[i] ? " completed" : ""}`}
          >
            <span
              className={`task-checkbox${checkedTasks[i] ? " checked" : ""}`}
              onClick={() => toggleTask(i)}
              role="checkbox"
              aria-checked={!!checkedTasks[i]}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleTask(i);
              }}
            />
            <span className="task-text">
              {typeof task === "object" ? (task.task || task.description || task.title || task.topic || Object.values(task)[0]) : task}
            </span>
          </li>
        ))}
      </ul>

      {/* AI Guidance */}
      <div className="ai-guidance">
        <div className="ai-guidance__header"> AI Guidance</div>

        {/* Use AI */}
        {week.ai_help?.use_ai_for?.length > 0 && (
          <div className="ai-guidance__section">
            <div className="ai-guidance__label">Use AI for</div>
            <ul className="ai-guidance__list">
              {week.ai_help.use_ai_for.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Avoid AI FOR */}
        {week.ai_help?.avoid_ai_for?.length > 0 && (
          <div className="ai-guidance__section">
            <div className="ai-guidance__label">Avoid AI for</div>
            <ul className="ai-guidance__list">
              {week.ai_help.avoid_ai_for.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {week.ai_help?.tips?.length > 0 && (
          <div className="ai-guidance__section">
            <div className="ai-guidance__label"> Tips</div>
            <ul className="ai-guidance__list">
              {week.ai_help.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* (Optional) Prompts */}
        {week.ai_help?.prompts?.length > 0 && (
          <div className="ai-guidance__section">
            <div className="ai-guidance__label"> Suggested Prompts</div>
            <ul className="ai-guidance__list">
              {week.ai_help.prompts.map((prompt, i) => (
                <li key={i}>{prompt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}