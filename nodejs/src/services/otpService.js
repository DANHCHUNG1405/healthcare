import db from "../models";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // mã 6 chữ số
};

export const saveOTP = async (email, otp) => {
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // hết hạn sau 5 phút
  return await db.OtpVerification.create({
    email,
    otp,
    expiredAt,
  });
};
