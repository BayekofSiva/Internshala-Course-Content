/**
 * Validation middleware for user creation and update routes.
 * Ensures that the request body contains the required fields: firstName, lastName
 * and hobby. If any of these are missing or falsy, a 400 Bad Request response
 * is returned with a helpful error message. Otherwise, the next middleware or
 * route handler is invoked.
 */
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName || !lastName || !hobby) {
    return res
      .status(400)
      .json({ error: 'firstName, lastName and hobby are required fields' });
  }
  next();
}

module.exports = validateUser;