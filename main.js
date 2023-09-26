// Functions

// Function to render a todo item on the webpage
function renderTodo(todo) {
  // Save the todoItems array in local storage
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));

  // Get a reference to the todo list container element
  const list = document.querySelector(".js-todo-list");

  // Find the existing todo item element with a matching data-key attribute
  const item = document.querySelector(`[data-key='${todo.id}']`);

  // If the todo item is marked as deleted, remove it from the DOM and return
  if (todo.deleted) {
    item.remove();
    return;
  }

  // Determine if the todo item is checked or not
  const isChecked = todo.checked ? "done" : "";

  // Create a new list item element with appropriate attributes and HTML structure
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
      <input id="${todo.id}" type="checkbox"/>
      <label for="${todo.id}" class="tick js-tick"></label>
      <span>${todo.text}</span>
      <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
      </button>
    `;

  // Replace the existing item element with the new node if it exists, otherwise append the new node to the list
  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

// Array to store todo items
let todoItems = [];

// Function to add a new todo item
function addTodo(text) {
  // Create a new todo object with provided text, unchecked status, and a unique id
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  // Add the new todo to the todoItems array
  todoItems.push(todo);

  // Render the new todo item on the webpage
  renderTodo(todo);
}

// Function to toggle the done status of a todo item
function toggleDone(key) {
  // Find the index of the todo item with the provided key
  const index = todoItems.findIndex((item) => item.id === Number(key));

  // Toggle the checked status of the todo item
  todoItems[index].checked = !todoItems[index].checked;

  // Render the updated todo item on the webpage
  renderTodo(todoItems[index]);
}

// Function to delete a todo item
function deleteTodo(key) {
  // Find the index of the todo item with the provided key
  const index = todoItems.findIndex((item) => item.id === Number(key));

  // Create a new todo object with deleted status and the properties of the todo item
  const todo = {
    deleted: true,
    ...todoItems[index],
  };

  // Remove the todo item from the todoItems array
  todoItems = todoItems.filter((item) => item.id !== Number(key));

  // Render the deleted todo item on the webpage
  renderTodo(todo);
}

// Event listeners

// Event listener for form submission
const form = document.querySelector(".js-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the input element and trim the value
  const input = document.querySelector(".js-todo-input");
  const text = input.value.trim();

  // If the input value is not empty, add a new todo item, clear the input, and focus on it
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

// Event listener for todo list clicks
const list = document.querySelector(".js-todo-list");
list.addEventListener("click", (event) => {
  // If the clicked element has the class "js-tick", toggle the done status of the corresponding todo item
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  // If the clicked element has the class "js-delete-todo", delete the corresponding todo item
  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

// Event listener for when the DOM has finished loading
document.addEventListener("DOMContentLoaded", () => {
  // Get the stored todoItems from local storage
  const ref = localStorage.getItem("todoItemsRef");

  // If there are stored todoItems, parse them and render each one on the webpage
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
