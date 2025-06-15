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
        statusId: "S1", // chưa xác nhận
      },
      raw: false,
    });

    if (!appointment) {
      return {
        errCode: 2,
        errMessage: "Appointment has been activated or does not exist",
      };
    }

    const schedule = await db.Schedule.findOne({
      where: {
        doctorId: appointment.doctorId,
        date: appointment.date,
        timeType: appointment.timeType,
      },
      raw: false,
    });

    if (!schedule) {
      return {
        errCode: 3,
        errMessage: "Schedule not found",
      };
    }

    if (schedule.currentNumber >= schedule.maxNumber) {
      return {
        errCode: 4,
        errMessage: "This time slot is fully booked",
      };
    }

    // Xác nhận booking
    appointment.statusId = "S2";
    await appointment.save();

    // Tăng currentNumber
    schedule.currentNumber += 1;
    await schedule.save();

    return {
      errCode: 0,
      errMessage: "Verify booking success!",
    };
  } catch (error) {
    console.error("Error in postVerifyBookAppointment:", error);
    return {
      errCode: -1,
      errMessage: "Server error",
    };
  }
};

let getBookingHistoryByEmail = async (email) => {
  try {
    if (!email) {
      return {
        errCode: 1,
        errMessage: "Thiếu email!",
      };
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return {
        errCode: 2,
        errMessage: "Không tìm thấy người dùng!",
      };
    }

    const bookings = await db.Booking.findAll({
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
          as: "remedyData",
          attributes: ["diagnosis", "medications"],
          required: false,
        },
      ],
      order: [["date", "DESC"]],
      raw: false,
      nest: true,
    });

    // ✅ Parse medications an toàn
    const parsedBookings = bookings.map((booking) => {
      if (
        booking?.remedyData &&
        typeof booking.remedyData.medications === "string"
      ) {
        try {
          booking.remedyData.medications = JSON.parse(
            booking.remedyData.medications
          );
        } catch (e) {
          console.warn(
            `⚠️ Lỗi parse medications tại booking ID ${booking.id}:`,
            e
          );
          booking.remedyData.medications = [];
        }
      } else if (
        booking?.remedyData &&
        !Array.isArray(booking.remedyData.medications)
      ) {
        booking.remedyData.medications = [];
      }
      return booking;
    });

    return {
      errCode: 0,
      data: parsedBookings,
    };
  } catch (error) {
    console.error("🔥 Lỗi trong getBookingHistoryByEmail:", error);
    return {
      errCode: -1,
      errMessage: "Lỗi server nội bộ!",
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
let cancelBooking = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.bookingId || !data.email) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      }

      // Tìm booking
      let booking = await db.Booking.findOne({
        where: { id: data.bookingId },
        raw: false,
      });

      if (!booking) {
        return resolve({
          errCode: 2,
          errMessage: "Booking not found.",
        });
      }

      // Xác minh đúng email của người đặt
      let user = await db.User.findOne({
        where: { id: booking.patientId, email: data.email },
        attributes: ["id", "email"],
        raw: false,
      });

      if (!user) {
        return resolve({
          errCode: 3,
          errMessage: "Access denied: email does not match.",
        });
      }

      // Tìm lịch khám liên quan
      let schedule = await db.Schedule.findOne({
        where: {
          doctorId: booking.doctorId,
          date: booking.date,
          timeType: booking.timeType,
        },
        raw: false, // cần để gọi được save()
      });

      // Giảm số lượng đặt nếu còn > 0
      if (schedule && schedule.currentNumber > 0) {
        schedule.currentNumber -= 1;
        await schedule.save();
      }

      // ❗ Cập nhật trạng thái của lịch khám thành S4 (đã hủy)
      booking.statusId = "S4";
      await booking.save();

      resolve({
        errCode: 0,
        errMessage: "Booking has been cancelled and schedule restored.",
      });
    } catch (error) {
      console.error("cancelBooking error:", error);
      reject(error);
    }
  });
};

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
  getBookingHistoryByEmail,
  sendOTPToEmail,
  verifyOTP,
  cancelBooking,
};
