export default function WeekCard({ week, index, toggleTask }) {

  const isTaskDone = (task) => {
    if (typeof task === "object") return !!task.done;
    return false;
  };

  const getTaskText = (task) => {
    if (typeof task === "object") {
      return (
        task.text ||
        task.task ||
        task.description ||
        task.title ||
        Object.values(task)[0]
      );
    }
    return task;
  };

  return (
    <div
      className="week-card section-glass"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="week-badge">week {week.week}</div>

      <div className="week-card__header" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 className="week-card__goal-title" style={{ fontSize: '1.4rem', color: 'var(--color-primary-light)' }}>
          {week.goal}
        </h3>
      </div>

      <div className="week-grid">
        <div className="content-section">
          <h4><span>📚</span> core concepts</h4>
          <ul className="content-list">
            {(week.learn || []).map((item, i) => (
              <li key={i}>
                <span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold' }}>•</span>
                {typeof item === "object"
                  ? (
                    item.topic ||
                    item.title ||
                    item.concept ||
                    item.description ||
                    Object.values(item)[0]
                  )
                  : item}
              </li>
            ))}
          </ul>
        </div>

        <div className="content-section">
          <h4><span>✅</span> practical tasks</h4>
          <ul className="content-list">
            {(week.tasks || []).map((task, i) => (
              <li
                key={i}
                className={isTaskDone(task) ? "completed" : ""}
              >
                <div
                  className={`custom-checkbox ${isTaskDone(task) ? "checked" : ""}`}
                  onClick={() => toggleTask(index, i)}
                  role="checkbox"
                  aria-checked={isTaskDone(task)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleTask(index, i);
                    }
                  }}
                />
                <span className="task-text">
                  {getTaskText(task)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ai-box">
        <header><span>🤖</span> ai intelligence layer</header>

        <div className="grid-2" style={{ gap: 'var(--space-lg)' }}>
          {week.ai_help?.use_ai_for?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>optimize with ai</div>
              <ul className="content-list" style={{ fontSize: '0.85rem' }}>
                {week.ai_help.use_ai_for.map((item, i) => (
                  <li key={i} style={{ padding: '2px 0', border: 'none' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {week.ai_help?.avoid_ai_for?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '4px' }}>human-only focus</div>
              <ul className="content-list" style={{ fontSize: '0.85rem' }}>
                {week.ai_help.avoid_ai_for.map((item, i) => (
                  <li key={i} style={{ padding: '2px 0', border: 'none' }}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {week.ai_help?.tips?.length > 0 && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'hsla(var(--h), var(--s), 40%, 0.05)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary-light)', marginBottom: '6px' }}>💡 expert tips</div>
            <ul className="content-list" style={{ border: 'none' }}>
              {week.ai_help.tips.map((tip, i) => (
                <li key={i} style={{ padding: '2px 0', border: 'none', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {week.ai_help?.prompts?.length > 0 && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '8px' }}>💬 suggested prompts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {week.ai_help.prompts.map((prompt, i) => (
                <div key={i} className="glass" style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>"{prompt}"</span>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '4px 10px', fontSize: '0.7rem', height: 'auto' }}
                    onClick={() => {
                      navigator.clipboard.writeText(prompt);
                      // Simple feedback
                      const btn = event.currentTarget;
                      const oldText = btn.innerText;
                      btn.innerText = 'copied!';
                      setTimeout(() => btn.innerText = oldText, 2000);
                    }}
                  >
                    copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}