import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../../firebase/config";
import ThemeToggle from "../ThemeToggle";

const Auth = ({ onLogin, darkMode, toggleTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userCredential;
      
      if (isRegister) {
        // Register new user
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Login existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      
      onLogin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split("@")[0],
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error("Authentication error:", error);
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

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-container">
        <div className="app-header-bar">
          <h1>Task Manager</h1>
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>

        <div className="auth-container">
          <h2>{isRegister ? "Create Account" : "Sign In"}</h2>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength="6"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : isRegister ? "Register" : "Login"}
            </button>
          </form>
          
          <div className="auth-separator">
            <span>or</span>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-google"
            disabled={loading}
          >
            Continue with Google
          </button>
          
          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "Need an account?"}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="btn-link"
              disabled={loading}
            >
              {isRegister ? "Sign In" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;