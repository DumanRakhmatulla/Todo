## Introduction
ToDo app is a web-based application designed to help users organize and track their daily tasks with deadline management and priority setting capabilities. The application provides an intuitive interface for creating, updating, and filtering tasks while offering both light and dark themes for improved user experience.

## Problem Statement
In our increasingly busy lives, managing tasks effectively has become essential for productivity. Many existing task management solutions are either too complex or lack important features like deadline notifications and priority setting. Task Manager addresses these issues by providing a streamlined, user-friendly interface with real-time updates and crucial task management features, all while keeping the experience simple and focused on what matters most.

## Objectives
- Create an intuitive task management application that's easy to use
- Implement secure user authentication to keep tasks private
- Provide deadline management with approaching deadline notifications
- Allow task organization through priorities and filtering options
- Offer responsive design that works seamlessly across devices
- Implement theme customization for improved user experience

## Technology Stack
- **Frontend**: React 19, CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tools**: Vite
- **Package Manager**: npm
- **Linting**: ESLint
- **Hosting**: Firebase Hosting

## Installation Instructions

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- Firebase account

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/task-manager.git

# 2. Navigate into the project directory
cd task-manager

# 3. Install dependencies
npm install

# 4. Create a .env file in the root directory with your Firebase config
# Example:
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_project_id
# VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
# VITE_FIREBASE_APP_ID=your_app_id
# VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# 5. Start the development server
npm run dev

# 6. Build for production
npm run build
```

### Firebase Setup
1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password and Google provider)
3. Create a Firestore database with the following rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Usage Guide

### Authentication
1. Register with email and password or sign in with Google
2. Once logged in, your tasks will persist between sessions

### Managing Tasks
- **Create Task**: Enter task text in the input field, set priority and optional deadline, then click the add button
- **Complete Task**: Click the checkbox next to a task to mark it as complete
- **Edit Task**: Click the edit icon to modify task details including text, priority, and deadline
- **Delete Task**: Click the delete icon to remove a task

### Filtering and Searching
- Use the filter buttons to show All, Active, or Completed tasks
- Use the search bar to find tasks containing specific text
- Click "Clear Completed" to remove all finished tasks at once

### Theme Customization
- Toggle between light and dark mode using the theme button in the top right corner

## Testing
```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## Known Issues / Limitations
- Notifications currently only work when the application is open in the browser
- Limited to 100 tasks per user for optimal performance
- Internet connection required for all operations (no offline mode)
- Mobile push notifications not yet supported

## References
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

Nurlybay Azamat 17-P, Shaimardan Magzhan 18-P, Rakhmatulla Duman 17-P, Beglanuly Elzhas 17-P.
To-do app INF 395 Final Project.
