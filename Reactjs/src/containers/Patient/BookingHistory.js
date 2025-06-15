import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import HomeHeader from "../HomePage/HomeHeader";
import "./BookingHistory.scss";
import {
  getBookingHistoryByEmail,
  sendOtpToEmail,
  verifyOtpCode,
  cancelBookingById,
} from "../../services/userService";

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: "email",
      email: "",
      otp: "",
      verified: false,
      history: [],
      loading: false,
      errMsg: "",
      showCancelModal: false,
      selectedBookingId: null,
    };
  }
  openCancelModal = (bookingId) => {
    this.setState({
      showCancelModal: true,
      selectedBookingId: bookingId,
    });
  };

  closeCancelModal = () => {
    this.setState({
      showCancelModal: false,
      selectedBookingId: null,
    });
  };

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  sendOtp = async () => {
    const { email } = this.state;
    const { intl } = this.props;

    if (!email) {
      return this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.errorEmailRequired" }),
      });
    }

    this.setState({ loading: true, errMsg: "" });
    try {
      const res = await sendOtpToEmail(email);
      if (res.errCode === 0) {
        this.setState({ step: "otp" });
      } else {
        this.setState({
          errMsg:
            res.message ||
            intl.formatMessage({ id: "bookingHistory.sendOtpError" }),
        });
      }
    } catch (e) {
      this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.sendOtpError" }),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  verifyOtp = async () => {
    const { email, otp } = this.state;
    const { intl } = this.props;

    if (!otp) {
      return this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.errorOtpRequired" }),
      });
    }

    this.setState({ loading: true });
    try {
      const res = await verifyOtpCode(email, otp);
      if (res.errCode === 0) {
        this.setState({ verified: true });
        await this.fetchHistory();
        this.setState({ step: "result" });
      } else {
        this.setState({
          errMsg:
            res.message ||
            intl.formatMessage({ id: "bookingHistory.otpInvalid" }),
        });
      }
    } catch (e) {
      this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.verifyOtpError" }),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchHistory = async () => {
    const { email } = this.state;
    const { intl } = this.props;

    this.setState({ loading: true, history: [] });
    try {
      const res = await getBookingHistoryByEmail(email);
      if (res.errCode === 0) {
        this.setState({ history: res.data });
      } else {
        this.setState({
          errMsg:
            res.errMessage ||
            intl.formatMessage({ id: "bookingHistory.historyFetchError" }),
        });
      }
    } catch (error) {
      this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.historyFetchError" }),
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleCancelBooking = async () => {
    const { selectedBookingId, email } = this.state;
    const { intl } = this.props;

    this.setState({ loading: true, showCancelModal: false });

    try {
      const res = await cancelBookingById({
        bookingId: selectedBookingId,
        email: email,
      });
      if (res.errCode === 0) {
        await this.fetchHistory();
      } else {
        alert(
          res.errMessage ||
            intl.formatMessage({ id: "bookingHistory.cancelFailed" })
        );
      }
    } catch (e) {
      alert(intl.formatMessage({ id: "bookingHistory.cancelError" }));
    } finally {
      this.setState({ loading: false, selectedBookingId: null });
    }
  };

  reset = () => {
    this.setState({
      step: "email",
      email: "",
      otp: "",
      verified: false,
      history: [],
      errMsg: "",
    });
  };

  render() {
    const {
      step,
      email,
      otp,
      errMsg,
      loading,
      history,
      showCancelModal,
      selectedBookingId,
    } = this.state;
    const { intl } = this.props;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="booking-history-container">
          <h2>
            <FormattedMessage id="bookingHistory.title" />
          </h2>
          {errMsg && <p className="error-message">{errMsg}</p>}

          {step === "email" && (
            <>
              <input
                type="email"
                placeholder={intl.formatMessage({
                  id: "bookingHistory.enterEmail",
                })}
                value={email}
                onChange={this.handleChange("email")}
              />
              <button onClick={this.sendOtp} disabled={loading}>
                {loading
                  ? intl.formatMessage({ id: "bookingHistory.sending" })
                  : intl.formatMessage({ id: "bookingHistory.sendOtp" })}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p>
                <FormattedMessage id="bookingHistory.checkEmailOtp" />
              </p>
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "bookingHistory.enterOtp",
                })}
                value={otp}
                onChange={this.handleChange("otp")}
              />
              <button onClick={this.verifyOtp} disabled={loading}>
                {loading
                  ? intl.formatMessage({ id: "bookingHistory.verifying" })
                  : intl.formatMessage({ id: "bookingHistory.verify" })}
              </button>
              <button onClick={this.reset} className="secondary-button">
                <FormattedMessage id="bookingHistory.resendEmail" />
              </button>
            </>
          )}

          {step === "result" && (
            <>
              {loading && (
                <p>
                  <FormattedMessage id="bookingHistory.loadingHistory" />
                </p>
              )}
              {!loading && history.length === 0 && (
                <p>
                  <FormattedMessage id="bookingHistory.noHistory" />
                </p>
              )}

              <div className="booking-list">
                {history.map((item) => (
                  <div key={item.id} className="booking-item">
                    <p>
                      <strong>
                        <FormattedMessage id="bookingHistory.doctor" />:
                      </strong>{" "}
                      {item.doctorData?.lastName} {item.doctorData?.firstName}
                    </p>
                    <p>
                      <strong>
                        <FormattedMessage id="bookingHistory.date" />:
                      </strong>{" "}
                      {item.date}
                    </p>
                    <p>
                      <strong>
                        <FormattedMessage id="bookingHistory.time" />:
                      </strong>{" "}
                      {item.timeTypeDataPatient?.valueVi}
                    </p>
                    <p>
                      <strong>
                        <FormattedMessage id="bookingHistory.status" />:
                      </strong>{" "}
                      {intl.formatMessage({
                        id: `bookingHistory.statusLabels.${item.statusId}`,
                      })}
                    </p>

                    {item.statusId === "S2" && (
                      <button
                        className="secondary-button"
                        onClick={() => this.openCancelModal(item.id)}
                      >
                        <FormattedMessage id="bookingHistory.cancelBooking" />
                      </button>
                    )}

                    {item.statusId === "S3" && (
                      <>
                        <p>
                          <strong>
                            <FormattedMessage id="bookingHistory.diagnosis" />:
                          </strong>{" "}
                          {item.remedyData?.diagnosis || "Không có"}
                        </p>
                        {item.remedyData?.medications?.length > 0 ? (
                          <div className="prescription-detail">
                            <p>
                              <strong>
                                <FormattedMessage id="bookingHistory.prescription" />
                                :
                              </strong>
                            </p>
                            <ul>
                              {item.remedyData.medications.map((med, idx) => (
                                <li key={idx}>
                                  <p>
                                    <strong>{med.name}</strong>
                                  </p>
                                  <p>
                                    <em>Liều dùng:</em> {med.dose}
                                  </p>
                                  <p>
                                    <em>Số lần/ngày:</em> {med.frequency}
                                  </p>
                                  <p>
                                    <em>Ghi chú:</em> {med.note}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>
                            <FormattedMessage
                              id="bookingHistory.noMedications"
                              defaultMessage="Không có thuốc kê đơn"
                            />
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={this.reset} className="secondary-button">
                <FormattedMessage id="bookingHistory.newLookup" />
              </button>
            </>
          )}
          {showCancelModal && (
            <div className="custom-modal-overlay">
              <div className="custom-modal">
                <h3>
                  <FormattedMessage
                    id="bookingHistory.confirmTitle"
                    defaultMessage="Xác nhận hủy lịch khám"
                  />
                </h3>
                <p>
                  <FormattedMessage
                    id="bookingHistory.confirmCancelMessage"
                    defaultMessage="Bạn có chắc chắn muốn hủy lịch khám này không?"
                  />
                </p>
                <div className="modal-actions">
                  <button
                    className="secondary-button"
                    onClick={this.closeCancelModal}
                  >
                    <FormattedMessage
                      id="bookingHistory.cancel"
                      defaultMessage="Không"
                    />
                  </button>
                  <button
                    className="danger-button"
                    onClick={this.handleCancelBooking}
                  >
                    <FormattedMessage
                      id="bookingHistory.confirm"
                      defaultMessage="Có, hủy lịch"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default injectIntl(BookingHistory);
