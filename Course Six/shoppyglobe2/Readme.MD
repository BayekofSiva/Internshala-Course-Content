🛍️ ShoppyGlobe – E-Commerce API & Frontend

ShoppyGlobe is a Node.js + Express + MongoDB project built as a backend + simple frontend demo for an e-commerce store.
It supports:

JWT authentication (Register/Login)

Product listing (50 seeded tech products)

Cart management (Add, Update, Delete items)

Professional frontend (teal/turquoise theme, dark/light toggle)

🚀 Features

API Endpoints:

GET /api/products → fetch all products

GET /api/products/:id → fetch single product

POST /api/cart → add product to cart

PUT /api/cart/:id → update cart quantity

DELETE /api/cart/:id → remove from cart

POST /api/auth/register → register a new user

POST /api/auth/login → login & get JWT token

Database:

Products collection (name, price, description, stock, image)

Cart collection (user, productId, quantity)

Users collection (username, bcrypt-hashed password)

Frontend:

Responsive UI with dark/light toggle

Registration + Login forms

Product cards

Cart management

⚙️ Setup Instructions
1. Clone & Install
git clone <your-repo-url>
cd shoppyglobe
npm install

2. Environment Variables

Create a .env file in the root:

MONGO_URI=mongodb://localhost:27017/shoppyglobe
JWT_SECRET=superSecretKey
PORT=3000

3. Start MongoDB

If installed as a service (recommended):

net start MongoDB


Or check status:

Get-Service MongoDB


If not a service, run:

mongod

4. Seed Products
npm run seed

5. Start App
npm start


Visit http://localhost:3000.

🧪 Testing

Use ThunderClient or Postman to test APIs.

Example login request:

POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "mypassword"
}


Response:

{
  "token": "eyJhbGciOi..."
}


Use the token in the Authorization: Bearer <token> header for cart routes.

🛠️ Common Issues & Fixes
❌ npm start fails

Ensure you are inside shoppyglobe folder.

Delete node_modules + package-lock.json, then reinstall:

rm -rf node_modules package-lock.json
npm install

❌ MongooseServerSelectionError: connect ECONNREFUSED

MongoDB service not running. Start with:

net start MongoDB


Or use:

mongosh --eval "db.adminCommand({ ping: 1 })"

❌ Products not visible in frontend

Check if products exist:

use shoppyglobe
db.products.count()


If 0 → run npm run seed.

Open browser DevTools → Network → check /api/products.

If 401 Unauthorized → login again, ensure token is in localStorage.

If response has data but UI is empty → refresh or clear localStorage:

localStorage.removeItem('token')


Restart server after seeding:

npm start

❌ Port already in use (EADDRINUSE: 3000)

Kill the process:

netstat -ano | findstr :3000
taskkill /PID <id> /F


Or change .env → PORT=3001.

❌ Login works but cart APIs fail

Ensure you send Authorization: Bearer <token> header in requests.

Re-login if token expired.

📸 Assignment Checklist (per PDF)

 Node + Express API routes

 MongoDB integration + seeding

 Error handling + validation

 JWT authentication + protected cart routes

 Testing via ThunderClient

 Screenshots of DB & API responses

 README + documentation

📂 Project Structure
shoppyglobe/
│── server.js
│── package.json
│── .env
│── models/
│   ├── Product.js
│   ├── User.js
│   └── CartItem.js
│── routes/
│   ├── productRoutes.js
│   ├── authRoutes.js
│   └── cartRoutes.js
│── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
│── seed/
│   ├── products.json
│   └── seed.js
│── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js