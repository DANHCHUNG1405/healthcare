import db from "../models";

let saveRemedy = async (data) => {
  try {
    const { email, patientName, diagnosis, prescription, bookingId } = data;

    if (!email || !diagnosis || !prescription || !bookingId) {
      return { errCode: 1, errMessage: "Missing required fields" };
    }

    await db.History.create({
      email,
      patientName,
      diagnosis,
      prescription,
      bookingId,
    });

    return { errCode: 0, message: "Remedy saved successfully" };
  } catch (err) {
    console.error("Error in saveRemedy:", err);
    return { errCode: -1, errMessage: "Database error" };
  }
};

let getRemedyHistoryByEmail = async (email) => {
  try {
    if (!email) {
      return { errCode: 1, errMessage: "Missing email" };
    }

    let records = await db.History.findAll({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    return { errCode: 0, data: records };
  } catch (err) {
    console.error("Error in getRemedyHistoryByEmail:", err);
    return { errCode: -1, errMessage: "Database error" };
  }
};

export default {
  saveRemedy,
  getRemedyHistoryByEmail,
};
