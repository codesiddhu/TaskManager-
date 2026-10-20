# 🚀 TaskFlow – Productivity Application

TaskFlow is a simple, responsive productivity application built using HTML, CSS, and JavaScript. It helps users organize daily activities, manage tasks, set deadlines, and track their progress.

The application supports complete CRUD operations and uses browser localStorage to save tasks, so they remain available after refreshing the page.

## ✨ Features

- **Create Tasks:** Add new tasks with a title, category, and due date.
- **Read Tasks:** View all saved tasks in an organized list.
- **Update Tasks:** Edit existing task details.
- **Delete Tasks:** Remove individual tasks or clear completed tasks.
- **Task Categories:** Organize tasks into Work, Personal, Study, and Other.
- **Due Dates:** Set deadlines and identify overdue tasks.
- **Mark as Complete:** Mark tasks as completed using checkboxes.
- **Status Filters:** Filter tasks by All, Active, or Completed.
- **Search Tasks:** Quickly find tasks by title.
- **Drag-and-Drop:** Reorder tasks using drag-and-drop.
- **Local Storage:** Persist tasks in the browser across page reloads.
- **Responsive Design:** Support desktop, tablet, and mobile screens.
- **Animations:** Use CSS transitions and animations for a smoother experience.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- DOM Manipulation
- Browser localStorage API
- HTML Drag and Drop API

## 📂 Project Structure


Task Manager & Productivity Tracker 
├── index.html
├── style.css
├── script.js
└── README.md




### Step 2: Navigate to the Project Folder

```bash
cd Task Manager & Productivity Tracker
```

### Step 3: Open the Application

Open `index.html` directly in your web browser.

Alternatively, open the project in Visual Studio Code and use the Live Server extension to run the application.

**No additional dependencies or backend server are required.**

## 📖 How to Use

1. Open the TaskFlow application in your browser.
2. Enter a task title in the input field.
3. Select a category: Work, Personal, Study, or Other.
4. Optionally, choose a due date.
5. Click **Add Task** to create the task.
6. Use the checkbox to mark a task as completed.
7. Click the edit button to update a task.
8. Click the delete button to remove a task.
9. Use the All, Active, and Completed filters to organize your task list.
10. Use the search field to find tasks by title.
11. Drag tasks to change their order.
12. Refresh the browser to verify that your tasks remain saved.

## 💾 Data Persistence

TaskFlow uses the browser's `localStorage` API to persist task data.

The application uses two main helper functions:

- `saveToLocalStorage()` – Saves the current task array to browser storage.
- `loadFromLocalStorage()` – Retrieves saved tasks when the application starts.

Tasks are stored as JSON under the key:

```javascript
taskflow_tasks
```

**Note:** Data is stored locally in the browser and is not synchronized across devices or browsers. Clearing browser storage may permanently remove saved tasks.

## 🧪 Testing Checklist

- [ ] Create a new task.
- [ ] Display saved tasks.
- [ ] Edit an existing task.
- [ ] Delete a task.
- [ ] Select different task categories.
- [ ] Set and verify due dates.
- [ ] Mark tasks as completed.
- [ ] Filter tasks by All, Active, and Completed.
- [ ] Search tasks by title.
- [ ] Reorder tasks using drag-and-drop.
- [ ] Clear completed tasks.
- [ ] Refresh the page and verify data persistence.
- [ ] Test the interface on mobile and desktop screens.

## 🎯 Project Objective

The objective of this project is to demonstrate practical knowledge of JavaScript, DOM manipulation, event handling, array-based state management, localStorage, CSS animations, and responsive web design.

The application provides a lightweight solution for organizing personal and professional tasks without requiring an account or backend database.

## 🔮 Future Improvements

- Add task priority levels.
- Add task descriptions and reminders.
- Implement dark and light themes.
- Add calendar-based task management.
- Support user accounts and cloud synchronization.
- Add task completion statistics.
- Integrate a backend database.



**Sreedhar Royal**

- Email: sreedharroyals632@gmail.com

## 📄 License

This project is intended for educational and personal use. You may modify it for your own learning and development.

---

⭐ **If you find this project useful, consider giving the repository a star!**