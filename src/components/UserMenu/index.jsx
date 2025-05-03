import { useState, useRef, useEffect } from "react";
import "./UserMenu.css";

// New icons for user menu
const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="item-icon"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="item-icon"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Gets first letter of username for avatar
  const getInitial = () => {
    return user?.username
      ? user.username.charAt(0).toUpperCase()
      : user?.email.charAt(0).toUpperCase();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" onClick={() => setIsOpen(!isOpen)}>
        <div className="user-avatar">{getInitial()}</div>
        <span>{user?.username || "Пайдаланушы"}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="dropdown-arrow"></div>
          <div className="user-info">
            <div className="user-name">{user?.username || "Пайдаланушы"}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <ul className="menu-items">
            <li className="menu-item">
              <ProfileIcon />
              <span>Профиль</span>
            </li>
            <li className="menu-item danger" onClick={handleLogout}>
              <LogoutIcon />
              <span>Шығу</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
