import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PollList from "./Pages/PollList";
import PollDetail from "./Pages/PollDetail";
import CreatePoll from "./Pages/CreatePoll";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-indigo-600">Poll App</h1>
              <div className="flex gap-4 text-sm">
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                >
                  📊 All Polls
                </Link>
                <Link
                  to="/create"
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium shadow-md"
                >
                  ➕ Create Poll
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/poll/:id" element={<PollDetail />} />
            <Route path="/create" element={<CreatePoll />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
