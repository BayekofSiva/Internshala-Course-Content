/**
 * Global error handler
 * Logs the error and responds with a JSON error message.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;