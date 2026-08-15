import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./SubjectDetails.css";

function SubjectDetails() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const [subjectResponse, topicsResponse] = await Promise.all([
          api.get(`/subjects/${subjectId}`),
          api.get(`/subjects/${subjectId}/topics`),
        ]);

        setSubject(subjectResponse.data);
        setTopics(topicsResponse.data);
      } catch (error) {
        console.error("Failed to load subject:", error);
        setError("Could not load subject.");
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [subjectId]);

  if (loading) {
    return (
      <main className="subject-details-page">
        <p>Loading subject...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="subject-details-page">
        <p>{error}</p>

        <button onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="subject-details-page">

      <header className="subject-details-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div>
          <span className="subject-badge">
            ✦ SUBJECT
          </span>

          <h1>{subject?.name}</h1>

          <p>
            {subject?.description ||
              "Choose a topic to start learning."}
          </p>
        </div>
      </header>

      <section className="topics-section">

        <div className="topics-heading">
          <div>
            <h2>Topics</h2>
            <p>
              Select a topic to view your study material.
            </p>
          </div>

          <button className="add-topic-button">
            + Add Topic
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="topics-empty">
            <div className="empty-topic-icon">📚</div>

            <h3>No topics yet</h3>

            <p>
              Add your first topic to start organizing
              your study material.
            </p>

            <button className="add-topic-button">
              + Create Topic
            </button>
          </div>
        ) : (
          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                className="topic-card"
                key={topic.id}
              >
                <div className="topic-icon">
                  📁
                </div>

                <h3>{topic.name}</h3>

                <p>
                  {topic.description ||
                    "Start learning this topic."}
                </p>

                <button
                 onClick={() =>
                  navigate(`/subjects/${subjectId}/topics/${topic.id}`)
                 }
                >
                 Open Topic →
                </button>
              </div>
            ))}
          </div>
        )}

      </section>

    </main>
  );
}

export default SubjectDetails;