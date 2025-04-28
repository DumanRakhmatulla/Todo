import { useState } from "react";
import "./TaskList.css";
import { DeleteIcon, EditIcon, SaveIcon, CancelIcon } from "../Icons";

function TaskList({ tasks, toggleCompletion, deleteTask, editTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority || "medium");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    editTask(id, editText, editPriority);
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks to display</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""} priority-${
            task.priority || "medium"
          }`}
        >
          {editingId === task.id ? (
            // Edit mode
            <div className="edit-mode">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-input"
                autoFocus
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="edit-priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="edit-actions">
                <button className="save-btn" onClick={() => saveEdit(task.id)}>
                  <SaveIcon />
                </button>
                <button className="cancel-btn" onClick={cancelEditing}>
                  <CancelIcon />
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  className="task-checkbox"
                />
                <div className="task-details">
                  <span className="task-text">{task.text}</span>
                  {task.createdAt && (
                    <span className="task-date">
                      Created: {formatDate(task.createdAt)}
                    </span>
                  )}
                  <span
                    className={`task-priority priority-badge-${
                      task.priority || "medium"
                    }`}
                  >
                    {task.priority
                      ? task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)
                      : "Medium"}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => startEditing(task)}>
                  <EditIcon />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
