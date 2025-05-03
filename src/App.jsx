import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import Auth from "./components/Auth";

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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
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

  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.deadline && !task.completed && !task.notificationSent) {
          const deadlineDate = new Date(task.deadline);
          const timeRemaining = deadlineDate - now;

          // If deadline is within 1 hour (3600000 ms)
          if (timeRemaining > 0 && timeRemaining <= 3600000) {
            // Send email notification
            sendDeadlineNotification(task);

            // Mark notification as sent to avoid duplicate emails
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === task.id ? { ...t, notificationSent: true } : t
              )
            );
          }
        }
      });
    };

    // Initial check
    checkDeadlines();

    // Set interval to check deadlines every minute
    const intervalId = setInterval(checkDeadlines, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [tasks]);

  const sendDeadlineNotification = async (task) => {
    try {
      // In a real implementation, you would use a backend API to send emails
      // For this example, we'll simulate sending an email
      console.log(`Sending deadline notification for task: ${task.text}`);

      // Here you would typically make an API call to your backend service
      // Example:
      await fetch("http://localhost:3001/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email || "rakhmatulladuman0505@gmai.com", // Use logged in user's email
          subject: "Task Deadline Approaching",
          message: `Your task "${
            task.text
          }" is due in less than an hour (Deadline: ${new Date(
            task.deadline
          ).toLocaleString()})`,
        }),
      });

      // Note: In a real implementation, you would need a backend service to handle emails
      // as browsers cannot send emails directly from JavaScript for security reasons
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const addTask = (text, priority = "medium", deadline = "") => {
    if (text.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        deadline: deadline || null,
        notificationSent: false,
      },
    ]);
  };

  const editTask = (id, newText, newPriority, newDeadline) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: newText,
              priority: newPriority,
              deadline: newDeadline || task.deadline,
              // Reset notification status if deadline changes
              notificationSent:
                newDeadline !== task.deadline ? false : task.notificationSent,
            }
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

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeRemaining = deadlineDate - now;
    return timeRemaining > 0 && timeRemaining <= 86400000; // 24 hours in milliseconds
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

  // If user is not logged in, show Auth component
  if (!user) {
    return (
      <Auth
        onLogin={handleLogin}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

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
          isDeadlineApproaching={isDeadlineApproaching}
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
