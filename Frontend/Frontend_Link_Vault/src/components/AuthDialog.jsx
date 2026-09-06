import { useState } from "react";
import { API_BASE_URL } from "../config";
import "./AuthDialog.css";

function AuthDialog({ mode, onModeChange, onAuth, onClose }) {
  const isSignup = mode === "signup";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit() {
    setError("");
    //If Signup, check if all fields are filled. If Login, check if email and password are filled.
    if (isSignup) {
      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        email.trim() === "" ||
        password === ""
      ) {
        return;
      }
    } else if (email.trim() === "" || password === "") {
      return;
    }

    setSubmitting(true);

    // try to send the request to the backend API for signup or login
    try {
      const endpoint = isSignup ? "register" : "login";

      const body = isSignup
        ? {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            passwordHash: password,
          }
        : {
            email: email.trim(),
            passwordHash: password,
          };

      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      //error handling for the response
      if (!response.ok) {
        if (response.status === 409) {
          setError("An account with that email already exists.");
        } else if (response.status === 401) {
          setError("Incorrect email or password.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      const user = await response.json();
      onAuth(user);
    } catch {
      setError("Couldn't reach the server. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      // The backdrop covers the entire screen and closes the dialog when clicked
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
            <>
              <label className="field">
                First name
                <input
                  className="input"
                  autoFocus
                  placeholder="Your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="field">
                Last name
                <input
                  className="input"
                  placeholder="Your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </>
          )}

          <label className="field">
            Email
            <input
              className="input"
              autoFocus={!isSignup}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            Password
            <div className="password-wrapper">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A9.94 9.94 0 0 1 12 4c5 0 9 4 10 8-.35 1.24-1 2.4-1.86 3.4M6.6 6.6C4.5 8 3.1 10 2 12c1 4 5 8 10 8 1.2 0 2.36-.22 3.4-.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
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
          <button
            className="btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "..." : isSignup ? "Sign up" : "Log in"}
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
