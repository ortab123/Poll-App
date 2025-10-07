const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");

// routes
router.post("/", pollController.createPoll);
router.get("/", pollController.getAllPolls);
router.get("/:id", pollController.getPollById);
router.post("/:id/vote", pollController.votePoll); // ✅ route חסר

module.exports = router;
