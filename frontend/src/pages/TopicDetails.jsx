import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { uploadMaterial } from "../api/materials";
import "./TopicDetails.css";

function TopicDetails() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true);
        setError("");

        const topicResponse = await api.get(
          `/subjects/${subjectId}/topics`
        );

        const foundTopic = topicResponse.data.find(
          (item) => item.id === Number(topicId)
        );

        if (!foundTopic) {
          setError("Topic not found.");
          return;
        }

        setTopic(foundTopic);

        const materialsResponse = await api.get(
          `/materials/?topic_id=${topicId}`
        );

        setMaterials(materialsResponse.data);
      } catch (err) {
        console.error("Failed to load topic:", err);

        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
          setError(
            detail.map((item) => item.msg).join(", ")
          );
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Could not load topic details.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [subjectId, topicId]);

  // Handle PDF upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploadedMaterial = await uploadMaterial(
        subjectId,
        topicId,
        file
      );

      setMaterials((prev) => [
        ...prev,
        uploadedMaterial,
      ]);

      } catch (err) {
        console.error("Upload failed:", err);

        const detail = err.response?.data?.detail;

        if (Array.isArray(detail)) {
         setError(
          detail
           .map((item) => item.msg)
           .join(", ")
         );
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Failed to upload PDF.");
        }
     } finally {
       setUploading(false);
       event.target.value = "";
     }
  };

  if (loading) {
    return (
      <main className="topic-details-page">
        <div className="topic-loading">
          Loading topic...
        </div>
      </main>
    );
  }

  if (error && !topic) {
    return (
      <main className="topic-details-page">
        <div className="topic-error">
          {error}
        </div>

        <Link
          to={`/subjects/${subjectId}`}
          className="back-link"
        >
          ← Back to Subject
        </Link>
      </main>
    );
  }

  return (
    <main className="topic-details-page">

      {/* HEADER */}
      <header className="topic-header">

        <Link
          to={`/subjects/${subjectId}`}
          className="back-link"
        >
          ← Back to Subject
        </Link>

        <div className="topic-badge">
          ✦ TOPIC
        </div>

        <h1>{topic?.name}</h1>

        <p>
          {topic?.description ||
            "Study material and quizzes for this topic."}
        </p>

      </header>

      {/* MATERIALS */}
      <section className="materials-section">

        <div className="section-heading">

          <div>
            <h2>Study Materials</h2>

            <p>
              Upload your study material and generate
              AI-powered quizzes.
            </p>
          </div>

          {/* TOP UPLOAD BUTTON */}
          <label className="upload-button">
            {uploading
              ? "Uploading..."
              : "+ Upload PDF"}

            <input
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              hidden
            />
          </label>

        </div>

        {/* ERROR */}
        {error && (
          <div className="topic-error">
            {error}
          </div>
        )}

        {/* MATERIAL LIST */}
        {materials.length === 0 ? (

          <div className="materials-empty">

            <div className="empty-material-icon">
              📄
            </div>

            <h3>No study materials yet</h3>

            <p>
              Upload a PDF to start creating
              AI-generated quizzes for this topic.
            </p>

            {/* EMPTY STATE UPLOAD */}
            <label className="upload-button">
              {uploading
                ? "Uploading..."
                : "Upload your first PDF →"}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                disabled={uploading}
                hidden
              />
            </label>

          </div>

        ) : (

          <div className="materials-grid">

            {materials.map((material) => (

              <div
                className="material-card"
                key={material.id}
              >

                <div className="material-icon">
                  📄
                </div>

                <div className="material-info">

                  <h3>
                    {material.filename}
                  </h3>

                  <p>
                    PDF study material
                  </p>

                </div>

                <button
                    className="quiz-button"
                    onClick={() =>
                        navigate(`/quiz-setup/${material.id}`)
                    }
                >
                    Generate Quiz →
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default TopicDetails;