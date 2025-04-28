import "./SearchBar.css";
import { SearchIcon } from "../Icons";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-container">
      <div className="search-icon-wrapper">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;
