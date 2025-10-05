import React, { useState } from "react";

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) =>
    setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !username || options.some((o) => !o.trim())) {
      alert("Please fill all fields!");
      return;
    }

    const pollData = { title, username, options };

    const res = await fetch("http://localhost:5000/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollData),
    });

    const data = await res.json();
    alert("Poll created successfully!");
    console.log(data);
    setTitle("");
    setUsername("");
    setOptions(["", ""]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Create a New Poll
        </h2>

        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="font-semibold mb-2">Options:</h3>
        {options.map((opt, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="text-blue-600 hover:underline mb-4"
        >
          + Add Option
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
