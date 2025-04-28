import "./Header.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="Todo Logo" className="logo" />
        <h1>Todo Application</h1>
      </div>
      <p className="tagline">Stay organized, be productive</p>
    </div>
  );
}

export default Header;
