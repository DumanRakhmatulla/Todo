import { useState } from "react";
import "./TaskList.css";
import { DeleteIcon, EditIcon, SaveIcon, CancelIcon } from "../Icons";

function TaskList({
  tasks,
  toggleCompletion,
  deleteTask,
  editTask,
  isDeadlineApproaching,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDeadline, setEditDeadline] = useState("");

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority || "medium");
    setEditDeadline(task.deadline || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    editTask(id, editText, editPriority, editDeadline);
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      // Handle different date formats
      let date;
      
      if (dateString instanceof Date) {
        date = dateString;
      } else if (typeof dateString === 'object' && dateString.seconds) {
        // Handle Firestore Timestamp object
        date = new Date(dateString.seconds * 1000);
      } else {
        // Handle string date format
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      
      // Format the date
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date error";
    }
  };

  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeRemaining = deadlineDate - now;
    return timeRemaining > 0 && timeRemaining <= 10800000; // 3 hours in milliseconds
  };

  if (!tasks || tasks.length === 0) {
    return <div className="no-tasks">No tasks to display</div>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""} 
                      priority-${task.priority || "medium"}
                      ${
                        task.deadline && isDeadlineNear(task.deadline)
                          ? "deadline-urgent"
                          : ""
                      }
                      ${
                        task.deadline && isDeadlineApproaching(task.deadline)
                          ? "deadline-approaching"
                          : ""
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
              <input
                type="datetime-local"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="edit-deadline"
              />
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
                  {task.deadline && (
                    <span
                      className={`task-deadline ${
                        isDeadlineNear(task.deadline) ? "deadline-near" : ""
                      }`}
                    >
                      Deadline: {formatDate(task.deadline)}
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