import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./QuizSetup.css";

function QuizSetup() {
  const { materialId } = useParams();
  const navigate = useNavigate();

  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        `/questions/generate/${materialId}`,
        null,
        {
          params: {
            number_of_questions: numberOfQuestions,
            difficulty: difficulty,
          },
        }
      );

      console.log("Generated questions:", response.data);

      navigate(`/quiz/${materialId}`, {
        state: {
          questions: response.data,
        },
      });

    } catch (err) {
      console.error("Quiz generation failed:", err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Failed to generate quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="quiz-setup-page">

      <div className="quiz-setup-card">

        <div className="quiz-setup-badge">
          ✦ AI QUIZ
        </div>

        <h1>Create Your Quiz</h1>

        <p>
          Choose your quiz settings and let QuizForge AI
          generate questions from your study material.
        </p>

        <div className="quiz-setting">

          <label>
            Number of Questions
          </label>

          <select
            value={numberOfQuestions}
            onChange={(e) =>
              setNumberOfQuestions(Number(e.target.value))
            }
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>

        </div>

        <div className="quiz-setting">

          <label>
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

        </div>

        {error && (
          <div className="quiz-error">
            {error}
          </div>
        )}

        <button
          className="generate-quiz-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? "Generating Quiz..."
            : "Generate Quiz →"}
        </button>

      </div>

    </main>
  );
}

export default QuizSetup;