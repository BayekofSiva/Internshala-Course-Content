const express = require('express');
const validateUser = require('../middleware/validateUser');

// Create a router instance. This allows grouping all user‑related routes
// under a common path prefix.
const router = express.Router();

// In‑memory array of users. A real application would use a database instead,
// but the assignment explicitly requires storing data in memory.
let users = [
  { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" },
  { id: "2", firstName: "Rahul", lastName: "Mehta", hobby: "Cricket" },
  { id: "3", firstName: "Priya", lastName: "Sharma", hobby: "Painting" },
  { id: "4", firstName: "Vikram", lastName: "Singh", hobby: "Cycling" },
  { id: "5", firstName: "Sneha", lastName: "Patel", hobby: "Cooking" },
  { id: "6", firstName: "Aman", lastName: "Kumar", hobby: "Photography" },
  { id: "7", firstName: "Kavita", lastName: "Rao", hobby: "Gardening" },
  { id: "8", firstName: "Rohit", lastName: "Joshi", hobby: "Guitar" },
  { id: "9", firstName: "Meera", lastName: "Iyer", hobby: "Traveling" },
  { id: "10", firstName: "Arjun", lastName: "Verma", hobby: "Chess" }
];


// Helper function to locate a user by ID
function findUserById(id) {
  return users.find((u) => u.id === id);
}

// GET /users – return the list of all users
router.get('/users', (req, res) => {
  res.status(200).json(users);
});

// GET /users/:id – return details of a specific user by ID
router.get('/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(user);
});

// POST /user – add a new user
router.post('/user', validateUser, (req, res) => {
  const { firstName, lastName, hobby } = req.body;
  // Create a simple sequential ID. In production you might use a UUID.
  const newUser = {
    id: (users.length + 1).toString(),
    firstName,
    lastName,
    hobby
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /user/:id – update details of an existing user
router.put('/user/:id', validateUser, (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  // Merge existing values with request body. Ensure the ID remains unchanged.
  const updatedUser = {
    ...users[index],
    ...req.body,
    id: users[index].id
  };
  users[index] = updatedUser;
  res.status(200).json(updatedUser);
});

// DELETE /user/:id – delete a user by ID
router.delete('/user/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  const deletedUser = users.splice(index, 1)[0];
  res.status(200).json({ message: 'User deleted', user: deletedUser });
});

module.exports = router;