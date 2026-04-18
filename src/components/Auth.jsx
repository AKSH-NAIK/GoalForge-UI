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
    <div className="auth-container">
      {/* Background glow effects */}
      <div className="auth-glow auth-glow--top"></div>
      <div className="auth-glow auth-glow--bottom"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="header__title" style={{ fontSize: "2.2rem" }}>
            Goal<span className="header__accent">Forge</span>
          </h1>
          <p className="auth-tagline">Build your future with structured AI roadmaps</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error fade-in">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="auth-form fade-slide-up">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          {!isLogin && (
            <div className="form-group fade-in">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-small" />
            ) : isLogin ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="btn-google"
          disabled={loading}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
