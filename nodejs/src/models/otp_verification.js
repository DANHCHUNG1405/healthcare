"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OtpVerification extends Model {
    static associate(models) {
      // Chưa cần liên kết với bảng nào khác, nhưng bạn có thể thêm ở đây nếu cần
    }
  }

  OtpVerification.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "OtpVerification",
      tableName: "otp_verifications", // Bắt buộc nếu không muốn Sequelize tự đổi sang số nhiều kiểu khác
    }
  );

  return OtpVerification;
};
