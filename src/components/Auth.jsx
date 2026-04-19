import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // On success, session state in App.jsx will trigger redirect
        navigate("/");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Show generic success or switch to login page
        setIsLogin(true);
        setErrorMsg("Signup successful. Please sign in."); // acts as a success message for a brief moment
      }
    } catch (error) {
      if (error.message !== "Signup successful. Please sign in.") {
        setErrorMsg(error.message);
      }
    } finally {
      if (errorMsg !== "Signup successful. Please sign in.") {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card section-glass" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: 'var(--space-xs)' }}>
            goalforge
          </h1>
          <p className="auth-tagline" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>build your future with structured ai roadmaps</p>
        </div>

        <div className="auth-tabs" style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)' }}>
          <button
            className={`auth-tab btn-ghost ${isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(true)}
            style={{ flex: 1, color: isLogin ? 'var(--color-primary-light)' : 'var(--color-text-dim)', borderBottom: isLogin ? '2px solid var(--color-primary-light)' : '2px solid transparent', borderRadius: 0 }}
          >
            login
          </button>
          <button
            className={`auth-tab btn-ghost ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(false)}
            style={{ flex: 1, color: !isLogin ? 'var(--color-primary-light)' : 'var(--color-text-dim)', borderBottom: !isLogin ? '2px solid var(--color-primary-light)' : '2px solid transparent', borderRadius: 0 }}
          >
            register
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error" style={{ padding: 'var(--space-md)', background: 'hsla(0, 80%, 60%, 0.1)', border: '1px solid hsla(0, 80%, 60%, 0.2)', color: '#ff8080', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label>email address</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease' }}>
              <label>confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: '14px', marginTop: 'var(--space-md)' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
            ) : isLogin ? (
              "log in to dashboard"
            ) : (
              "create account"
            )}
          </button>
        </form>

        <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', margin: 'var(--space-xl) 0', color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          <span>secure connect</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn-secondary"
          disabled={loading}
          style={{ width: '100%', padding: '12px' }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
          continue with google
        </button>
      </div>
    </div>
  );
}
