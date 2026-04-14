import { useState } from "react";
import Form from "./components/Form";
import Roadmap from "./components/Roadmap";

const API_URL = "http://localhost:5000/api/generate-plan";

export default function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePlan = async (formData) => {
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // 🔥 FIX HERE
      setRoadmap(data.result);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header__title">
          Goal<span className="header__accent">Forge</span>
        </h1>
        <p className="header__subtitle">
          AI-powered learning roadmap generator. Craft your path to mastery.
        </p>
        <span className="header__bar" />
      </header>

      <Form onSubmit={handleGeneratePlan} isLoading={loading} />

      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Generating your roadmap…</p>
        </div>
      )}

      {/* 🔥 FIX HERE */}
      {!loading && roadmap && <Roadmap roadmap={roadmap} />}
    </div>
  );
}