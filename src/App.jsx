import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import Auth from "./components/Auth";
import UserMenu from "./components/UserMenu";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName:
            currentUser.displayName || currentUser.email.split("@")[0],
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode ? "dark-theme" : "light-theme";
  }, [darkMode]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || tasks.length === 0) return;

    const checkDeadlines = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.deadline && !task.completed && !task.notificationSent) {
          const deadlineDate = new Date(task.deadline);
          const timeRemaining = deadlineDate - now;

          if (timeRemaining > 0 && timeRemaining <= 3600000) {
            updateTask(task.id, { notificationSent: true });

            sendDeadlineNotification(task);
          }
        }
      });
    };

    checkDeadlines();

    const intervalId = setInterval(checkDeadlines, 60000);

    return () => clearInterval(intervalId);
  }, [tasks, user]);

  const sendDeadlineNotification = async (task) => {
    try {
      console.log(`Sending deadline notification for task: ${task.text}`);

      const idToken = await auth.currentUser.getIdToken();

      const response = await fetch("http://localhost:3001/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          taskId: task.id,
          taskText: task.text,
          deadline: task.deadline,
          recipientEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to send notification");
      }

      console.log("Notification sent successfully", data);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const addTask = async (text, priority = "medium", deadline = "") => {
    if (!user || text.trim() === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        text,
        completed: false,
        priority,
        createdAt: serverTimestamp(),
        deadline: deadline || null,
        notificationSent: false,
        userId: user.uid,
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id, updatedFields) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, updatedFields);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const editTask = async (id, newText, newPriority, newDeadline) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const notificationSent =
      newDeadline !== taskToUpdate?.deadline
        ? false
        : taskToUpdate?.notificationSent;

    await updateTask(id, {
      text: newText,
      priority: newPriority,
      deadline: newDeadline || null,
      notificationSent,
    });
  };

  const toggleCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  const deleteTask = async (id) => {
    if (!user) return;

    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("darkMode", JSON.stringify(newTheme));
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeRemaining = deadlineDate - now;
    return timeRemaining > 0 && timeRemaining <= 86400000;
  };

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    if (filter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) =>
        task.text.toLowerCase().includes(query)
      );
    }

    return filteredTasks;
  };

  const clearCompleted = async () => {
    if (!user) return;

    const completedTasks = tasks.filter((task) => task.completed);

    try {
      for (const task of completedTasks) {
        await deleteTask(task.id);
      }
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

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
    <div className={`app ${darkMode ? "dark-theme" : ""}`}>
      <div className="app-container">
        <header className="app-header">
          <img src={logo} alt="Logo" />
          <h1>Task Manager</h1>
          <div className="header-controls">
            <UserMenu user={user} onLogout={handleLogout} />
            <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
          </div>
        </header>

        <main className="app-content">
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
        </main>
      </div>
    </div>
  );
}

export default App;
