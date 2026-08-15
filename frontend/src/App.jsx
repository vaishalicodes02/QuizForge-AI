import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Quiz from "./pages/Quiz";
import SubjectDetails from "./pages/SubjectDetails";
import TopicDetails from "./pages/TopicDetails";
import QuizSetup from "./pages/QuizSetup";
import QuizResult from "./pages/QuizResult";

function Home() {
  return (
    <main className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">Q</div>
          <span>QuizForge AI</span>
        </div>

        <div className="nav-actions">
          <button className="btn btn-ghost">Sign In</button>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">
            ✦ AI-powered learning
          </div>

          <h1>
            Turn your study material
            <span> into smarter quizzes.</span>
          </h1>

          <p>
            Upload your notes or PDFs and let QuizForge AI create
            personalized multiple-choice quizzes in seconds.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-large">
              Create your first quiz →
            </button>

            <button className="btn btn-secondary btn-large">
              Explore features
            </button>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <strong>AI</strong>
              <span>Generated questions</span>
            </div>

            <div className="divider" />

            <div className="trust-item">
              <strong>PDF</strong>
              <span>Study material</span>
            </div>

            <div className="divider" />

            <div className="trust-item">
              <strong>∞</strong>
              <span>Practice quizzes</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="quiz-card">
            <div className="quiz-card-top">
              <span className="small-label">QUIZFORGE AI</span>
              <span className="difficulty">Medium</span>
            </div>

            <div className="progress">
              <div className="progress-fill" />
            </div>

            <p className="question-number">Question 03 of 10</p>

            <h2>
              Which approach is commonly used to
              train a machine learning model?
            </h2>

            <div className="options">
              <div className="option">
                <span>A</span>
                Supervised learning
              </div>

              <div className="option selected">
                <span>B</span>
                Reinforcement learning
                <b>✓</b>
              </div>

              <div className="option">
                <span>C</span>
                Manual programming
              </div>

              <div className="option">
                <span>D</span>
                Static compilation
              </div>
            </div>

            <button className="next-button">
              Next question →
            </button>
          </div>

          <div className="floating-card floating-top">
            <span>✦</span>
            AI Generated
          </div>

          <div className="floating-card floating-bottom">
            <strong>92%</strong>
            <span>Quiz score</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-heading">
          <span className="badge">BUILT FOR BETTER LEARNING</span>

          <h2>
            Everything you need to
            <span> learn smarter.</span>
          </h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">↑</div>
            <h3>Upload your material</h3>
            <p>
              Upload PDFs, lecture notes and study material
              to create quizzes from your own content.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✦</div>
            <h3>AI-generated questions</h3>
            <p>
              Generate meaningful multiple-choice questions
              based directly on your study material.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Learn from explanations</h3>
            <p>
              Review your answers and understand why each
              answer is correct.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/subjects/:subjectId"
        element={<SubjectDetails />}
      />
      <Route
       path="/subjects/:subjectId/topics/:topicId"
       element={<TopicDetails />}
      />
      <Route
       path="/quiz-setup/:materialId"
       element={<QuizSetup />}
      />
      <Route
        path="/quiz/:materialId"
        element={<Quiz />}
      />
      <Route
        path="/quiz/:materialId/result"
        element={<QuizResult />}
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;