import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../api/subjects";
import "./Dashboard.css";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); 

    const [subjects, setSubjects] = useState([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);
    const [subjectsError, setSubjectsError] = useState("");

    const handleLogout = () => {
    logout();
    navigate("/login");
};
useEffect(() => {
  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      setSubjectsError("Could not load subjects.");
    } finally {
      setSubjectsLoading(false);
    }
  };

  loadSubjects();
}, []);

  return (
    <main className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">Q</div>

          <div>
            <h1>QuizForge AI</h1>
            <span>Smart learning workspace</span>
          </div>
        </div>

        <div className="dashboard-header-right">

          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-info">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}
      <section className="dashboard-content">

        <div className="dashboard-welcome">
          <div>
            <span className="dashboard-badge">
              ✦ YOUR LEARNING SPACE
            </span>

            <h2>
              Welcome back,{" "}
              <span>{user?.name || "Learner"}</span> 👋
            </h2>

            <p>
              Upload your study material and let QuizForge AI
              turn it into personalized quizzes.
            </p>
          </div>

          <button
            className="create-quiz-button"
            onClick={() => {}}
          >
            + Create Quiz
          </button>
        </div>

        {/* STATS */}
        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div>
              <strong>0</strong>
              <span>Study Materials</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✦</div>
            <div>
              <strong>0</strong>
              <span>Quizzes Created</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <strong>0%</strong>
              <span>Average Score</span>
            </div>
          </div>

        </div>

        {/* SUBJECTS */}
        <section className="dashboard-section">

          <div className="section-title">
            <div>
              <h3>Your Subjects</h3>
              <p>Choose a subject to start learning.</p>
            </div>

            <button className="view-all-button">
              View all →
            </button>
          </div>

<div className="subject-grid">

  {subjectsLoading && (
    <div className="subjects-loading">
      Loading subjects...
    </div>
  )}

  {subjectsError && (
    <div className="subjects-error">
      {subjectsError}
    </div>
  )}

  {!subjectsLoading &&
    !subjectsError &&
    subjects.map((subject) => (
      <div
        className="subject-card"
        key={subject.id}
        onClick={() => navigate(`/subjects/${subject.id}`)}
      >
        <div className="subject-card-icon">
          📚
        </div>

        <h4>{subject.name}</h4>

        <p>
          {subject.description || "Start learning"}
        </p>
      </div>
    ))}

  {!subjectsLoading && !subjectsError && (
    <div className="subject-card add-subject">
      <div className="subject-card-icon">
        +
      </div>

      <h4>Add Subject</h4>

      <p>Create your own</p>
    </div>
  )}

</div>

        </section>

        {/* EMPTY STATE */}
        <section className="recent-section">

          <div className="section-title">
            <div>
              <h3>Recent Quizzes</h3>
              <p>Your recently generated quizzes will appear here.</p>
            </div>
          </div>

          <div className="empty-state">

            <div className="empty-icon">✦</div>

            <h3>No quizzes yet</h3>

            <p>
              Upload a PDF or study material to create
              your first AI-powered quiz.
            </p>

            <button className="create-quiz-button">
              Create your first quiz →
            </button>

          </div>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;