const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Vote = sequelize.define("Vote", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vote;
