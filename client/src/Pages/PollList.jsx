import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PollList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/polls")
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Polls</h1>
        <p className="text-gray-500">Choose a poll to vote or view results</p>
      </div>

      {polls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-gray-500 mb-4">No polls yet</p>
          <Link
            to="/create"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create the first poll
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <Link
              key={poll.id}
              to={`/poll/${poll.id}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-indigo-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🗳️</div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {poll.title}
                  </h3>
                </div>
                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PollList;
