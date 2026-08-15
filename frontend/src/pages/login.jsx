import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* LEFT */}
        <section className="auth-brand-panel">
          <div className="auth-brand">
            <div className="brand-icon">Q</div>
            <span>QuizForge AI</span>
          </div>

          <div className="auth-brand-content">
            <span className="badge">✦ AI-POWERED LEARNING</span>

            <h2>
              Learn smarter.
              <br />
              <span>Quiz better.</span>
            </h2>

            <p>
              Turn your study material into personalized
              AI-generated quizzes and understand every answer.
            </p>

            <div className="auth-points">
              <div className="auth-point">
                <div className="auth-point-icon">✦</div>
                AI-generated questions
              </div>

              <div className="auth-point">
                <div className="auth-point-icon">↑</div>
                Upload your own study material
              </div>

              <div className="auth-point">
                <div className="auth-point-icon">✓</div>
                Learn with detailed explanations
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            © 2026 QuizForge AI
          </div>
        </section>

        {/* RIGHT */}
        <section className="auth-form-panel">
          <div className="auth-card">

            <div className="auth-header">
              <div className="brand-icon">Q</div>

              <h1>Welcome back</h1>

              <p>
                Sign in to continue your learning journey.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">
                Create one
              </Link>
            </p>

            <Link to="/" className="back-home">
              ← Back to QuizForge AI
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;