"use strict";
require("dotenv").config();
import nodemailer from "nodemailer";
import { encode } from "html-entities";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"HealthCare 👻" <${process.env.EMAIL_APP}>`,
    to: dataSend.receiverEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let { patientName, time, doctorName } = dataSend;
  patientName = encode(patientName);
  time = encode(time);
  doctorName = encode(doctorName);

  let result = "";
  if (dataSend.language === "vi") {
    result = `
      <h3>Xin chào ${patientName}</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên HealthCare</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <div><b>Thời gian: ${time}</b></div>
      <div><b>Bác sĩ: ${doctorName}</b></div>

      <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận
      và hoàn tất thủ tục đặt lịch khám bệnh.</p>
      <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
      </div>

      <div>Xin chân thành cảm ơn!</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
      <h3>Dear ${patientName}</h3>
      <p>You received this email because you booked an online medical appointment on HealthCare</p>
      <p>Information to book a medical appointment:</p>
      <div><b>Time: ${time}</b></div>
      <div><b>Doctor: ${doctorName}</b></div>

      <p>If the above information is true, please click on the link below to confirm and complete the procedure to book an appointment.</p>
      <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
      </div>

      <div>Sincerely thank!</div>
    `;
  }
  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let { patientName, diagnosis, medications } = dataSend;
  patientName = encode(patientName);
  diagnosis = encode(diagnosis || "");

  let meds = [];
  try {
    meds = JSON.parse(medications || "[]");
  } catch (e) {
    meds = [];
  }

  let medicationsHtml = meds
    .map((med) => {
      const name = encode(med.name || "");
      const dose = encode(med.dose || "");
      const frequency = encode(med.frequency || "");
      const note = encode(med.note || "");

      return `
        <li>
          <strong>${name}</strong><br/>
          <em>Liều dùng:</em> ${dose}<br/>
          <em>Số lần/ngày:</em> ${frequency}<br/>
          <em>Ghi chú:</em> ${note}
        </li>
      `;
    })
    .join("");

  let result = "";
  if (dataSend.language === "vi") {
    result = `
      <h3>Xin chào ${patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên HealthCare</p>
      <p><b>Chẩn đoán:</b> ${diagnosis}</p>
      <p><b>Đơn thuốc:</b></p>
      <ul>${medicationsHtml}</ul>
      <div>Xin chân thành cảm ơn!</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
      <h3>Dear ${patientName}!</h3>
      <p>You received this email because you booked an online medical appointment on HealthCare</p>
      <p><b>Diagnosis:</b> ${diagnosis}</p>
      <p><b>Medications:</b></p>
      <ul>${medicationsHtml}</ul>
      <div>Sincerely thank!</div>
    `;
  }
  return result;
};

let sendAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"HealthCare 👻" <${process.env.EMAIL_APP}>`,
    to: dataSend.email,
    subject: "Kết quả đặt lịch khám bệnh",
    html: getBodyHTMLEmailRemedy(dataSend),
  });
};

let getBodyHTMLEmailConfirm = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
      <h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên HealthCare</p>
      <p>Bạn vui lòng click vào đường link bên dưới để xác nhận email và tiếp tục thủ tục đang ký</p>
      <a href=${dataSend.redirectLink} target="_blank">Xác nhận địa chỉ email</a>
      <div>Xin chân thành cảm ơn!</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
      <h3>Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked an online medical appointment on HealthCare</p>
      <p>Please click on the link below to verify your email and continue the registration process.</p>
      <a href=${dataSend.redirectLink} target="_blank">Verify email</a>
      <div>Sincerely thank!</div>
    `;
  }
  return result;
};

let getBodyHTMLEmailOtp = (dataSend) => {
  let otp = encode(dataSend.otp);
  let patientName = encode(dataSend.patientName || "");

  let result = `
    <h3>Xin chào ${patientName || "bạn"}!</h3>
    <p>Bạn nhận được mã xác thực OTP từ hệ thống HealthCare.</p>
    <p><strong>Mã OTP của bạn là:</strong></p>
    <div style="font-size: 24px; font-weight: bold; color: #1a73e8;">${otp}</div>
    <p>Mã OTP có hiệu lực trong vòng 5 phút.</p>
    <div>Xin chân thành cảm ơn!</div>
  `;
  return result;
};

let sendOtpEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let html = dataSend.htmlContent || getBodyHTMLEmailOtp(dataSend);
  let info = await transporter.sendMail({
    from: `"HealthCare OTP 👻" <${process.env.EMAIL_APP}>`,
    to: dataSend.receiverEmail,
    subject: dataSend.subject || "Mã xác thực OTP từ HealthCare",
    html: html,
  });
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
  sendOtpEmail,
};
