// =================================================================================
// Application State and DOM Element Selection
// =================================================================================

/**
 * Main application state.
 * @property {Array<Object>} tasks - The list of all todo items.
 * @property {HTMLElement|null} editingCard - The card currently being edited.
 */
const state = {
  tasks: [],
  editingCard: null,
};

// Selecting essential DOM elements to be used throughout the script.
const todoForm = document.getElementById("todo-form");
const todoTitleInput = document.getElementById("todo-title");
const todoContentInput = document.getElementById("todo-content");
const todoGrid = document.getElementById("todo-grid");
const editTodoModal = document.getElementById("editTodoModal");
const cancelBtn = document.getElementById("cancelBtn");
const modalForm = document.getElementById("todoForm");
const modalTitleInput = document.getElementById("todoTitle");
const modalContentInput = document.getElementById("todoContent");

// =================================================================================
// Core Functions
// =================================================================================

/**
 * Initializes the application.
 * Fetches tasks from local storage, renders them, and sets up event listeners.
 */
function init() {
  // Fetch tasks from local storage and store them in the state.
  state.tasks = getTasksFromStorage();
  // Render all tasks to the DOM.
  renderAllTasks();
  // Attach all necessary event listeners.
  setupEventListeners();
}

/**
 * Renders all tasks from the state to the DOM.
 * Clears the grid before rendering to prevent duplicates.
 */
function renderAllTasks() {
  // Clear the grid to ensure a fresh render.
  todoGrid.innerHTML = "";
  // Loop through each task and append it to the grid.
  for (const task of state.tasks) {
    const taskElement = createTaskElement(task);
    todoGrid.appendChild(taskElement);
  }
}

/**
 * Creates a DOM element for a single task.
 * @param {Object} task - The task object containing id, title, contents, etc.
 * @returns {HTMLElement} The created div element for the task card.
 */
function createTaskElement(task) {
  const card = document.createElement("div");
  card.id = task.id;
  // Add base classes for styling the card.
  card.classList.add(
    "bg-gray-800",
    "rounded-lg",
    "p-4",
    "shadow-lg",
    "flex",
    "flex-col",
    "justify-between",
    "transition-transform",
    "transform",
    "hover:scale-105",
    "todo-card",
    "fade-in"
  );

  // Populate the card's inner HTML.
  card.innerHTML = `
    <div>
      <h2 class="text-xl font-bold text-white p-2 border-b-2 border-gray-700 todo-title-output">${task.title}</h2>
      <p class="text-sm break-words text-gray-300 p-2 todo-description-output">${task.contents}</p>
    </div>
    <div class="flex justify-between items-center gap-2 p-2">
      <div class="text-xs text-gray-400">${new Date(
        task.createdDate
      ).toLocaleDateString()}</div>
      <div class="flex justify-end gap-4 p-2">
        <i class="fa-solid fa-check hover:cursor-pointer text-green-500 hover:text-green-400 todo-check-icon"></i>
        <i class="fa-solid fa-pencil hover:cursor-pointer text-blue-500 hover:text-blue-400 todo-edit-icon"></i>
        <i class="fa-solid fa-trash hover:cursor-pointer text-red-500 hover:text-red-400 todo-delete-icon"></i>
      </div>
    </div>
  `;

  // If the task is completed, apply the completed styles.
  if (task.completed) {
    updateTaskAppearance(card, true);
  }

  return card;
}

/**
 * Updates the visual appearance of a task card based on its completion status.
 * @param {HTMLElement} card - The card element to update.
 * @param {boolean} isCompleted - The completion status of the task.
 */
function updateTaskAppearance(card, isCompleted) {
  const checkIcon = card.querySelector(".todo-check-icon");
  const todoTitle = card.querySelector(".todo-title-output");

  if (isCompleted) {
    card.classList.remove("bg-gray-800");
    card.classList.add("bg-green-900");
    checkIcon.classList.remove("text-green-500");
    checkIcon.classList.add("text-white");
    todoTitle.classList.add("line-through");
  } else {
    card.classList.remove("bg-green-900");
    card.classList.add("bg-gray-800");
    checkIcon.classList.remove("text-white");
    checkIcon.classList.add("text-green-500");
    todoTitle.classList.remove("line-through");
  }
}


// =================================================================================
// Event Handling
// =================================================================================

/**
 * Sets up all the initial event listeners for the application.
 */
function setupEventListeners() {
  // Listener for the main form submission to add new tasks.
  todoForm.addEventListener("submit", handleAddTask);
  // Listener for clicks on the todo grid (delegated for edit, delete, check).
  todoGrid.addEventListener("click", handleGridClick);
  // Listener for the modal form submission to update tasks.
  modalForm.addEventListener("submit", handleUpdateTask);
  // Listener for the modal's cancel button.
  cancelBtn.addEventListener("click", closeModal);
  // Listener to close the modal when clicking on the overlay.
  editTodoModal.addEventListener("click", (e) => {
    if (e.target === editTodoModal) {
      closeModal();
    }
  });
  // Listener to close the modal with the Escape key.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !editTodoModal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

/**
 * Handles the submission of the main todo form to add a new task.
 * @param {Event} e - The form submission event.
 */
function handleAddTask(e) {
  e.preventDefault();
  const title = todoTitleInput.value.trim();
  const contents = todoContentInput.value.trim();

  if (!title || !contents) {
    alert("Please fill out both fields.");
    return;
  }

  const newTask = {
    id: getNextId(),
    title,
    contents,
    createdDate: Date.now(),
    completed: false,
  };

  // Add the new task to the beginning of the array and render it.
  state.tasks.unshift(newTask);
  saveTasksToStorage();

  const taskElement = createTaskElement(newTask);
  todoGrid.prepend(taskElement);

  // Clear the input fields.
  todoTitleInput.value = "";
  todoContentInput.value = "";
}

/**
 * Handles clicks within the todo grid, delegating to appropriate functions.
 * @param {Event} e - The click event.
 */
function handleGridClick(e) {
  const card = e.target.closest(".todo-card");
  if (!card) return;

  const cardId = parseInt(card.id, 10);

  if (e.target.classList.contains("todo-delete-icon")) {
    handleDeleteTask(cardId);
  } else if (e.target.classList.contains("todo-edit-icon")) {
    handleEditTask(card);
  } else if (e.target.classList.contains("todo-check-icon")) {
    handleToggleComplete(cardId);
  }
}

/**
 * Handles deleting a task.
 * @param {number} cardId - The ID of the task to delete.
 */
function handleDeleteTask(cardId) {
    // Remove the task from the state.
    state.tasks = state.tasks.filter(task => task.id !== cardId);
    saveTasksToStorage();
    // Remove the task from the DOM.
    document.getElementById(cardId).remove();
}

/**
 * Handles initiating the editing of a task.
 * @param {HTMLElement} card - The card element to be edited.
 */
function handleEditTask(card) {
    state.editingCard = card;
    const task = state.tasks.find(t => t.id == card.id);

    if (task) {
        modalTitleInput.value = task.title;
        modalContentInput.value = task.contents;
        openModal();
    }
}

/**
 * Handles toggling the completion status of a task.
 * @param {number} cardId - The ID of the task to toggle.
 */
function handleToggleComplete(cardId) {
    const task = state.tasks.find(t => t.id === cardId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        const card = document.getElementById(cardId);
        updateTaskAppearance(card, task.completed);
    }
}

/**
 * Handles the submission of the modal form to update a task.
 * @param {Event} e - The form submission event.
 */
function handleUpdateTask(e) {
  e.preventDefault();
  if (!state.editingCard) return;

  const cardId = state.editingCard.id;
  const task = state.tasks.find(t => t.id == cardId);

  if (task) {
    task.title = modalTitleInput.value.trim();
    task.contents = modalContentInput.value.trim();
    saveTasksToStorage();

    // Update the card in the DOM.
    state.editingCard.querySelector(".todo-title-output").textContent = task.title;
    state.editingCard.querySelector(".todo-description-output").textContent = task.contents;
  }

  closeModal();
}

// =================================================================================
// Modal and Local Storage Utility Functions
// =================================================================================

/**
 * Opens the edit modal.
 */
function openModal() {
  editTodoModal.classList.remove("hidden");
}

/**
 * Closes the edit modal and resets the editing state.
 */
function closeModal() {
  editTodoModal.classList.add("hidden");
  state.editingCard = null;
}

/**
 * Retrieves tasks from local storage.
 * @returns {Array<Object>} The array of tasks.
 */
function getTasksFromStorage() {
  const tasksString = localStorage.getItem("todos");
  return tasksString ? JSON.parse(tasksString) : [];
}

/**
 * Saves the current tasks array to local storage.
 */
function saveTasksToStorage() {
  localStorage.setItem("todos", JSON.stringify(state.tasks));
}

/**
 * Generates the next unique ID for a new task.
 * @returns {number} The next available ID.
 */
function getNextId() {
  // Get the last ID from localStorage, default to 0 if it doesn't exist.
  let lastId = localStorage.getItem("lastUserId") || "0";
  let nextId = parseInt(lastId) + 1;
  // Save the new last ID back to localStorage.
  localStorage.setItem("lastUserId", nextId.toString());
  return nextId;
}

// =================================================================================
// Application Entry Point
// =================================================================================

// Run the init function when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", init);
