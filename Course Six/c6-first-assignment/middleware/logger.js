/**
 * Custom logging middleware to print details of each incoming HTTP request.
 * It logs the HTTP method, request URL, response status code and time taken to
 * process the request. This helps when debugging or analysing API usage.
 */
function logger(req, res, next) {
  // Record the start time of the request
  const start = Date.now();
  // When the response finishes, compute duration and log details
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
}

module.exports = logger;