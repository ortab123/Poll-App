const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Option = sequelize.define("Option", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Option;
