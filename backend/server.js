

const express = require('express');
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: ['https://my-sql-app-6.onrender.com'], // Add your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Include cookies if needed
};
app.use(cors(corsOptions));
app.use(express.json());

// === PostgreSQL Connection ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ElephantSQL connection string
  ssl: {
    rejectUnauthorized: false, // Required for ElephantSQL
  },
});

// === Create Tasks Table ===
const createTasksTable = async () => {
  try {
    // PostgreSQL query to create the table
    const query = `
      CREATE TABLE IF NOT EXISTS todos (
        id BIGSERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      )
    `;
    await pool.query(query);
    console.log('Todos table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// === Routes ===
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows); // Use `rows` for PostgreSQL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text]
    );
    res.status(201).json(result.rows[0]); // Return the inserted row
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(200).json(result.rows[0]); // Return the updated row
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Initialize ===
createTasksTable();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
