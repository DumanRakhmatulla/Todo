import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../../firebase/config";
import ThemeToggle from "../ThemeToggle";
import Login from "../Login";
import Register from "../Register";
import "./Auth.css";

const Auth = ({ onLogin, darkMode, toggleTheme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0],
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: username || email.split("@")[0],
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error("Google Sign-in error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsRegister(true);
    setError("");
  };

  const switchToLogin = () => {
    setIsRegister(false);
    setError("");
  };

  return (
    <div className={`auth-page ${darkMode ? "dark-theme" : ""}`}>
      <div className="auth-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="Logo" />
          <h1>Task Manager</h1>
        </div>

        <div className="auth-card">
          {error && <div className="error-message">{error}</div>}
          
          {isRegister ? (
            <Register 
              onRegister={handleRegister} 
              onSwitchToLogin={switchToLogin}
            />
          ) : (
            <Login 
              onLogin={handleLogin} 
              onSwitchToRegister={switchToRegister}
            />
          )}
        </div>

        <div className="or-separator">
          <span>немесе</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="google-button"
          disabled={loading}
        >
          Google арқылы кіру
        </button>

        <div className="auth-footer">
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          <p>© {new Date().getFullYear()} Task Manager. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;