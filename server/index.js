const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

// Models
const Poll = require("./models/Poll");
const Option = require("./models/Options");
const Vote = require("./models/Vote");
const User = require("./models/User");

// Associations
Poll.hasMany(Option, { as: "options", onDelete: "CASCADE" });
Option.belongsTo(Poll);

Poll.hasMany(Vote, { as: "votes", onDelete: "CASCADE" });
Vote.belongsTo(Poll);

Option.hasMany(Vote, { as: "optionVotes", onDelete: "CASCADE" });
Vote.belongsTo(Option);

User.hasMany(Vote, { as: "userVotes", onDelete: "CASCADE" });
Vote.belongsTo(User);

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route בסיסי לבדיקה
app.get("/", (req, res) => {
  res.send("Poll-App Backend Running");
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// סנכרון Database ויצירת טבלאות
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Error syncing database:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
