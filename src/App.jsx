import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Form from "./components/Form";
import Roadmap from "./components/Roadmap";
import Auth from "./components/Auth";
import Landing from "./components/Landing";
import History from "./components/History";

const API_URL = "https://goalforge-backend.onrender.com/api/generate-plan";
export default function App() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [roadmap, setRoadmap] = useState(null);
  const [roadmapId, setRoadmapId] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [lastForm, setLastForm] = useState(null);

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

  useEffect(() => {
    if (session) fetchRoadmaps();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // SAVE OR UPDATE

  const saveRoadmap = async (roadmapData) => {
    console.log("Updating ID:", roadmapId);
    console.log("Sending to DB:", JSON.stringify(roadmapData.weeks[0].tasks, null, 2));
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return "No user";

    // UPDATE
    if (roadmapId) {
      const { data, error } = await supabase
        .from("roadmaps")
        .update({
          title: roadmapData.title,
          duration: roadmapData.duration,
          data: roadmapData
        })
        .eq("id", roadmapId)
        .select()
        .single();

      console.log("Saved row from DB:", data?.data?.weeks?.[0]?.tasks);

      return error;
    }

    // INSERT
    const { data, error } = await supabase
      .from("roadmaps")
      .insert([
        {
          user_id: user.id,
          title: roadmapData.title,
          duration: roadmapData.duration,
          data: roadmapData
        }
      ])
      .select()
      .single();

    if (!error) {
      setRoadmapId(data.id);
    }

    return error;
  };

  const handleSave = async () => {
    console.log("Before Save:", roadmap.weeks[0].tasks);
    if (!roadmap || saving) return;

    setSaving(true);

    // force fresh object to avoid stale reference
    const cleanRoadmap = JSON.parse(JSON.stringify(roadmap));

    const error = await saveRoadmap(cleanRoadmap);

    if (error) {
      showToast("Failed to save roadmap", "error");
    } else {
      showToast("Roadmap saved");
      fetchRoadmaps();
    }

    setSaving(false);
  };

  // GENERATE / CONTINUE
  const handleGeneratePlan = async (formData = null) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    if (formData) {
      setLastForm(formData);
      setRoadmapId(null);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(formData || lastForm),
          previousWeeks: roadmap?.weeks || []
        }),
      });

      const data = await response.json();

      setRoadmap((prev) => {
        if (!prev) return data.result;

        return {
          ...data.result,
          weeks: [...prev.weeks, ...data.result.weeks]
        };
      });

    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg)' }}>
      <div className="spinner" />
    </div>
  );

  const MainApp = () => (
    <div className="app-container">
      <nav className="navbar">
        <a href="/" className="nav-brand">
          <img src="/favicon.svg" alt="GoalForge Logo" className="nav-logo" />
          goal<span>forge</span>
        </a>

        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/app/history")}>
            view history
          </button>
          <button className="btn-secondary" onClick={handleLogout}>logout</button>
        </div>
      </nav>

      {!roadmap && (
        <section className="hero">
          <h1 className="text-gradient">forging your path to mastery.</h1>
          <p>generate precise, ai-driven learning roadmaps tailored to your unique goals and skill level.</p>
        </section>
      )}

      <div className="section-glass" style={{ marginBottom: 'var(--space-xl)' }}>
        <Form
          onSubmit={(data) => handleGeneratePlan(data)}
          isLoading={loading || saving}
        />
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">forging roadmap...</p>
        </div>
      )}

      {roadmap && !loading && (
        <div>
          <Roadmap roadmap={roadmap} setRoadmap={setRoadmap} />

          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "saving..." : "save roadmap"}
            </button>

            <button className="btn-secondary" onClick={() => handleGeneratePlan()} disabled={loading}>
              continue plan
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth"
        element={session ? <Navigate to="/app" /> : <Auth />}
      />
      <Route
        path="/app"
        element={session ? <MainApp /> : <Navigate to="/auth" />}
      />
      <Route
        path="/app/history"
        element={
          session ? (
            <History
              history={history}
              setRoadmap={setRoadmap}
              setRoadmapId={setRoadmapId}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}