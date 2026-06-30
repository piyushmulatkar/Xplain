import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "../styles/quiz.css";

export default function Quiz() {
  const { category } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  // { questionId: selectedOptionIndex }
  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [category]);

  async function fetchQuiz() {
    setLoading(true);
    setError("");
    setResult(null);
    setCurrentQuestion(0);
    setAnswers({});

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/quiz/${category}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Unable to load quiz.");
      }

      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  const questions = quiz?.questions || [];

  const question = useMemo(() => {
    return questions[currentQuestion];
  }, [questions, currentQuestion]);

  const progress = quiz
    ? ((currentQuestion + 1) / quiz.total_questions) * 100
    : 0;

  function chooseAnswer(index) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: index,
    }));
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  async function submitQuiz() {
    setSubmitting(true);

    try {
      const payload = {
        category,
        answers: Object.entries(answers).map(([id, selected]) => ({
          question_id: Number(id),
          selected,
        })),
      };

      const response = await fetch("http://127.0.0.1:8000/api/quiz/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      alert(err.message);
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loader"></div>

        <h2>Loading Quiz...</h2>

        <p>Please wait while we prepare your questions.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button onClick={fetchQuiz}>Try Again</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="quiz-result-page">
        <div className="result-card">
          <div className="result-emoji">🎉</div>

          <h1>Quiz Completed</h1>

          <p>You have successfully completed the quiz.</p>

          <div className="result-score">
            <div className="score-box">
              <span>Score</span>
              <h2>
                {result.score}/{result.total}
              </h2>
            </div>

            <div className="score-box">
              <span>Percentage</span>
              <h2>{result.percentage}%</h2>
            </div>
          </div>

          <div className="result-actions">
            <button className="primary-btn" onClick={fetchQuiz}>
              Play Again
            </button>

            <button className="secondary-btn" onClick={() => navigate("/quiz")}>
              Back to Quiz Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-play-page">
      <div className="quiz-top">
        <div>
          <h1>{quiz.title}</h1>

          <p>
            Question {currentQuestion + 1} of {quiz.total_questions}
          </p>
        </div>

        <div className="progress-number">{Math.round(progress)}%</div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>

      <div className="question-card">
        <h2>{question.question}</h2>

        <div className="options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option ${
                answers[question.id] === index ? "selected" : ""
              }`}
              onClick={() => chooseAnswer(index)}
            >
              <div className="option-letter">
                {String.fromCharCode(65 + index)}
              </div>

              <span>{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          className="secondary-btn"
          disabled={currentQuestion === 0}
          onClick={previousQuestion}
        >
          Previous
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            className="primary-btn"
            disabled={submitting}
            onClick={submitQuiz}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button className="primary-btn" onClick={nextQuestion}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
