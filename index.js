const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Clean my room', completed: false },
  { id: 2, title: 'Read a book', completed: true },
];

// fetch tasks status filter too
app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  let results = tasks;

  if (status === 'completed') {
    results = tasks.filter(task => task.completed);
  } else if (status === 'pending') {
    results = tasks.filter(task => !task.completed);
  }

  res.json(results);
});

// create a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// mark a task as completed
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID.' });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found.' });

  task.completed = true;
  res.json(task);
});

// delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID.' });

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found.' });

  const removed = tasks.splice(index, 1)[0];
  res.json(removed);
});

app.get('/', (req, res) => {
  res.send('<h2>Task API up and running!</h2>');
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
