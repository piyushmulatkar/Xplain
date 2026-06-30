import "../styles/home.css";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "🤖 AI Chatbot",
      description:
        "Ask questions about your subjects and receive intelligent, context-aware explanations powered by NLP.",
      path: "/chatbot",
    },
    {
      title: "📝 Quiz",
      description:
        "Take quizzes to evaluate your understanding and improve your learning.",
      path: "/quiz",
    },
    {
      title: "📊 My Progress",
      description:
        "Track your quiz scores and monitor your learning journey over time.",
      path: "/progress",
    },
    {
      title: "👤 Profile",
      description:
        "View your account details and manage your learning preferences.",
      path: "/profile",
    },
  ];

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Xplain</h1>
        <p>
          Learn smarter with AI. Ask questions, test your knowledge, and track
          your progress—all in one place.
        </p>
      </header>

      <section className="features">
        {features.map((feature) => (
          <div
            key={feature.path}
            className="feature-card"
            onClick={() => navigate(feature.path)}
          >
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}