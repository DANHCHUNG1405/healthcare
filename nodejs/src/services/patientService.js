import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { generateOTP, saveOTP } from "./otpService"; // file mới bạn sẽ tạo
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
          // Kiểm tra lịch chưa khám
          let existingBooking = await db.Booking.findOne({
            where: {
              patientId: user[0].id,
              doctorId: data.doctorId,
              statusId: ["S1", "S2"],
            },
          });

          if (existingBooking) {
            resolve({
              errCode: 2,
              errMessage:
                "Bạn đã có lịch hẹn với bác sĩ này chưa khám. Vui lòng chờ hoàn tất trước khi đặt lịch mới.",
            });
          } else {
            await db.Booking.create({
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            });

            let timeString = "";
            let timeTypeData = await db.Allcode.findOne({
              where: { keyMap: data.timeType, type: "TIME" },
            });
            if (timeTypeData) {
              let dateFormatted = moment(data.date).format("dddd - DD/MM/YYYY"); // Hoặc bạn tùy chỉnh theo yêu cầu
              timeString = `${timeTypeData.valueVi} - ${dateFormatted}`;
            }

            await emailService.sendSimpleEmail({
              receiverEmail: data.email,
              patientName: data.fullName,
              time: timeString,
              doctorName: data.doctorName,
              language: data.language,
              redirectLink: buildUrlEmail(data.doctorId, token),
            });
          }
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
let getBookingHistoryByEmail = async (email) => {
  try {
    if (!email) {
      return {
        errCode: 1,
        errMessage: "Missing email parameter!",
      };
    }

    let user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return {
        errCode: 2,
        errMessage: "User not found!",
      };
    }

    let bookings = await db.Booking.findAll({
      where: { patientId: String(user.id) },
      include: [
        {
          model: db.User,
          as: "doctorData",
          attributes: ["firstName", "lastName"],
        },
        {
          model: db.Allcode,
          as: "timeTypeDataPatient",
          attributes: ["valueVi", "valueEn"],
        },
        {
          model: db.History,
          as: "remedyData", // alias này tùy bạn định nghĩa trong association
          attributes: ["diagnosis", "prescription"],
          required: false,
        },
      ],
      order: [["date", "DESC"]],
      raw: false,
    });

    return {
      errCode: 0,
      data: bookings,
    };
  } catch (e) {
    console.error("Error in getBookingHistoryByEmail:", e);
    return {
      errCode: -1,
      errMessage: "Server error",
    };
  }
};
let sendOTPToEmail = async (email) => {
  if (!email) {
    return {
      errCode: 1,
      errMessage: "Missing email!",
    };
  }

  try {
    const otp = generateOTP(); // sinh mã OTP ngẫu nhiên
    await saveOTP(email, otp); // lưu vào DB

    // Gửi email
    await emailService.sendOtpEmail({
      receiverEmail: email,
      subject: "Xác minh OTP truy xuất lịch sử đặt lịch",
      otp: otp,
    });

    return {
      errCode: 0,
      message: "OTP sent successfully",
    };
  } catch (err) {
    console.error("Error sending OTP:", err);
    return {
      errCode: -1,
      errMessage: "Failed to send OTP",
    };
  }
};
let verifyOTP = async (email, otp) => {
  if (!email || !otp) {
    return {
      errCode: 1,
      errMessage: "Missing input!",
    };
  }

  try {
    const record = await db.OtpVerification.findOne({
      where: { email, otp },
      order: [["createdAt", "DESC"]],
    });

    if (!record) {
      return { errCode: 2, errMessage: "OTP không đúng" };
    }

    const createdAt = moment(record.createdAt);
    const now = moment();

    if (now.diff(createdAt, "minutes") > 5) {
      return { errCode: 3, errMessage: "OTP đã hết hạn" };
    }

    return {
      errCode: 0,
      message: "OTP verified",
    };
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return {
      errCode: -1,
      errMessage: "Server error during OTP verification",
    };
  }
};
module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
  getBookingHistoryByEmail,
  sendOTPToEmail,
  verifyOTP,
};
