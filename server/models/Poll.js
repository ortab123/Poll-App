const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Poll = sequelize.define("Poll", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Poll;
