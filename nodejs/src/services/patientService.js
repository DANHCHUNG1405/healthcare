import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

const buildUrlEmail = (doctorId, token) => {
  return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });
        let user = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const postVerifyBookAppointment = async (data) => {
  try {
    if (!data.token || !data.doctorId) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter!",
      };
    }

    const appointment = await db.Booking.findOne({
      where: {
        doctorId: data.doctorId,
        token: data.token,
        statusId: "S1",
      },
      raw: false,
    });

    if (appointment) {
      // Cập nhật trạng thái xác nhận lịch khám
      appointment.statusId = "S2";
      await appointment.save();

      return {
        errCode: 0,
        errMessage: "Verify booking success!",
      };
    } else {
      return {
        errCode: 2,
        errMessage: "Appointment has been activated or does not exist",
      };
    }
  } catch (error) {
    console.error("Error in postVerifyBookAppointment:", error);
    return {
      errCode: -1,
      errMessage: "Error from server...",
    };
  }
};

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
};
