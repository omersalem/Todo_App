/\*\*

- Adds a click event listener to the todoGrid element.
- When a delete icon inside a todo card is clicked,
- finds the closest parent todo card and removes it from the DOM.
- so the closest parent card will be the card that contains this delete icon clicked

\*/

⁡⁣⁢⁣todoGrid.addEventListener("click", (e) => {
if (e.target.classList.contains("todo-delete-icon")) {
const card = e.target.closest(".todo-card");
if (card) {
card.remove();
}
}
});⁡

---

This code bellow listens for clicks on the editTodoModal element (likely a popup or overlay for editing a to-do item).

When you click anywhere inside the modal, the function runs.
It checks if you clicked directly on the modal background (not on any content inside the modal).
If you did, it calls closeModal(), which probably hides or closes the modal.
Why?
This lets users close the modal by clicking outside the modal content, a common user experience pattern.

// Event listener to close the modal when clicking the overlay

⁡⁣⁢⁣editTodoModal.addEventListener("click", (event) => {
// Check if the click is on the modal container itself (the overlay)
if (event.target === editTodoModal) {
closeModal();
}
});⁡

---

⁡// Prevent the form from reloading the page

⁡⁣⁢⁡⁣⁢⁣event.preventDefault();

---

editingCard = card; // Store the card being edited
⁡⁣⁣⁢
This line assigns the value of the variable card to another variable called editingCard. Here’s why you might do this:

Purpose: It keeps track of which card is currently being edited in your to-do app.
How it works: When a user clicks "edit" on a card, you set editingCard to reference that specific card object. This way, your code knows which card to update when the user saves their changes.
Analogy: Think of editingCard as a bookmark pointing to the card you’re working on, so you don’t lose track if there are many cards.⁡

todoGrid.addEventListener("click", (e) => {
const card = e.target.closest(".todo-card");
if (!card) return;

if (e.target.classList.contains("todo-delete-icon")) {
card.remove();
} else if (e.target.classList.contains("todo-edit-icon")) {
openModal();
const title = document.getElementById("todoTitle");
const content = document.getElementById("todoContent");
title.value = card.querySelector(".todo-title-output").textContent;
content.value = card.querySelector(".todo-description-output").textContent;
editingCard = card; // Store the card being edited
} else if (e.target.classList.contains("todo-check-icon")) {
card.classList.toggle("bg-green-500");
}
});⁡

⁡⁣⁣⁢// editingCard is a reference to the todo card being edited.
// This updates the card's title and description with the new values from the modal form.⁡

⁡⁣⁢⁣modalForm.addEventListener("submit", (event) => {
event.preventDefault();

const title = document.getElementById("todoTitle").value;
const content = document.getElementById("todoContent").value;

if (editingCard) {

    editingCard.querySelector(".todo-title-output").textContent = title;
    editingCard.querySelector(".todo-description-output").textContent = content;
    editingCard = null; // Reset after editing is done.

}

closeModal();
});
⁡

---

⁡⁣⁢⁣const card = e.target.closest(".todo-card");⁡

⁡⁣⁣⁢This line of code is used to find a specific parent element in the HTML structure, starting from the element that triggered an event. Here's a breakdown:

1. **`e.target`**: In JavaScript event handling, `e` is the event object. `e.target` is the specific element that the event originated from. For example, if a user clicks on an icon inside a button, `e.target` would be the icon element itself, not the button.

2. **`.closest(".todo-card")`**: This is a method called on the `e.target` element. It travels up the DOM tree from `e.target`, checking itself and its ancestors, and returns the very first ancestor element that matches the CSS selector `".todo-card"`. If it doesn't find any element with the class `todo-card` as it goes up, it will return `null`.

**In simple terms:**

Imagine you clicked a "delete" icon inside a to-do list item. This code finds the main container for that _entire_ to-do item (the element with `class="todo-card"`) so you can then perform an action on it, like removing it from the list. It's a reliable way to get a reference to the parent container, no matter which specific child element inside it was clicked.⁡

⁡⁣⁣⁢example:⁡

⁡⁣⁢⁣todoGrid.addEventListener("click", (e) => {
const card = e.target.closest(".todo-card");
if (!card) return;

if (e.target.classList.contains("todo-delete-icon")) {
card.remove();
} else if (e.target.classList.contains("todo-edit-icon")) {
openModal();
const title = document.getElementById("todoTitle");
const content = document.getElementById("todoContent");
title.value = card.querySelector(".todo-title-output").textContent;
content.value = card.querySelector(".todo-description-output").textContent;
} else if (e.target.classList.contains("todo-check-icon")) {
card.classList.toggle("bg-green-500");
}
});⁡

⁡⁣⁣⁢This JavaScript code adds a click event listener to an HTML element with the ID `todoGrid`. This element likely acts as a container for a list of "todo" items.

Here is a step-by-step breakdown of what the code does when a user clicks within the `todoGrid`:

1. **`const card = e.target.closest(".todo-card");`**: When a click occurs, this line finds the closest parent element with the class `.todo-card`. This ensures that no matter what part of the card is clicked (an icon, text, etc.), the code can identify the specific todo item that was interacted with. If the click is outside of any card, `card` will be `null`.

2. **`if (!card) return;`**: This is a safety check. If the user clicks on the grid's background instead of a card, the function stops executing.

3. **`if (e.target.classList.contains("todo-delete-icon"))`**: It checks if the clicked element is the delete icon. If it is, `card.remove();` is called, which deletes the entire todo card from the page.

4. **`else if (e.target.classList.contains("todo-edit-icon"))`**: If the edit icon is clicked, the following happens:

   - `openModal();`: A function is called to display a modal window (a pop-up form).
   - The code then finds the title and description elements within the clicked card (`.todo-title-output` and `.todo-description-output`).
   - It populates the input fields in the modal (`#todoTitle` and `#todoContent`) with the existing text from the card, allowing the user to edit it.

5. **`else if (e.target.classList.contains("todo-check-icon"))`**: If the checkmark icon is clicked, it toggles the `bg-green-500` class on the card. This is a common way to visually mark a todo item as "complete" by changing its background color. Clicking it again would toggle the color off.

In summary, this code manages the core user interactions for a todo list: deleting an item, opening an edit form for an item, and marking an item as complete.⁡

---

⁡⁣⁣⁢// Event listener to close the modal with the Escape key⁡
⁡⁣⁢⁣document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && !editTodoModal.classList.contains("hidden")) {
closeModal();
}
});⁡


--------------------------------------------------------------------------------

⁡⁣⁣⁢To add to the beginning of the DOM, use⁡ `⁡⁣⁢⁣grid.prepend(newTodoCard)⁡` ⁡⁣⁣⁢instead of⁡ `⁡⁣⁢⁣grid.appendChild(newTodoCard)⁡`.

⁡⁣⁣⁢To add to the beginning of the⁡ `tasks` ⁡⁣⁣⁢array, use⁡ `⁡⁣⁢⁣tasks.unshift(user)⁡` ⁡⁣⁣⁢instead of⁡ `⁡⁣⁢⁣tasks.push(user)⁡`.

⁡⁣⁣⁢so here when add new not it will be shown first in the website and not last⁡.

-------------------------------------------------------------------------------------

⁡⁣⁣⁢why we used⁡ ⁡⁣⁢⁣tasks.push(...myTasks)⁡ ⁡⁣⁣⁢in line 25⁡

⁡⁣⁣⁢The comment in your code is exactly right. Let's break down why that line is so important.

You have two separate pieces of logic:

1. __Loading Logic (`DOMContentLoaded`)__: When the page loads, this code reads all the saved tasks from `localStorage` and displays them on the screen.
2. __Saving Logic (`todoForm` submit)__: When you submit a new to-do, this code adds the new task to the `tasks` array and saves the entire array back to `localStorage`.

The problem is that these two pieces of logic need to share the same list of tasks.

At the top of your script, you declare `const tasks = [];`, which starts as an empty array.

Without the line `tasks.push(...myTasks);`, this is what happens:

1. Page loads.
2. Your `DOMContentLoaded` code reads the saved tasks from `localStorage` into a *local* variable called `myTasks` and displays them.
3. The global `tasks` array, however, is __still empty__.
4. You add a new to-do item.
5. Your `submit` code adds the new item to the global `tasks` array. The array now contains only that one new item.
6. The code then saves this one-item array to `localStorage`, __overwriting and deleting all the old tasks that were there before.__

The line `tasks.push(...myTasks);` fixes this by synchronizing the global `tasks` array with the data from `localStorage` right when the page loads. The `...` (spread syntax) unpacks all the items from `myTasks` and `push` adds them to the global `tasks` array. This ensures that when you add a new item, you are adding it to the full list of existing tasks, not to an empty list.⁡
