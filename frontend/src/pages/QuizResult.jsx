import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./QuizResult.css";

function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { materialId } = useParams();

  const result = location.state?.result;

  if (!result) {
    return (
      <main className="result-page">
        <div className="result-card">
          <h1>No Result Found</h1>

          <p>
            Please complete the quiz again to see your result.
          </p>

          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="result-page">

      <div className="result-container">

        {/* HEADER */}

        <div className="result-header">

          <span className="result-badge">
            ✦ QUIZ COMPLETE
          </span>

          <h1>Great job! 🎉</h1>

          <p>
            Here's how you performed on your quiz.
          </p>

        </div>

        {/* SCORE */}

        <div className="score-card">

          <div className="score-circle">

            <strong>
              {result.score_percentage?.toFixed(0) || 0}%
            </strong>

            <span>
              Score
            </span>

          </div>

          <div className="score-summary">

            <div className="summary-item">
              <strong>
                {result.total_questions}
              </strong>

              <span>
                Total
              </span>
            </div>

            <div className="summary-item correct">
              <strong>
                {result.correct_answers}
              </strong>

              <span>
                Correct
              </span>
            </div>

            <div className="summary-item wrong">
              <strong>
                {result.wrong_answers}
              </strong>

              <span>
                Wrong
              </span>
            </div>

          </div>

        </div>

        {/* ANSWER REVIEW */}

        <section className="review-section">

          <div className="review-heading">

            <h2>Answer Review</h2>

            <p>
              Review your answers and learn from the explanations.
            </p>

          </div>

          <div className="review-list">

            {result.results?.map((item, index) => (

              <article
                className={`review-card ${
                  item.is_correct
                    ? "review-correct"
                    : "review-wrong"
                }`}
                key={item.question_id}
              >

                {/* QUESTION HEADER */}

                <div className="review-card-header">

                  <span>
                    Question {index + 1}
                  </span>

                  <span
                    className={`answer-status ${
                      item.is_correct
                        ? "status-correct"
                        : "status-wrong"
                    }`}
                  >
                    {item.is_correct
                      ? "✓ Correct"
                      : "✕ Incorrect"}
                  </span>

                </div>

                {/* ANSWER */}

                <div className="answer-details">

                  <div>
                    <span className="answer-label">
                      Your Answer
                    </span>

                    <strong>
                      {item.selected_answer}
                    </strong>
                  </div>

                  <div>
                    <span className="answer-label">
                      Correct Answer
                    </span>

                    <strong>
                      {item.correct_answer}
                    </strong>
                  </div>

                </div>

                {/* EXPLANATION */}

                {item.explanation && (
                  <div className="explanation">

                    <div className="explanation-title">
                      💡 Explanation
                    </div>

                    <p>
                      {item.explanation}
                    </p>

                  </div>
                )}

              </article>

            ))}

          </div>

        </section>

        {/* ACTIONS */}

        <div className="result-actions">

          <button
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <button
            className="retry-button"
            onClick={() => navigate(`/quiz/${materialId}`)}
          >
            Try Again →
          </button>

        </div>

      </div>

    </main>
  );
}

export default QuizResult;