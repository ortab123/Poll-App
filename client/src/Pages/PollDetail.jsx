// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// function PollDetail() {
//   const { id } = useParams();
//   const [poll, setPoll] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [userVote, setUserVote] = useState(null);

//   const token = localStorage.getItem("token");
//   const email = localStorage.getItem("email");

//   useEffect(() => {
//     const fetchPoll = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/polls/${id}`, {
//           headers: token ? { Authorization: "Bearer " + token } : {},
//         });
//         const data = await res.json();
//         setPoll(data);
//         // אם השרת החזיר userVote (optionId) זה אומר שהמשתמש כבר הצביע
//         if (data.userVote) {
//           setHasVoted(true);
//           setUserVote(data.userVote);
//         } else {
//           setHasVoted(false);
//           setUserVote(null);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchPoll();
//   }, [id, token]);

//   const handleVote = async () => {
//     if (!selectedOption) {
//       alert("Please select an option first!");
//       return;
//     }

//     // אם המשתמש כבר הצביע ורוצה לשנות — בקש אישור
//     if (hasVoted && userVote && userVote !== selectedOption) {
//       const ok = window.confirm(
//         "Are you sure you want to change your selection?"
//       );
//       if (!ok) return; // לא שינה
//     }

//     try {
//       const body = { optionId: selectedOption, username: email };
//       // אם המשתמש כבר הצביע ונבחרה אופציה חדשה — שלח replace:true
//       if (hasVoted && userVote && userVote !== selectedOption) {
//         body.replace = true;
//       }

//       const res = await fetch(`http://localhost:5000/api/polls/${id}/vote`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: "Bearer " + token } : {}),
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         // אם השרת חזר needsReplace:true (משתמש כבר הצביע) נתן הודעה ידידותית
//         if (data && data.needsReplace) {
//           const ok = window.confirm(
//             "You already voted on this poll. Do you want to change your vote?"
//           );
//           if (ok) {
//             // שלח שוב עם replace:true
//             const res2 = await fetch(
//               `http://localhost:5000/api/polls/${id}/vote`,
//               {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   ...(token ? { Authorization: "Bearer " + token } : {}),
//                 },
//                 body: JSON.stringify({
//                   optionId: selectedOption,
//                   username: email,
//                   replace: true,
//                 }),
//               }
//             );
//             const data2 = await res2.json();
//             if (!res2.ok) {
//               alert(data2.error || "Vote failed");
//               return;
//             }
//             setPoll(data2);
//             setHasVoted(true);
//             setUserVote(selectedOption);
//             return;
//           } else {
//             return;
//           }
//         }
//         alert(data.error || "Vote failed");
//         return;
//       }

//       // הצלחה — שרת מחזיר poll מעודכן
//       setPoll(data);
//       setHasVoted(true);
//       setUserVote(selectedOption);
//     } catch (err) {
//       console.error("Vote error:", err);
//       alert("Error submitting vote: " + (err.message || ""));
//     }
//   };

//   if (!poll) {
//     return (
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//           <div className="animate-spin text-4xl mb-4">⏳</div>
//           <p className="text-xl text-gray-500">Loading poll...</p>
//         </div>
//       </div>
//     );
//   }

//   const totalVotes =
//     poll?.options?.reduce((s, o) => s + (o.votes || 0), 0) || 0;

//   return (
//     <div className="max-w-2xl mx-auto">
//       <Link
//         to="/"
//         className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
//       >
//         ← Back to all polls
//       </Link>

//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">{poll.title}</h1>

//         {!hasVoted ? (
//           <div className="space-y-3 mb-6">
//             {poll.options.map((option) => (
//               <label
//                 key={option.id}
//                 className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                   selectedOption === option.id
//                     ? "border-indigo-500 bg-indigo-50"
//                     : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="option"
//                   value={option.id}
//                   checked={selectedOption === option.id}
//                   onChange={() => setSelectedOption(option.id)}
//                   className="w-5 h-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <span className="text-lg font-medium text-gray-800">
//                   {option.text}
//                 </span>
//               </label>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4 mb-6">
//             <p className="text-sm font-semibold text-gray-600 mb-4">
//               Results ({totalVotes} {totalVotes === 1 ? "vote" : "votes"})
//             </p>

//             {poll.options.map((option) => {
//               const votes = option.votes || 0;
//               const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
//               const pctStr = pct.toFixed(1);
//               return (
//                 <div key={option.id} className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="font-medium text-gray-700">
//                       {option.text}
//                     </span>
//                     <span className="text-gray-500">
//                       {votes} {votes === 1 ? "vote" : "votes"} ({pctStr}%)
//                     </span>
//                   </div>
//                   <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {!hasVoted ? (
//           <button
//             onClick={handleVote}
//             disabled={!selectedOption}
//             className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
//               selectedOption
//                 ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {selectedOption ? "Submit Vote" : "Select an option to vote"}
//           </button>
//         ) : (
//           <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
//             <p className="text-green-700 font-semibold">
//               ✓ Thank you for voting!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PollDetail;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/polls/${id}`)
      .then((res) => res.json())
      .then((data) => setPoll(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleVote = () => {
    if (!selectedOption) return;

    const username = localStorage.getItem("email") || "Anonymous";

    fetch(`http://localhost:5000/api/polls/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: selectedOption, username }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPoll(data);
        setHasVoted(true);
      })
      .catch((err) => console.error(err));
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    const pollUrl = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(pollUrl);
    alert("Poll link copied to clipboard!");
    setShowShareModal(false);
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

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  );
  const pollUrl = `${window.location.origin}/poll/${id}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to all polls
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-md"
        >
          🔗 Share Poll
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{poll.title}</h1>

        {!hasVoted ? (
          <div className="space-y-3 mb-6">
            {poll.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-500"
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
            {poll.options.map((option) => {
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
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
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
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg"
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Share this Poll
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Poll Link:</p>
              <p className="text-purple-600 font-mono text-sm break-all">
                {pollUrl}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollDetail;
