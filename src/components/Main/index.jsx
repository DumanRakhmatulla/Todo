import "./main.css";
import addBtn from "../../assets/add.png";
import deleteBtn from "../../assets/minus.png";
import React, { useState } from "react";

function Main() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="main">
      <div className="input-container">
        <li>
          <input
            type="input"
            placeholder="Add your new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="add-btn" onClick={addTask}>
            <img src={addBtn} alt="Add Task" className="add-icon" />
          </button>
        </li>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task.id)}
            />
            <span>{task.text}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              <img src={deleteBtn} alt="Delete Task" className="delete-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;