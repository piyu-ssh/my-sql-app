// const inputtdl = document.querySelector('.textarea');
// const buttontdl = document.querySelector('.buttoninput');
// const listtdl = document.querySelector('.todolist');

// const API_URL = 'http://localhost:3001';

// // Load todos when page loads
// document.addEventListener('DOMContentLoaded', loadTodoLists);

// // Event Listeners
// buttontdl.addEventListener('click', clickButton);
// listtdl.addEventListener('click', okdel);

// // ! Added through Claude
// inputtdl.addEventListener('keydown', (event) => {
//   if (event.key === 'Enter') {
//     // Trigger the onClick event of the button
//     buttontdl.click();
//   }
// });

// // Function to handle button click
// function clickButton(e) {
//     e.preventDefault();
//     addTodo();
// }

// // Function to add a new todo item
// async function addTodo() {
//     if (inputtdl.value === '') return;

//     const todo = {
//         text: inputtdl.value,
//         id: Date.now()
//     };

//     try {
//         await fetch(`${API_URL}/todos`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(todo)
//         });

//         createTodoElement(todo);
//         inputtdl.value = '';
//     } catch (error) {
//         console.error('Error adding todo:', error);
//     }
// }

// // Function to create todo element and append to list
// function createTodoElement(todo) {
//     const itemall = document.createElement('div');
//     itemall.classList.add('itemall');
//     itemall.setAttribute('data-id', todo.id);

//     const item = document.createElement('p');
//     item.classList.add('item');
//     item.innerText = todo.text;
//     itemall.appendChild(item);

//     const checkbutton = document.createElement("button");
//     checkbutton.innerHTML = '<i class="fa-solid fa-check"></i>';
//     checkbutton.classList.add("check-button");
//     itemall.appendChild(checkbutton);

//     const trashbutton = document.createElement("button");
//     trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
//     trashbutton.classList.add("trash-button");
//     itemall.appendChild(trashbutton);

//     listtdl.appendChild(itemall);
// }

// // Function to load todos from backend
// async function loadTodoLists() {
//     try {
//         const response = await fetch(`${API_URL}/todos`);
//         const todos = await response.json();
//         todos.forEach(todo => createTodoElement(todo));
//     } catch (error) {
//         console.error('Error loading todos:', error);
//     }
// }

// // Function to handle checking and deleting todo items
// async function okdel(e) {
//     const item = e.target;

//     // Check functionality
//     if (item.classList[0] === 'check-button') {
//         const todolist = item.parentElement;
//         const todoId = todolist.getAttribute('data-id');
//         todolist.classList.toggle('checklist');
        
//         try {
//             await fetch(`${API_URL}/todos/${todoId}/toggle`, { method: 'PUT' });
//         } catch (error) {
//             console.error('Error toggling todo:', error);
//         }
//     }

//     // Delete functionality
//     if (item.classList[0] === 'trash-button') {
//         const todolist = item.parentElement;
//         const todoId = todolist.getAttribute('data-id');
        
//         try {
//             await fetch(`${API_URL}/todos/${todoId}`, { method: 'DELETE' });
//             todolist.remove();
//         } catch (error) {
//             console.error('Error deleting todo:', error);
//         }
//     }
// }

const inputtdl = document.querySelector('.textarea');
const buttontdl = document.querySelector('.buttoninput');
const listtdl = document.querySelector('.todolist');

const API_URL = 'http://localhost:3001';

// Load todos when page loads
document.addEventListener('DOMContentLoaded', loadTodoLists);

// Event Listeners
buttontdl.addEventListener('click', clickButton);
listtdl.addEventListener('click', okdel);

// Added through Claude
inputtdl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Trigger the onClick event of the button
    buttontdl.click();
  }
});

// Function to handle button click
function clickButton(e) {
    e.preventDefault();
    addTodo();
}

// Function to add a new todo item
async function addTodo() {
    if (inputtdl.value === '') return;

    const todo = {
        text: inputtdl.value,
        id: Date.now()
    };

    try {
        await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });

        createTodoElement(todo);
        inputtdl.value = '';
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

// Function to create todo element and append to list
function createTodoElement(todo) {
    const currentTasks = listtdl.querySelectorAll('.itemall').length;
    const taskNumber = currentTasks + 1;

    const itemall = document.createElement('div');
    itemall.classList.add('itemall');
    itemall.setAttribute('data-id', todo.id);

    const item = document.createElement('p');
    item.classList.add('item');
    item.innerText = `Task: ${todo.text}`;
    itemall.appendChild(item);

    const checkbutton = document.createElement("button");
    checkbutton.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkbutton.classList.add("check-button");
    itemall.appendChild(checkbutton);

    const trashbutton = document.createElement("button");
    trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashbutton.classList.add("trash-button");
    itemall.appendChild(trashbutton);

    listtdl.appendChild(itemall);

    // Reindex tasks after adding
    reindexTasks();
}

// Function to reindex tasks
function reindexTasks() {
    const taskElements = listtdl.querySelectorAll('.itemall');
    taskElements.forEach((taskElement, index) => {
        const itemText = taskElement.querySelector('.item');
        const currentText = itemText.innerText;
        
        // Remove existing "Task: " prefix if it exists
        const textWithoutPrefix = currentText.replace(/^Task:\s*/, '');
        
        // Add new Task: prefix
        itemText.innerText = `Task: ${textWithoutPrefix}`;
    });
}

// Function to load todos from backend
async function loadTodoLists() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        todos.forEach(todo => createTodoElement(todo));
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

// Function to handle checking and deleting todo items
async function okdel(e) {
    const item = e.target;

    // Check functionality
    if (item.classList[0] === 'check-button') {
        const todolist = item.parentElement;
        const todoId = todolist.getAttribute('data-id');
        todolist.classList.toggle('checklist');
        
        try {
            await fetch(`${API_URL}/todos/${todoId}/toggle`, { method: 'PUT' });
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    // Delete functionality
    if (item.classList[0] === 'trash-button') {
        const todolist = item.parentElement;
        const todoId = todolist.getAttribute('data-id');
        
        try {
            await fetch(`${API_URL}/todos/${todoId}`, { method: 'DELETE' });
            todolist.remove();
            
            // Reindex tasks after deletion
            reindexTasks();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }
}