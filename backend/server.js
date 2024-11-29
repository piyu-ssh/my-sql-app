const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
 host: 'sql102.infinityfree.com',
  user: 'if0_37808752',
  password: 'piyushgupta17',
  database: 'if0_37808752_todo_database'
});
// Removed my local vars
// Create Tasks Table
const createTasksTable = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id BIGINT PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      )
    `);
    connection.release();
    console.log('Todos table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Routes
app.get('/todos', async (req, res) => {
  try {
    const [todos] = await pool.query('SELECT * FROM todos');
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/todos', async (req, res) => {
  const { text, id } = req.body;
  try {
    await pool.query(
      'INSERT INTO todos (id, text) VALUES (?, ?)', 
      [id, text]
    );
    res.status(201).json({ text, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE todos SET completed = NOT completed WHERE id = ?', [id]);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize
createTasksTable();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
