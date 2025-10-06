const express = require("express");
const router = express.Router();

const Poll = require("../models/Poll");
const Option = require("../models/Options");
const Vote = require("../models/Vote");

// Helper: include options when מחזירים polls
const includeOptions = [{ model: Option, as: "options" }];

// GET /api/polls - כל הסקרים עם אופציות
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: includeOptions,
      order: [["createdAt", "DESC"]],
    });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/polls - יצירת סקר חדש
// body: { title, username, options: ['A','B', ...] }
router.post("/", async (req, res) => {
  try {
    const { title, username, options } = req.body;
    if (!title || !username || !Array.isArray(options))
      return res.status(400).json({ error: "Missing data" });
    if (options.length < 2 || options.length > 8)
      return res.status(400).json({ error: "Options must be 2-8" });

    const poll = await Poll.create({ title, username });
    const optionInstances = await Promise.all(
      options.map((text) => Option.create({ text, PollId: poll.id }))
    );

    const pollWithOptions = await Poll.findByPk(poll.id, {
      include: includeOptions,
    });
    res.status(201).json(pollWithOptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/polls/:id - פרטי סקר כולל אחוזים וסך הצבעות
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findByPk(req.params.id, {
      include: includeOptions,
    });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);
    const options = poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      votes: o.votes,
      percent: totalVotes ? Math.round((o.votes / totalVotes) * 100) : 0,
    }));

    res.json({
      id: poll.id,
      title: poll.title,
      username: poll.username,
      totalVotes,
      options,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/polls/:id/options - הוספת אופציה לסקר קיים
router.post("/:id/options", async (req, res) => {
  try {
    const { text } = req.body;
    const poll = await Poll.findByPk(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const count = await Option.count({ where: { PollId: poll.id } });
    if (count >= 8)
      return res.status(400).json({ error: "Max options reached" });

    const option = await Option.create({ text, PollId: poll.id });
    res.status(201).json(option);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/polls/:id/vote - הצבעה
// body: { username, optionId }
router.post("/:id/vote", async (req, res) => {
  try {
    const { username, optionId } = req.body;
    console.log("🗳️ Vote received:", req.body); //check
    const pollId = req.params.id;
    if (!username || !optionId)
      return res.status(400).json({ error: "Missing username or optionId" });

    const poll = await Poll.findByPk(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // בדוק האם המשתמש כבר הצביע על סקר זה
    const existingVote = await Vote.findOne({
      where: { username, PollId: pollId },
    });
    if (existingVote)
      return res.status(400).json({ error: "User already voted on this poll" });

    // בדוק שהאופציה שייכת לסקר
    const option = await Option.findOne({
      where: { id: optionId, PollId: pollId },
    });
    if (!option)
      return res
        .status(400)
        .json({ error: "Option not found or not part of poll" });

    // צור שורת הצבעה ועדכן מונה
    await Vote.create({ username, PollId: pollId, OptionId: optionId });
    option.votes = (option.votes || 0) + 1;
    await option.save();

    const updatedPoll = await Poll.findByPk(req.params.id, {
      include: [{ model: Option, as: "options" }],
    });

    // 🧾 הצג בלוג איך זה נראה:
    console.log("✅ Updated Poll:", updatedPoll.toJSON());

    // החזר ל־frontend
    res.json(updatedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
