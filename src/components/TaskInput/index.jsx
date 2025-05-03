import { useState } from "react";
import "./TaskInput.css";
import { AddIcon } from "../Icons";

function TaskInput({ onAddTask }) {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      // Вызываем функцию добавления задачи, передавая текст, приоритет и дедлайн
      onAddTask(newTask.trim(), priority, deadline);
      
      // Очищаем форму после добавления
      setNewTask("");
      setPriority("medium");
      setDeadline("");
      
      console.log("Task submitted:", { newTask, priority, deadline });
    }
  };

  return (
    <form className="task-input-container" onSubmit={handleSubmit}>
      <div className="task-input-wrapper">
        <input
          type="text"
          placeholder="Add your new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="deadline-input"
        />
        <button type="submit" className="add-task-btn">
          <AddIcon />
        </button>
      </div>
    </form>
  );
}

export default TaskInput;