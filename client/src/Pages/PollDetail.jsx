import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const username = "Or";

  useEffect(() => {
    fetch(`http://localhost:5000/api/polls/${id}`)
      .then((res) => res.json())
      .then((data) => setPoll(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    console.log("Submitting vote:", { username, selectedOption }); //check

    try {
      const res = await fetch(
        `http://localhost:5000/api/polls/${poll.id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username || "Anonymous",
            optionId: selectedOption,
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Vote failed!");
        return;
      }

      const updatedPoll = await res.json();

      if (!updatedPoll || !updatedPoll.options) {
        console.error("❌ Invalid poll data:", updatedPoll);
        alert("Error: missing poll options!");
        return;
      }

      setPoll(updatedPoll);
      alert("✅ Vote submitted successfully!");
    } catch (err) {
      console.error("❌ Vote error:", err);
      alert(`Error submitting vote: ${err.message}`);
    }
  };

  if (!poll) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-500">Loading poll...</p>
        </div>
      </div>
    );
  }

  const totalVotes =
    poll?.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
      >
        ← Back to all polls
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{poll.title}</h1>

        {!hasVoted ? (
          <div className="space-y-3 mb-6">
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="w-5 h-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-lg font-medium text-gray-800">
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-4">
              Results ({totalVotes} {totalVotes === 1 ? "vote" : "votes"})
            </p>
            {poll?.options?.map((option) => {
              const votes = option.votes || 0;
              const percentage =
                totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;

              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {option.text}
                    </span>
                    <span className="text-gray-500">
                      {votes} {votes === 1 ? "vote" : "votes"} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!hasVoted ? (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedOption
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedOption ? "Submit Vote" : "Select an option to vote"}
          </button>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 font-semibold">
              ✓ Thank you for voting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PollDetail;
