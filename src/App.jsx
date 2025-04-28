import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  const addTask = (text, priority = "medium") => {
    if (text.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const editTask = (id, newText, newPriority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: newText, priority: newPriority }
          : task
      )
    );
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Filter tasks based on current filter and search query
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Apply filter (all, active, completed)
    if (filter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    // Apply search if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(query)
      );
    }

    return filteredTasks;
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-container">
        <Header />
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        <div className="app-controls">
          <TaskInput onAddTask={addTask} />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <FilterButtons
          filter={filter}
          setFilter={setFilter}
          clearCompleted={clearCompleted}
          completedCount={tasks.filter((task) => task.completed).length}
        />
        <TaskList
          tasks={getFilteredTasks()}
          toggleCompletion={toggleCompletion}
          deleteTask={deleteTask}
          editTask={editTask}
        />
        <div className="task-stats">
          <p>
            {tasks.length} total tasks |{" "}
            {tasks.filter((task) => !task.completed).length} active |{" "}
            {tasks.filter((task) => task.completed).length} completed
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
