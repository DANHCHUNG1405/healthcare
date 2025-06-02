import historyService from "../services/historyService";

let sendRemedyToHistory = async (req, res) => {
  try {
    let result = await historyService.saveRemedy(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in sendRemedyToHistory:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

let getRemedyHistoryByEmail = async (req, res) => {
  try {
    let email = req.query.email;
    let result = await historyService.getRemedyHistoryByEmail(email);
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error in getRemedyHistoryByEmail:", e);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

module.exports = {
  sendRemedyToHistory,
  getRemedyHistoryByEmail,
};
