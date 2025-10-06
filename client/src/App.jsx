import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PollList from "./Pages/PollList";
import PollDetail from "./Pages/PollDetail";
import CreatePoll from "./Pages/CreatePoll";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <nav className="bg-white shadow-lg border-b border-purple-100">
          <div className="container mx-auto px-6 py-4">
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
                <Link
                  to="/create"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
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
