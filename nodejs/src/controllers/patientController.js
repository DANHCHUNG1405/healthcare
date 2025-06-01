import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let infor = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getBookingHistoryByEmail = async (req, res) => {
  try {
    let email = req.query.email;
    let result = await patientService.getBookingHistoryByEmail(email);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in controller getBookingHistoryByEmail:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};
let sendOTPToEmail = async (req, res) => {
  try {
    let { email } = req.body;
    let result = await patientService.sendOTPToEmail(email);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in sendOTPToEmail:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

let verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    let result = await patientService.verifyOTP(email, otp);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in verifyOTP:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};

module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  getBookingHistoryByEmail: getBookingHistoryByEmail,
  sendOTPToEmail: sendOTPToEmail,
  verifyOTP: verifyOTP,
};
