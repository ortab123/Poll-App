const Poll = require("../models/Poll");
const Options = require("../models/Options");
const Vote = require("../models/Vote");

// יצירת סקר חדש
exports.createPoll = async (req, res) => {
  try {
    const { title, username, options } = req.body;
    if (!title || !username || !Array.isArray(options))
      return res.status(400).json({ error: "Missing data" });
    if (options.length < 2 || options.length > 8)
      return res
        .status(400)
        .json({ error: "A survey can contain a maximum of 8 options." });

    const poll = await Poll.create({ title, username });

    await Promise.all(
      options.map((text, idx) =>
        Options.create({
          text,
          PollId: poll.id,
          optionNumber: idx + 1,
          votes: 0,
        })
      )
    );

    const pollWithOptions = await Poll.findByPk(poll.id, {
      include: [{ model: Options, as: "options" }],
    });

    res.status(201).json(pollWithOptions);
  } catch (err) {
    console.error("❌ Create Poll Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// קבלת כל הסקרים
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [{ model: Options, as: "options" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// קבלת סקר לפי ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: [{ model: Options, as: "options" }],
    });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ הצבעה לסקר
exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { username, optionId, replace } = req.body;

    if (!username || !optionId)
      return res.status(400).json({ error: "Missing username or optionId" });

    const poll = await Poll.findByPk(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const option = await Options.findOne({
      where: { id: optionId, PollId: pollId },
    });
    if (!option)
      return res
        .status(400)
        .json({ error: "Option not found or not part of poll" });

    const existingVote = await Vote.findOne({
      where: { username, PollId: pollId },
    });

    if (existingVote) {
      if (existingVote.OptionId === optionId)
        return res
          .status(400)
          .json({ error: "User already voted for this option" });

      if (!replace)
        return res
          .status(400)
          .json({ error: "User already voted", needsReplace: true });

      // החלפת הצבעה
      const oldOption = await Options.findByPk(existingVote.OptionId);
      if (oldOption) {
        oldOption.votes = Math.max(0, (oldOption.votes || 0) - 1);
        await oldOption.save();
      }

      existingVote.OptionId = optionId;
      await existingVote.save();

      option.votes = (option.votes || 0) + 1;
      await option.save();
    } else {
      await Vote.create({ username, PollId: pollId, OptionId: optionId });
      option.votes = (option.votes || 0) + 1;
      await option.save();
    }

    const updatedPoll = await Poll.findByPk(pollId, {
      include: [{ model: Options, as: "options" }],
    });

    res.json(updatedPoll);
  } catch (err) {
    console.error("❌ Vote Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
