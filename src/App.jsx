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
  const [roadmapId, setRoadmapId] = useState(null);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (session) fetchRoadmaps();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // SAVE OR UPDATE
  const saveRoadmap = async (roadmapData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return "No user";

    // UPDATE if already exists
    if (roadmapId) {
      const { error } = await supabase
        .from("roadmaps")
        .update({
          title: roadmapData.title,
          duration: roadmapData.duration,
          data: roadmapData
        })
        .eq("id", roadmapId);

      return error;
    }

    // INSERT first time
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
    if (!roadmap || saving) return;

    setSaving(true);

    const error = await saveRoadmap(roadmap);

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
      setRoadmapId(null); // new roadmap
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
        <a href="/" className="nav-brand">goal<span>forge</span></a>
        
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "close history" : "view history"}
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

      {showHistory && (
        <div className="section-glass" style={{ marginBottom: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.25rem' }}>past roadmaps</h3>
          <div className="history-grid">
            {history.length === 0 ? (
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>no roadmaps found yet.</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() => {
                    setRoadmap(item.data);
                    setRoadmapId(item.id);
                    setShowHistory(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="history-card__title">{item.title}</div>
                  <div className="history-card__duration" style={{ fontSize: '0.8rem', opacity: 0.6 }}>{item.duration}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '4rem 0' }}>
          <div className="spinner" />
          <p className="loading-text" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>forging roadmap...</p>
        </div>
      )}

      {roadmap && !loading && (
        <div style={{ animation: 'fadeInUp 0.6s ease' }}>
          <Roadmap roadmap={roadmap} setRoadmap={setRoadmap} />
          
          <div className="form-actions" style={{ 
            marginTop: 'calc(var(--space-unit) * 12)', 
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-lg)'
          }}>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: '200px' }}>
              {saving ? "saving..." : "💾 save roadmap"}
            </button>

            <button className="btn-secondary" onClick={() => handleGeneratePlan()} disabled={loading} style={{ minWidth: '200px' }}>
              ✨ continue plan
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
             {toast.type === 'error' ? '❌' : '✅'} {toast.message}
          </div>
        </div>
      )}

      {/* Scroll to top fab */}
      <button 
        className="btn-primary" 
        style={{ 
          position: 'fixed', 
          bottom: 'var(--space-xl)', 
          right: 'var(--space-xl)', 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%',
          padding: 0,
          opacity: roadmap ? 1 : 0, 
          pointerEvents: roadmap ? 'auto' : 'none',
          transition: 'all 0.3s ease'
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
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