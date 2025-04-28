import "./ThemeToggle.css";
import { MoonIcon, SunIcon } from "../Icons";

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeToggle;
