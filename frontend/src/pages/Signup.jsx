import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup({ onSignup }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await onSignup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (e) {
      setError(
        e.message || "Could not create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-brand signup-brand">
          <div className="brand-icon">✓</div>

          <span className="eyebrow">TODO LIST</span>

          <h1>
            Your tasks.
            <br />
            Your progress.
            <br />
            Your productivity.
          </h1>

          <p>
            Create your free account and start organizing
            everything you need to accomplish.
          </p>

          <div className="quote">
            <span>"</span>

            <p>
              A clear task list makes a clear mind.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="auth-card">

          <div className="auth-header">
            <span className="mobile-eyebrow">TODO LIST</span>

            <h2>Create your account</h2>

            <p>
              Start managing your tasks in seconds.
            </p>
          </div>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full name</label>

              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                autoComplete="name"
                required
              />
            </div>

            <div className="input-group">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                minLength={6}
                autoComplete="new-password"
                required
              />

              <small className="input-hint">
                Use at least 6 characters.
              </small>
            </div>

            <button
              type="submit"
              className="primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;