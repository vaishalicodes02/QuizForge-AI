import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./Quiz.css";

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { materialId } = useParams();

  const questions = location.state?.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (questions.length === 0) {
    return (
      <main className="quiz-page">
        <div className="quiz-error-card">
          <h2>No quiz found</h2>

          <p>Please generate the quiz again.</p>

          <button onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        question_id: question.id,
        selected_answer: answers[question.id] || null,
      }));

      const response = await api.post("/quiz/submit", {
        material_id: Number(materialId),
        answers: formattedAnswers,
      });

      console.log("Quiz result:", response.data);

      navigate(`/quiz/${materialId}/result`, {
        state: {
          result: response.data,
        },
      });
    } catch (err) {
      console.error("Quiz submission failed:", err);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail.map((item) => item.msg).join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Failed to submit quiz. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAnswer = answers[question.id];

  const options = [
    ["A", question.option_a],
    ["B", question.option_b],
    ["C", question.option_c],
    ["D", question.option_d],
  ];

  return (
    <main className="quiz-page">

      <div className="quiz-container">

        {/* HEADER */}

        <div className="quiz-top">

          <button
            className="quiz-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <span className="quiz-progress">
            Question {currentQuestion + 1} of {questions.length}
          </span>

        </div>

        {/* PROGRESS */}

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* QUESTION */}

        <section className="question-card">

          <span className="question-number">
            Question {currentQuestion + 1}
          </span>

          <h1>{question.question_text}</h1>

          {/* OPTIONS */}

          <div className="options">

            {options.map(([letter, text]) => (
              <button
                key={letter}
                type="button"
                className={`option ${
                  selectedAnswer === letter
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleAnswer(letter)}
              >

                <span className="option-letter">
                  {letter}
                </span>

                <span className="option-text">
                  {text}
                </span>

              </button>
            ))}

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="topic-error">
            {error}
          </div>
        )}

        {/* NAVIGATION */}

        <div className="quiz-navigation">

          <button
            type="button"
            className="previous-button"
            onClick={handlePrevious}
            disabled={
              currentQuestion === 0 || submitting
            }
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (

            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz ✓"}
            </button>

          ) : (

            <button
              type="button"
              className="next-button"
              onClick={handleNext}
              disabled={!selectedAnswer}
            >
              Next →
            </button>

          )}

        </div>

      </div>

    </main>
  );
}

export default Quiz;