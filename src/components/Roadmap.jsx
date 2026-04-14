import WeekCard from "./WeekCard";

export default function Roadmap({ roadmap }) {
  return (
    <div className="roadmap">
      <div className="roadmap__header">
        <h2 className="roadmap__title">📍 Your Learning Roadmap</h2>
        <p className="roadmap__duration">
          {roadmap.weeks?.length} week{roadmap.weeks?.length !== 1 ? "s" : ""} to reach your goal
        </p>
      </div>

      {roadmap.weeks.map((week, index) => (
        <WeekCard key={index} week={week} index={index} />
      ))}
    </div>
  );
}