# ⚙️ Poll App - Server

This is the **backend** of the Poll App — a Node.js + Express server that provides authentication, poll creation, voting, and user management.

---

## 🚀 Features

- User registration & login with hashed passwords (bcrypt)
- JWT-based authentication
- Create, read, and delete polls
- Submit and update votes
- Prevent double voting (each user can vote once per poll)
- Change vote option if desired
- MongoDB data persistence via Mongoose
- Secure routes (JWT protected endpoints)
- CORS enabled for the React frontend

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **bcryptjs** for password hashing
- **jsonwebtoken** for auth
- **dotenv** for environment variables
- **cors** for frontend communication

---

## ⚙️ Installation

```bash
1. Navigate to the server folder:
cd server
2. Install dependencies:
bash
Copy code
npm install
3. Create a .env file:
Add the following variables:


Copy code
PORT=5000
MONGO_URI=mongodb+srv://<your_cluster>/<db_name>
JWT_SECRET=your_jwt_secret
4. Run the server:

Copy code
npm run dev
Server runs by default at:

http://localhost:5000
```

### 🧩 Folder Structure

```
Copy code
server/
├── src/
│   ├── controllers/         # Auth and Poll logic
│   ├── middleware/          # Auth middleware (JWT)
│   ├── models/              # User and Poll schemas
│   ├── routes/              # API endpoints
│   └── index.js             # Entry point
│   └── db.js                # SQL connection
├── package.json
└── .env

🔗 API Endpoints
🔐 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login existing user

🗳️ Poll Routes
Method	Endpoint	Description
GET	/api/polls	Get all polls
GET	/api/polls/:id	Get poll by ID
POST	/api/polls	Create new poll (auth required)
POST	/api/polls/:id/vote	Vote / change vote (auth required)
```
