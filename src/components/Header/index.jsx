import logo from "../../assets/logo.png";

function Header() {
  return (
    <div className="Header">
      <div>
        <img src={logo} />
        <h1>Todo Application</h1>
      </div>
    </div>
  );
}

export default Header;