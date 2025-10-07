import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import PollList from "./Pages/PollList";
import PollDetail from "./Pages/PollDetail";
import CreatePoll from "./Pages/CreatePoll";
import Auth from "./Pages/Auth";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/auth?mode=login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* 🔹 Navbar */}
      <nav className="bg-white shadow-lg border-b border-purple-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Links */}
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Poll App
              </h1>

              <div className="flex gap-4 text-sm">
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  📊 All Polls
                </Link>

                {/* Show Create Poll only if logged in */}
                {token && (
                  <Link
                    to="/create"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    ➕ Create Poll
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Auth buttons */}
            {token ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Hi, <span className="text-purple-600">{email}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/auth?mode=register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔹 Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id" element={<PollDetail />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePoll />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
