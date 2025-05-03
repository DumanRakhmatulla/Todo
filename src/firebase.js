import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyArOmpZoH1q0tJNjVjFZtRDWHE8oF-Qitc",
    authDomain: "daily-task-planner-81916.firebaseapp.com",
    projectId: "daily-task-planner-81916",
    storageBucket: "daily-task-planner-81916.firebasestorage.app",
    messagingSenderId: "605948233174",
    appId: "1:605948233174:web:9704809c48a0d7fefd5077",
    measurementId: "G-4FQ5S78SBV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);