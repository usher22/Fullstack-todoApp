const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // frontend link

// Importing models and DB
const sequelize = require('./db');
const Todo = require('./models/Todo');

// ==============================
// ✅ TODOS ROUTES
// ==============================

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching todos' });
  }
});

// POST create new todo
app.post('/todos', async (req, res) => {
  try {
    const { id, task } = req.body;
    if (!task) return res.status(400).send({ message: 'Enter a task' });

    const todo = await Todo.create({ id: id || Math.random().toString(), task });
    res.status(201).send(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error adding todo' });
  }
});

// DELETE a todo by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send({ message: 'Task not found' });
    res.send({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error deleting todo' });
  }
});

// PATCH update a todo by ID
app.patch('/todos/:id', async (req, res) => {
  try {
    const [updatedCount, updatedRows] = await Todo.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (!updatedCount) return res.status(404).send({ message: 'Task not found' });
    res.send(updatedRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating todo' });
  }
});

// ==============================
// ✅ START SERVER
// ==============================
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected & models synced.');

    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();
