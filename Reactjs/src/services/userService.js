import axios from "../axios";
import authHeader from "./auth-header";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`, {
    headers: authHeader(),
  });
};

const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data, { headers: authHeader() });
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: { id: userId },
    headers: authHeader(),
  });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData, { headers: authHeader() });
};

const getAllCodeService = (inputData) => {
  return axios.get(`/api/allcode?type=${inputData}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctors = (limit) => {
  return axios.get(`/api/get-all-doctors`, { headers: authHeader() });
};

const saveDetailDoctorService = (data) => {
  return axios.post(`/api/save-infor-doctors`, data, { headers: authHeader() });
};

const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post(`/api/bulk-create-schedule`, data, {
    headers: authHeader(),
  });
};

const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookingAppointment = (data) => {
  return axios.post(`/api/patient-book-appointment`, data);
};

const postVerifyBookAppointment = (data) => {
  return axios.post(`/api/verify-book-appointment`, data);
};

const createNewSpecialty = (data) => {
  return axios.post(`/api/create-new-specialty`, data, {
    headers: authHeader(),
  });
};

const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};
const getDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
const createNewClinic = (data) => {
  return axios.post(`/api/create-new-clinic`, data, { headers: authHeader() });
};
const getAllClinic = () => {
  return axios.get(`/api/get-clinic`);
};
const getDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};
const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`,
    { headers: authHeader() }
  );
};
const postSendRemedy = (data) => {
  console.log("Data gửi lên server:", data);
  return axios.post(`/api/send-remedy`, data, { headers: authHeader() });
};
const getDoctorInfoById = (data) => {
  return axios.get(`/api/get-doctor-info-by-id?doctorId=${data.doctorId}`, {
    headers: authHeader(),
  });
};
// const getDetailBillByToken = (data) => {
//   return axios.get(`/api/get-detail-bill?token=${data.token}`);
// };
// const getContractAbi = () => {
//   return axios.get(`/api/contract/abi`);
// };
// const transfer = (data) => {
//   return axios.post(`/api/transfer`, data);
// };
// const initBill = (data) => {
//   return axios.post(`/api/init-bill`, data);
// };
// const verifyPayment = (data) => {
//   return axios.post(`/api/verify-payment`, data);
// };
const getBookingHistoryByEmail = (email) => {
  return axios.get(`/api/patient/history?email=${email}`);
};
const sendOtpToEmail = (email) => {
  return axios.post(`/api/send-otp`, { email });
};

const verifyOtpCode = (email, otp) => {
  return axios.post(`/api/verify-otp`, { email, otp });
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookingAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  getDoctorInfoById,
  // getDetailBillByToken,
  // getContractAbi,
  // transfer,
  // initBill,
  // verifyPayment,
  getBookingHistoryByEmail,
  sendOtpToEmail,
  verifyOtpCode,
};
