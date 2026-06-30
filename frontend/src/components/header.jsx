import { Link, useNavigate } from "react-router";
import "../styles/header.css";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to={isLoggedIn ? "/home" : "/"} className="logo">
          Xplain
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>

          {isLoggedIn ? (
            <>
              <Link to="/chatbot">Chatbot</Link>
              <Link to="/quiz">Quiz</Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}