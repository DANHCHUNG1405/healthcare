"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.Booking, {
        foreignKey: "bookingId",
        as: "bookingData",
      });
    }
  }
  History.init(
    {
      email: DataTypes.STRING,
      patientName: DataTypes.STRING,
      diagnosis: DataTypes.TEXT,
      medications: DataTypes.TEXT, // <-- Dùng để lưu JSON stringify
      bookingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
