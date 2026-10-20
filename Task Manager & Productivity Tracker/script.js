
// ========================================
// TaskFlow - Productivity Application
// ========================================

// 1. Application state
let tasks = [];
let currentFilter = "all";
let searchQuery = "";
let categoryFilter = "all";
let editingTaskId = null;
let draggedTaskId = null;

const STORAGE_KEY = "taskflow_tasks";

// 2. Select DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const dueDateInput = document.getElementById("due-date-input");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const formHeading = document.getElementById("form-heading");
const formMessage = document.getElementById("form-message");

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const categoryFilterInput = document.getElementById("category-filter");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");

// 3. Generate unique IDs
function generateId() {
    if (typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// 4. Save tasks to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
        showMessage("Unable to save tasks in this browser.", true);
    }
}

// 5. Load tasks from localStorage
function loadFromLocalStorage() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            tasks = [];
            return;
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            tasks = [];
            return;
        }

        const validCategories = ["Work", "Personal", "Study", "Other"];

        tasks = parsedTasks
            .filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.title === "string" &&
                typeof task.completed === "boolean"
            )
            .map(task => ({
                id: task.id,
                title: task.title.slice(0, 200),
                category: validCategories.includes(task.category)
                    ? task.category
                    : "Other",
                dueDate: typeof task.dueDate === "string"
                    ? task.dueDate
                    : "",
                completed: task.completed
            }));
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        tasks = [];
    }
}

// 6. Show form messages
function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#d94c61" : "#1c9b73";
}

// 7. Update summary counters
function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;

    totalCount.textContent = tasks.length;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// 8. Format the current date without UTC timezone shifts
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        return dateString;
    }

    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// 9. Get tasks matching the selected filters
function getVisibleTasks() {
    return tasks.filter(task => {
        const matchesStatus =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === "all" ||
            task.category === categoryFilter;

        return matchesStatus && matchesSearch && matchesCategory;
    });
}

// 10. Create elements safely
// Using textContent avoids interpreting task titles as HTML.
function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== "") element.textContent = text;

    return element;
}

// 11. Render the task list
function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = getVisibleTasks();
    const today = getLocalDateString();

    visibleTasks.forEach(task => {
        const item = createElement(
            "article",
            `task-item${task.completed ? " completed" : ""}`
        );

        item.dataset.id = task.id;
        item.draggable = true;

        const dragHandle = createElement("span", "drag-handle", "⠿");
        dragHandle.title = "Drag to reorder";
        dragHandle.setAttribute("aria-label", "Drag to reorder task");

        const checkbox = createElement("input", "task-checkbox");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.title} as ${task.completed ? "active" : "completed"}`
        );

        const content = createElement("div", "task-content");
        const title = createElement("p", "task-title", task.title);
        content.appendChild(title);

        const meta = createElement("div", "task-meta");

        const categoryClasses = {
            Work: "",
            Personal: "category-personal",
            Study: "category-study",
            Other: "category-other"
        };

        const categoryTag = createElement(
            "span",
            `tag ${categoryClasses[task.category] || ""}`.trim(),
            task.category
        );

        meta.appendChild(categoryTag);

        if (task.dueDate) {
            const isOverdue = task.dueDate < today && !task.completed;

            const dateTag = createElement(
                "span",
                `tag due-date${isOverdue ? " overdue" : ""}`,
                `${isOverdue ? "Overdue · " : "Due · "}${formatDate(task.dueDate)}`
            );

            meta.appendChild(dateTag);
        }

        if (task.completed) {
            meta.appendChild(createElement("span", "tag", "Completed"));
        }

        content.appendChild(meta);

        const actions = createElement("div", "task-actions");

        const editButton = createElement("button", "icon-btn", "✎");
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.title = "Edit task";
        editButton.setAttribute("aria-label", `Edit ${task.title}`);

        const deleteButton = createElement("button", "icon-btn delete", "×");
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.title = "Delete task";
        deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

        actions.append(editButton, deleteButton);
        item.append(dragHandle, checkbox, content, actions);
        taskList.appendChild(item);
    });

    emptyState.classList.toggle("visible", visibleTasks.length === 0);

    const noTasksAtAll = tasks.length === 0;

    emptyState.querySelector("strong").textContent = noTasksAtAll
        ? "No tasks yet"
        : "No matching tasks";

    emptyState.querySelector("span:last-child").textContent = noTasksAtAll
        ? "Add a task above to get started."
        : "Try another filter or search term.";

    updateStats();
}

// 12. Reset the form after adding or editing
function resetForm() {
    taskForm.reset();
    editingTaskId = null;

    formHeading.textContent = "Add a new task";
    submitBtn.textContent = "+ Add Task";
    cancelEditBtn.classList.add("hidden");

    showMessage("");
}

// 13. Create or update a task
taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = taskInput.value.trim();
    const category = categoryInput.value;
    const dueDate = dueDateInput.value;

    if (!title) {
        showMessage("Please enter a task title.", true);
        taskInput.focus();
        return;
    }

    if (title.length > 200) {
        showMessage("Task titles must be 200 characters or fewer.", true);
        return;
    }

    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        showMessage("Please choose a valid due date.", true);
        return;
    }

    if (editingTaskId) {
        const task = tasks.find(item => item.id === editingTaskId);

        if (task) {
            task.title = title;
            task.category = category;
            task.dueDate = dueDate;

            showMessage("Task updated successfully.");
        }
    } else {
        const newTask = {
            id: generateId(),
            title,
            category,
            dueDate,
            completed: false
        };

        tasks.unshift(newTask);
        showMessage("Task added successfully.");
    }

    saveToLocalStorage();
    resetForm();
    renderTasks();
});

// 14. Handle edit, delete, and completion actions
taskList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const item = button.closest(".task-item");
    if (!item) return;

    const task = tasks.find(current => current.id === item.dataset.id);
    if (!task) return;

    if (button.dataset.action === "edit") {
        editingTaskId = task.id;

        taskInput.value = task.title;
        categoryInput.value = task.category;
        dueDateInput.value = task.dueDate;

        formHeading.textContent = "Edit task";
        submitBtn.textContent = "Save Changes";
        cancelEditBtn.classList.remove("hidden");

        showMessage("");
        taskInput.focus();

        document.getElementById("task-form").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    if (button.dataset.action === "delete") {
        const confirmed = window.confirm(
            `Delete "${task.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        tasks = tasks.filter(current => current.id !== task.id);

        if (editingTaskId === task.id) {
            resetForm();
        }

        saveToLocalStorage();
        renderTasks();
    }
});

// Handle completion checkboxes
taskList.addEventListener("change", event => {
    const checkbox = event.target.closest('input[data-action="toggle"]');

    if (!checkbox) return;

    const item = checkbox.closest(".task-item");
    const task = tasks.find(current => current.id === item?.dataset.id);

    if (!task) return;

    task.completed = checkbox.checked;

    saveToLocalStorage();
    renderTasks();
});

// 15. Cancel editing
cancelEditBtn.addEventListener("click", resetForm);

// 16. Filter tasks by status
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        renderTasks();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === currentFilter)
    );
});

// 17. Search tasks
searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim();
    renderTasks();
});

// 18. Filter by category
categoryFilterInput.addEventListener("change", () => {
    categoryFilter = categoryFilterInput.value;
    renderTasks();
});

// 19. Delete all completed tasks
clearCompletedBtn.addEventListener("click", () => {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        showMessage("There are no completed tasks to clear.");
        return;
    }

    const confirmed = window.confirm(
        `Delete all ${completedTasks.length} completed task(s)?`
    );

    if (!confirmed) return;

    tasks = tasks.filter(task => !task.completed);

    saveToLocalStorage();
    renderTasks();
    showMessage("Completed tasks cleared.");
});

// 20. Drag-and-drop reordering
taskList.addEventListener("dragstart", event => {
    const item = event.target.closest(".task-item");

    if (!item) return;

    draggedTaskId = item.dataset.id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedTaskId);

    item.classList.add("dragging");
});

taskList.addEventListener("dragover", event => {
    event.preventDefault();

    const target = event.target.closest(".task-item");

    taskList.querySelectorAll(".drag-over").forEach(item => {
        item.classList.remove("drag-over");
    });

    if (target && target.dataset.id !== draggedTaskId) {
        target.classList.add("drag-over");
        event.dataTransfer.dropEffect = "move";
    }
});

taskList.addEventListener("drop", event => {
    event.preventDefault();

    const target = event.target.closest(".task-item");
    const sourceId = draggedTaskId ||
        event.dataTransfer.getData("text/plain");

    if (!target || !sourceId || target.dataset.id === sourceId) {
        return;
    }

    const visibleIds = getVisibleTasks().map(task => task.id);
    const fromVisibleIndex = visibleIds.indexOf(sourceId);
    const toVisibleIndex = visibleIds.indexOf(target.dataset.id);

    if (fromVisibleIndex === -1 || toVisibleIndex === -1) {
        return;
    }

    // Reorder only the visible slots, preserving filtered-out task positions.
    const reorderedIds = [...visibleIds];
    const [movedId] = reorderedIds.splice(fromVisibleIndex, 1);
    reorderedIds.splice(toVisibleIndex, 0, movedId);

    const visibleIdSet = new Set(visibleIds);
    const reorderedTasks = [...tasks];
    let nextVisibleIndex = 0;

    for (let index = 0; index < reorderedTasks.length; index++) {
        if (visibleIdSet.has(reorderedTasks[index].id)) {
            const nextId = reorderedIds[nextVisibleIndex++];
            reorderedTasks[index] = tasks.find(task => task.id === nextId);
        }
    }

    tasks = reorderedTasks;

    saveToLocalStorage();
    renderTasks();
});

taskList.addEventListener("dragend", () => {
    draggedTaskId = null;

    taskList.querySelectorAll(".dragging, .drag-over").forEach(item => {
        item.classList.remove("dragging", "drag-over");
    });
});

// 21. Display today's date
document.getElementById("today-date").textContent =
    new Date().toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// 22. Initialize the application
loadFromLocalStorage();
renderTasks();
