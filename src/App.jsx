import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Form from "./components/Form";
import Roadmap from "./components/Roadmap";
import Auth from "./components/Auth";

const API_URL = "http://localhost:5000/api/generate-plan";

export default function App() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FETCH HISTORY
  const fetchRoadmaps = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setHistory(data);
  };

  // SESSION INIT
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // FETCH HISTORY AFTER LOGIN
  useEffect(() => {
    if (session) fetchRoadmaps();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // SAVE
  const saveRoadmap = async (roadmapData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return "No user";

    const { error } = await supabase
      .from("roadmaps")
      .insert([
        {
          user_id: user.id,
          title: roadmapData.title,
          duration: roadmapData.duration,
          data: roadmapData
        }
      ]);

    return error;
  };

  const handleSave = async () => {
    if (!roadmap) return;

    setSaving(true);
    setSaveStatus("saving");

    const error = await saveRoadmap(roadmap);

    if (error) {
      setSaveStatus("error");
      showToast("Failed to save roadmap.", "error");
    } else {
      setSaveStatus("success");
      setSaved(true);
      showToast("Roadmap saved successfully!", "success");
      fetchRoadmaps();
    }

    setSaving(false);
  };

  //  GENERATE / CONTINUE
  const handleGeneratePlan = async (formData = null) => {
    setLoading(true);
    setError(null);
    setSaveStatus(null);
    setSaved(false);

    if (formData) setLastForm(formData);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formData || lastForm),


          previousWeeks: roadmap?.weeks || []
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();


      setRoadmap((prev) => ({
        ...data.result,
        weeks: [...(prev?.weeks || []), ...data.result.weeks]
      }));

    } catch (err) {
      setError(err.message || "Something went wrong.");
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return <div>Loading...</div>;
  }

  const MainApp = () => (
    <div className="app-container">

      <div className="header">
        <h1 className="header__title">
          Goal<span className="header__accent">Forge</span>
        </h1>
        <p className="header__subtitle">Build your future with structured AI roadmaps</p>
        <span className="header__bar"></span>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "var(--space-xl)" }}>
        <button className="btn-secondary" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "View History"}
        </button>

        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Form
        onSubmit={(data) => handleGeneratePlan(data)}
        isLoading={loading || saving}
      />

      {/* HISTORY MODAL */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Your History</h3>
              <button className="modal-close" onClick={() => setShowHistory(false)}>&times;</button>
            </div>
            
            {history.length === 0 ? (
              <p style={{ color: "var(--color-text-secondary)", textAlign: "center" }}>No history found.</p>
            ) : (
              <div className="history-grid">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="history-card"
                    onClick={() => {
                      setRoadmap(item.data);
                      setShowHistory(false);
                    }}
                  >
                    <div className="history-card__title">{item.title}</div>
                    <div className="history-card__duration">{item.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Forging your path...</p>
        </div>
      )}

      {roadmap && !loading && (
        <>
          <Roadmap roadmap={roadmap} />

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "var(--space-xl)" }}>
            <button className="btn-secondary" onClick={handleSave} disabled={saving || saved}>
              {saved ? "Saved" : saving ? "Saving..." : "Save Roadmap"}
            </button>

            <button className="btn-primary" onClick={() => handleGeneratePlan()}>
              Continue Plan
            </button>
          </div>
        </>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>
            <span className="toast-icon">
              {toast.type === "error" ? "⚠️" : "✨"}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Routes>
      <Route
        path="/auth"
        element={session ? <Navigate to="/" /> : <Auth />}
      />
      <Route
        path="/"
        element={session ? <MainApp /> : <Navigate to="/auth" />}
      />
    </Routes>
  );
}