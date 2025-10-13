const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Tasks storage file
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Read tasks
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8') || '[]');
        res.json(tasks);
    } catch (error) {
        res.json([]);
    }
});

// Add task
app.post('/api/tasks', (req, res) => {
    try {
        const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8') || '[]');
        const newTask = {
            id: Date.now(),
            text: req.body.text,
            completed: false
        };
        tasks.push(newTask);
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks));
        res.json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        let tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8') || '[]');
        tasks = tasks.filter(task => task.id !== taskId);
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks));
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Toggle task completion
app.patch('/api/tasks/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        let tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8') || '[]');
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks));
            res.json(tasks[taskIndex]);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle task' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
