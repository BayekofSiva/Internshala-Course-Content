# User API – RESTful Service with Node.js and Express

A simple RESTful API for managing a list of users.  
Built with **Node.js** and **Express**, it demonstrates routing, middleware, HTTP methods, error handling, and using an in-memory data source.

---

## ✨ Features

- **CRUD operations** for users
  - `GET /users` – fetch all users
  - `GET /users/:id` – fetch one user by ID
  - `POST /user` – create a new user
  - `PUT /user/:id` – update existing user
  - `DELETE /user/:id` – delete user by ID
- **Middleware**
  - Logging middleware: logs method, URL, status code, and duration
  - Validation middleware: checks `firstName`, `lastName`, `hobby` for POST & PUT
- **Error handling**
  - Returns `400`, `404`, `200`, `201` with clear error JSON
- **In-memory storage**
  - Users stored in an array (no database required)
- **Pre-seeded with 10 random users** for testing

---

## 📂 Project Structure

course-six-first-assignment/
│
├── index.js # App entry point
├── package.json # Dependencies & scripts
├── routes/
│ └── users.js # REST endpoints & in-memory array
└── middleware/
├── logger.js # Request logging
└── validateUser.js # Input validation

- Start the Server

For Development (auto-reload with nodemon): npm run dev
For Productoin: npm start

API Endpoints
Get all users
GET /users

Get a user by ID
GET /users/:id

Add a new user
POST /user
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "hobby": "Cycling"
}

Update an existing user
PUT /user/:id
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "hobby": "Reading"
}

Delete a user
DELETE /user/:id
