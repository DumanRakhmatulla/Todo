import { useState, useRef, useEffect } from "react";

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        className="user-menu-button"
        onClick={toggleMenu}
        aria-label="User menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {(user.displayName || user.email || "User").charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="user-info">
            <div className="user-name">{user.displayName || "User"}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <hr />
          <button className="dropdown-item" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;