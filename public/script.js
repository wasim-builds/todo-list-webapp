document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Fetch tasks on page load
    fetchTasks();

    // Add task event listener
    addTaskBtn.addEventListener('click', addTask);

    // Allow adding task by pressing Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Fetch tasks from server
    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    // Add new task
    async function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: taskText })
            });

            const newTask = await response.json();
            renderSingleTask(newTask);
            
            // Clear input
            taskInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    // Render all tasks
    function renderTasks(tasks) {
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach(renderSingleTask);
    }

    // Render single task
    function renderSingleTask(task) {
        const li = document.createElement('li');
        li.dataset.taskId = task.id;
        
        // Create task text element
        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.classList.toggle('completed', task.completed);
        
        // Create toggle complete button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Undo' : 'Complete';
        toggleBtn.classList.add('toggle-btn');
        toggleBtn.addEventListener('click', toggleTask);

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', deleteTask);

        // Append elements
        li.appendChild(taskTextSpan);
        li.appendChild(toggleBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    // Toggle task completion
    async function toggleTask(e) {
        const li = e.target.closest('li');
        const taskId = li.dataset.taskId;

        try {
            const response = await fetch(`/api/tasks/${taskId}
