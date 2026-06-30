import { Routes, Route } from "react-router";
import Header from "./components/header";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/protected_route";
import NotFound from "./pages/not_found";
import Home from "./pages/home";
import Chatbot from "./pages/chatbot";
import Quiz from "./pages/quiz";
import QuizDashboard from "./pages/quiz_dashboard";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:category"
          element={
            <ProtectedRoute>
              <Quiz/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </>
  );
}
