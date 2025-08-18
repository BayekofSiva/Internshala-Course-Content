const express = require('express');
const logger = require('./middleware/logger');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Built‑in middleware to parse incoming JSON payloads
app.use(express.json());

// Custom request logging middleware
app.use(logger);

// Mount the users router. All user‑related routes live in ./routes/users.js
app.use('/', usersRouter);

// Catch‑all route for unmatched paths – return a 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralised error handler middleware. If any route or middleware calls next(err)
// then this middleware will capture the error and send a response. Without an error
// handler, unhandled exceptions would cause the server to crash. See Express docs:
// https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => {
  res.type('html').send(`
    <h1>User API</h1>
    <p>Try <a href="/users">/users</a></p>
  `);
});


// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`User API server listening on port ${port}`);
});

module.exports = app;