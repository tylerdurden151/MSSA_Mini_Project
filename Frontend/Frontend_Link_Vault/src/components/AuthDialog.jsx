import { useState } from "react";
import "./AuthDialog.css";

// Mock-only "account" for local testing — stands in for the real login the
// capstone will eventually have against a real backend. Not a security
// boundary, just enough to make Log In feel real while gating the mock
// links/categories that already live in App's state.
const MOCK_ACCOUNT = {
  name: "Timothy Eckart",
  username: "timothy",
  password: "video123",
};

function AuthDialog({ mode, onModeChange, onAuth, onClose }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  // Login's field is a username; Signup's is an email. Same state either
  // way — only the label, placeholder, and input type change per mode.
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (isSignup) {
      if (name.trim() === "" || identifier.trim() === "" || password === "")
        return;
      onAuth({ name: name.trim() });
      return;
    }

    // Login: check the typed credentials against the one stored mock account
    const matches =
      identifier.trim().toLowerCase() === MOCK_ACCOUNT.username &&
      password === MOCK_ACCOUNT.password;

    if (!matches) {
      setError("Incorrect username or password.");
      return;
    }

    onAuth({ name: MOCK_ACCOUNT.name });
  }

  return (
    <div
      className="dialog-backdrop"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="dialog-title" id="auth-title">
          {isSignup ? "Sign up" : "Log in"}
        </h2>

        <div className="dialog-body">
          {isSignup && (
            <label className="field">
              Name
              <input
                className="input"
                autoFocus
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className="field">
            {isSignup ? "Email" : "Username"}
            <input
              className="input"
              autoFocus={!isSignup}
              type={isSignup ? "email" : "text"}
              placeholder={isSignup ? "you@example.com" : "timothy"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>

          <label className="field">
            Password
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {!isSignup && (
            <p className="auth-hint">Demo login: timothy / video123</p>
          )}

          {error && <p className="auth-error">{error}</p>}
        </div>

        <div className="dialog-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit}>
            {isSignup ? "Sign up" : "Log in"}
          </button>
        </div>

        <button
          className="auth-switch"
          onClick={() => {
            setError("");
            onModeChange(isSignup ? "login" : "signup");
          }}
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default AuthDialog;
