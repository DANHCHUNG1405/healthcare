import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
  saveRemedy,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { FormattedMessage } from "react-intl";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = moment(currentDate).format("YYYY-MM-DD");

    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });

    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  handleOnchangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      bookingId: item.id,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;

    this.setState({ isShowLoading: true });

    // Dữ liệu chung
    const payload = {
      email: dataChild.email,
      medications: dataChild.medications,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
      diagnosis: dataChild.diagnosis,
      bookingId: dataModal.bookingId,
    };

    try {
      // 📨 Gửi email
      let emailRes = await postSendRemedy(payload);

      if (emailRes && emailRes.errCode === 0) {
        // 💾 Lưu DB sau khi gửi email thành công
        let dbRes = await saveRemedy(payload);

        if (dbRes && dbRes.errCode === 0) {
          toast.success("Gửi và lưu đơn thuốc thành công!");
          this.setState({ isShowLoading: false });
          this.closeRemedyModal();
          await this.getDataPatient();
        } else {
          toast.error("Gửi email thành công nhưng lưu vào database thất bại.");
          this.setState({ isShowLoading: false });
        }
      } else {
        toast.error("Gửi email thất bại.");
        this.setState({ isShowLoading: false });
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi hoặc lưu:", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;

    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner
        text="Loading..."
      >
        <div className="manage-patient-container">
          <div className="m-p-title">
            <FormattedMessage id="doctor.manage-patient.title" />
          </div>
          <div className="manage-patient-body row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="doctor.manage-patient.select-date" />
              </label>
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
              />
            </div>
            <div className="col-12">
              <table className="table-manage-patient" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.number" />
                    </th>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.appointment" />
                    </th>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.fullname" />
                    </th>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.address" />
                    </th>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.gender" />
                    </th>
                    <th>
                      <FormattedMessage id="doctor.manage-patient.action" />
                    </th>
                  </tr>
                  {dataPatient && dataPatient.length > 0 ? (
                    dataPatient.map((item, index) => {
                      let time =
                        language === LANGUAGES.VI
                          ? item.timeTypeDataPatient.valueVi
                          : item.timeTypeDataPatient.valueEn;
                      let gender =
                        language === LANGUAGES.VI
                          ? item.patientData.genderData.valueVi
                          : item.patientData.genderData.valueEn;

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{time}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>
                            <button
                              className="mp-btn-confirm"
                              onClick={() => this.handleBtnConfirm(item)}
                            >
                              <FormattedMessage id="doctor.manage-patient.confirm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        <FormattedMessage id="doctor.manage-patient.nodata" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
          sendRemedy={this.sendRemedy}
        />
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(ManagePatient);
