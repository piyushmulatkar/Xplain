import { useNavigate } from "react-router";
import "../styles/quiz_dashboard.css";

export default function QuizDashboard() {
  const navigate = useNavigate();

  const quizzes = [
    {
      title: "Python Quiz",
      icon: "💻",
      description:
        "Challenge yourself with python concepts and fundamentals.",
      difficulty: "Intermediate",
      questions: "20 Questions",
      path: "/quiz/python",
    },
    {
      title: "Mathematics Quiz",
      icon: "📐",
      description:
        "Strengthen your mathematical skills with logic, algebra, geometry, and more.",
      difficulty: "Medium",
      questions: "15 Questions",
      path: "/quiz/mathematics",
    },
    {
      title: "Aptitude Quiz",
      icon: "🧠",
      description:
        "Practice reasoning, analytical thinking, and problem-solving abilities.",
      difficulty: "Mixed",
      questions: "25 Questions",
      path: "/quiz/aptitude",
    },
  ];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>📝 Quiz Center</h1>
        <p>
          Test your knowledge and improve your understanding.
        </p>
      </div>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div
            key={quiz.title}
            className="quiz-card"
            onClick={() => navigate(quiz.path)}
          >
            <div className="quiz-accent"></div>

            <div className="quiz-icon">{quiz.icon}</div>

            <h2>{quiz.title}</h2>

            <p>{quiz.description}</p>

            <div className="quiz-meta">
              <span className="difficulty">
                ⭐ {quiz.difficulty}
              </span>

              <span className="questions">
                📝 {quiz.questions}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="stats-section">
        <h2>Your Statistics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <h3>12</h3>
            <p>Total Quizzes Attempted</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <h3>82%</h3>
            <p>Average Score</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <h3>96%</h3>
            <p>Highest Score</p>
          </div>
        </div>
      </section>
    </div>
  );
}