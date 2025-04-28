import "./FilterButtons.css";

function FilterButtons({ filter, setFilter, clearCompleted, completedCount }) {
  return (
    <div className="filter-container">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      {completedCount > 0 && (
        <button className="clear-completed-btn" onClick={clearCompleted}>
          Clear Completed ({completedCount})
        </button>
      )}
    </div>
  );
}

export default FilterButtons;
