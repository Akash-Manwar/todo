document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('date-btn').addEventListener('click', showDate);
document.getElementById('current-date').style.display = 'none';

window.onload = function () {
    loadTasks();
};

function addTask() {
    const taskText = document.getElementById('new-task').value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const currentDate = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const task = { text: taskText, completed: false, date: currentDate };
    saveTask(task);
    addTaskToDOM(task, false);
    document.getElementById('new-task').value = "";
}

function saveTask(task) {
    let tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => addTaskToDOM(task, task.completed));
}

function addTaskToDOM(task, isCompleted) {
    const taskItem = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = `${task.text} (Added on: ${task.date})`;

    const completeBtn = document.createElement('button');
    completeBtn.textContent = isCompleted ? "Uncomplete" : "Complete";
    completeBtn.classList.add('complete-btn');
    completeBtn.onclick = function () {
        if (isCompleted) {
            moveTask(taskItem, 'uncompleted-list', false);
        } else {
            moveTask(taskItem, 'completed-list', true);
        }
        saveAllTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = function () {
        const newText = prompt("Edit Task:", task.text);
        if (newText && newText.trim() !== "") {
            taskItem.querySelector('span').textContent = `${newText} (Added on: ${task.date})`;
            task.text = newText;
            saveAllTasks();
        }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = function () {
        deleteTask(task);
        taskItem.remove();
    };

    taskItem.append(taskSpan, editBtn, completeBtn, deleteBtn);
    taskItem.classList.add(isCompleted ? 'completed' : 'uncompleted');

    document.getElementById(isCompleted ? 'completed-list' : 'uncompleted-list').appendChild(taskItem);
}

function moveTask(taskItem, targetListId, isCompleted) {
    const taskText = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
    const taskDate = taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1);
    taskItem.remove();
    addTaskToDOM({ text: taskText, completed: isCompleted, date: taskDate }, isCompleted);
}

function deleteTask(task) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.text !== task.text || t.date !== task.date);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showDate() {
    const dateElement = document.getElementById('current-date');
    const currentDate = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    dateElement.style.display = 'block';
    dateElement.textContent = currentDate;
}

function saveAllTasks() {
    const tasks = [];
    document.querySelectorAll('#completed-list li').forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
        const date = taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1);
        tasks.push({ text, completed: true, date });
    });
    document.querySelectorAll('#uncompleted-list li').forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent.split(' (Added on: ')[0];
        const date = taskItem.querySelector('span').textContent.split(' (Added on: ')[1].slice(0, -1);
        tasks.push({ text, completed: false, date });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
