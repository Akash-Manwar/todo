document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('date-btn').addEventListener('click', showDate);

// Initially hide the current date display
document.getElementById('current-date').style.display = 'none';

// Load tasks from localStorage when the page loads
window.onload = function() {
    loadTasks();
};

// Add a new task
function addTask() {
    const taskText = document.getElementById('new-task').value;
    if (taskText.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const currentDate = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const task = {
        text: taskText,
        completed: false,
        date: currentDate
    };

    saveTask(task);
    addTaskToDOM(task, false);

    document.getElementById('new-task').value = "";  // Clear input after adding task
}

// Save task to localStorage
function saveTask(task) {
    let tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from localStorage
function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Load tasks from localStorage and add to DOM
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
        addTaskToDOM(task, task.completed);
    });
}

// Add task to DOM
function addTaskToDOM(task, isCompleted) {
    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = `${task.text} (Added on: ${task.date})`;

    // Create 'Complete' or 'Uncomplete' button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = isCompleted ? "Uncomplete" : "Complete";
    completeBtn.classList.add('complete-btn');
    completeBtn.onclick = function() {
        if (isCompleted) {
            moveTask(taskItem, 'uncompleted-list', false);
        } else {
            moveTask(taskItem, 'completed-list', true);
        }
    };

    // Create 'Edit' button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = function() {
        const newText = prompt("Edit Task:", task.text);
        if (newText) {
            taskItem.querySelector('span').textContent = `${newText} (Added on: ${task.date})`;
            task.text = newText;  // Update task text in the original object
            saveAllTasks();  // Save all tasks to localStorage after editing
        }
    };

    // Create 'Delete' button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function() {
        deleteTask(task);
        taskItem.remove();
    };

    // Add the buttons and span to the task item
    taskItem.appendChild(taskSpan);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(completeBtn);
    taskItem.appendChild(deleteBtn);

    // Add class for styling (completed or uncompleted)
    taskItem.classList.add(isCompleted ? 'completed' : 'uncompleted');

    // Append the task item to the appropriate list
    document.getElementById(isCompleted ? 'completed-list' : 'uncompleted-list').appendChild(taskItem);
}

// Move task between completed and uncompleted lists
function moveTask(taskItem, targetListId, isCompleted) {
    const targetList = document.getElementById(targetListId);
    const taskText = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
    
    taskItem.remove();  // Remove from current list
    const newTask = {
        text: taskText,
        completed: isCompleted,
        date: taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1)
    };

    addTaskToDOM(newTask, isCompleted);  // Add to the target list
}

// Function to delete task from localStorage
function deleteTask(task) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.text !== task.text || t.date !== task.date);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to show current day and date
function showDate() {
    const dateElement = document.getElementById('current-date');
    const currentDate = new Date();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);

    // Show the date element and update its content
    dateElement.style.display = 'block';
    dateElement.textContent = formattedDate;
}

// Function to save all tasks back to localStorage after editing
function saveAllTasks() {
    const tasks = [];
    const completedTasks = document.querySelectorAll('#completed-list li');
    const uncompletedTasks = document.querySelectorAll('#uncompleted-list li');

    completedTasks.forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
        const taskDate = taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1);
        tasks.push({ text: taskText, completed: true, date: taskDate });
    });

    uncompletedTasks.forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
        const taskDate = taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1);
        tasks.push({ text: taskText, completed: false, date: taskDate });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
