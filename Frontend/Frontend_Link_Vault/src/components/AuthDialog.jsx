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
