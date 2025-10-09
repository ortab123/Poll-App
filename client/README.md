# 🗳️ Poll App - Client

This is the **client-side** of the Poll App — a full-stack voting platform that allows users to register, log in, create polls, and vote in real-time.

---

## 🚀 Features

- User registration and login with JWT authentication
- Create, view, and vote on polls
- View real-time vote counts
- Change your vote (update an existing vote)
- Responsive and clean UI with React + Vite
- Protected routes (only logged-in users can vote)
- Persistent authentication (localStorage token)
- Logout button replaces login/register when authenticated

---

## 🧰 Tech Stack

- **React** (Vite)
- **React Router DOM**
- **Axios**
- **Context API** for global state management
- **TailwindCSS / Custom CSS**
- **JWT** for authentication (via server)
- **LocalStorage** for user session persistence

---

## ⚙️ Installation

### 1. Navigate to the client folder:

```bash
cd client
2. Install dependencies:
bash
Copy code
npm install
3. Create a .env file:
Add your backend server URL (adjust port if needed):

bash
Copy code
VITE_API_URL=http://localhost:5000
4. Run the development server:
bash
Copy code
npm run dev
5. Access the app:
Open your browser at:

arduino
Copy code
http://localhost:5173
🧩 Folder Structure
csharp
Copy code
client/
├── src/
│   ├── pages/          # Login, Register, PollList, PollDetails
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
└── package.json

🔐 Authentication Flow
User registers or logs in → gets a JWT token from the server.

Token is stored in localStorage.

AuthContext reads token on app load and keeps the user logged in.

Navbar updates dynamically based on isAuthenticated.

On logout → token is removed → user is redirected to login.
```
