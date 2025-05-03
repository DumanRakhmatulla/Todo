import { useState } from "react";
import Login from "../Login";
import Register from "../Register";
import ThemeToggle from "../ThemeToggle";
import "./Auth.css";
import logo from "../../assets/logo.png";

function Auth({ onLogin, darkMode, toggleTheme }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLoginSwitch = () => {
    setIsLoginView(true);
  };

  const handleRegisterSwitch = () => {
    setIsLoginView(false);
  };

  const handleLogin = (userData) => {
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    onLogin(userData);
  };

  const handleRegister = (userData) => {
    // In a real app, you would send this to an API
    // For now, we'll just store it and login automatically
    localStorage.setItem("user", JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div className={`auth-page ${darkMode ? "dark-theme" : "light-theme"}`}>
      <div className="auth-container">
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />

        <div className="auth-logo">
          <img src={logo} alt="Todo Logo" />
          <h1>Todo Application</h1>
        </div>

        <div className="auth-card">
          {isLoginView ? (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={handleRegisterSwitch}
            />
          ) : (
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={handleLoginSwitch}
            />
          )}
        </div>

        <div className="auth-footer">
          <p>© 2025 Todo App. INF 395 Final Project.</p>
          <p>
            Nurlybay Azamat, Shaimardan Magzhan, Rakhmatulla Duman, Beglanuly
            Elzhas
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
