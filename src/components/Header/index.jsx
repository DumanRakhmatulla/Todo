import "./Header.css";
import logo from "../../assets/logo.png";

function Header({ currentUser, onLogout }) {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="Todo Logo" className="logo" />
        <h1>Todo Application</h1>
      </div>
      <p className="tagline">Stay organized, be productive</p>
      
      {currentUser && (
        <div className="user-info">
          <span>Welcome, {currentUser.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
