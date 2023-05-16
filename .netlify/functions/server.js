const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: 'postgresql://abdessattar:SvlLiCQsKTk3vgqx3ZaDyQ@hipsters-4588.6zw.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full'
});

// Define the SQL query to create the table if it does not exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS my_table (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL
  );
`;

// Create the table if it does not exist
pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table', err.stack);
  } else {
    console.log('Table created successfully');
  }
});

// Handle GET requests to return a message
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

// Handle POST requests to insert data into the table
app.post('/store-data', (req, res) => {
  const data = req.body;
  const insertDataQuery = `
    INSERT INTO my_table (data) VALUES ($1)
  `;
  pool.query(insertDataQuery, [data], (err, result) => {
    if (err) {
      console.error('Error inserting data', err.stack);
      res.status(500).send(err);
    } else {
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
    }
  });
});

// Export the Express app as a serverless function
module.exports.handler = app;
