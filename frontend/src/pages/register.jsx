import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please try again."
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
            <span className="badge">✦ START LEARNING</span>

            <h2>
              Build your
              <br />
              <span>learning flow.</span>
            </h2>

            <p>
              Create your QuizForge AI account and turn
              your notes, PDFs and study material into
              smarter practice sessions.
            </p>

            <div className="auth-points">
              <div className="auth-point">
                <div className="auth-point-icon">01</div>
                Create your personal account
              </div>

              <div className="auth-point">
                <div className="auth-point-icon">02</div>
                Upload your study material
              </div>

              <div className="auth-point">
                <div className="auth-point-icon">03</div>
                Generate and practice quizzes
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

              <h1>Create your account</h1>

              <p>
                Start turning your study material into
                smarter quizzes.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                {loading
                  ? "Creating account..."
                  : "Create Account →"}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account?{" "}
              <Link to="/login">
                Sign in
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

export default Register;