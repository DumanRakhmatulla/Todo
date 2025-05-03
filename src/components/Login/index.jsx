import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email міндетті";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Құпия сөз міндетті";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Call the login function passed from parent
      onLogin({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Кіру</h2>
        <p>Қолданбаға кіру үшін логин мен құпия сөзді енгізіңіз</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Құпия сөз</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <div className="remember-forgot">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Мені есте сақта</label>
          </div>
          <button type="button" className="forgot-password">
            Құпия сөзді ұмыттыңыз ба?
          </button>
        </div>

        <button type="submit" className="login-button">
          Кіру
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Аккаунтыңыз жоқ па?{" "}
          <button className="switch-button" onClick={onSwitchToRegister}>
            Тіркелу
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
