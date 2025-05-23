import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArOmpZoH1q0tJNjVjFZtRDWHE8oF-Qitc",
    authDomain: "daily-task-planner-81916.firebaseapp.com",
    projectId: "daily-task-planner-81916",
    storageBucket: "daily-task-planner-81916.firebasestorage.app",
    messagingSenderId: "605948233174",
    appId: "1:605948233174:web:9704809c48a0d7fefd5077",
    measurementId: "G-4FQ5S78SBV"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services
export { auth, db };
export default app;