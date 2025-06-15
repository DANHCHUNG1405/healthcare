"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Histories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      patientName: {
        type: Sequelize.STRING,
      },
      diagnosis: {
        type: Sequelize.TEXT,
      },
      medications: {
        type: Sequelize.TEXT, // Lưu JSON.stringify(medications)
      },
      bookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Bookings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Histories");
  },
};
