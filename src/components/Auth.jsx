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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

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
    console.log("SIGNUP FUNCTION CALLED");
    setLoading(true);
    setErrorMsg("");

    try {
      console.log("Signup triggered");
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // On success, session state in App.jsx will trigger redirect
        navigate("/app");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // On success, show toast and switch to login
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        showToast("Registration successful. Please check your email to verify your account and sign in again.");
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card section-glass" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/favicon.svg" alt="GoalForge Logo" className="nav-logo" style={{ width: '48px', height: '48px', marginBottom: 'var(--space-md)' }} />
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-light)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease' }}>
              <label>confirm password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    color: 'var(--color-text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-dim)'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
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

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
