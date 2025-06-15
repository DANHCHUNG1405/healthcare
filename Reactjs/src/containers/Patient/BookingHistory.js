import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import HomeHeader from "../HomePage/HomeHeader";
import "./BookingHistory.scss";
import {
  getBookingHistoryByEmail,
  sendOtpToEmail,
  verifyOtpCode,
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
      showModal: false,
      modalImage: "",
    };
  }

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleChangeOtp = (event) => {
    this.setState({ otp: event.target.value });
  };

  sendOtp = async () => {
    const { email } = this.state;
    const { intl } = this.props;

    if (!email) {
      this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.errorEmailRequired" }),
      });
      return;
    }

    this.setState({ loading: true, errMsg: "" });

    try {
      const res = await sendOtpToEmail(email);
      if (res.errCode === 0) {
        this.setState({ step: "otp", errMsg: "" });
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
      this.setState({
        errMsg: intl.formatMessage({ id: "bookingHistory.errorOtpRequired" }),
      });
      return;
    }

    this.setState({ loading: true, errMsg: "" });

    try {
      const res = await verifyOtpCode(email, otp);
      if (res.errCode === 0) {
        this.setState({ verified: true, errMsg: "" });
        await this.handleLookup();
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

  handleLookup = async () => {
    const { email } = this.state;
    const { intl } = this.props;

    this.setState({ loading: true, errMsg: "", history: [] });

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

  openImageModal = (image) => {
    this.setState({ showModal: true, modalImage: image });
  };

  closeImageModal = () => {
    this.setState({ showModal: false, modalImage: "" });
  };
  renderEmailStep = () => {
    const { email, loading } = this.state;

    return (
      <>
        <input
          type="email"
          placeholder={this.props.intl.formatMessage({
            id: "bookingHistory.enterEmail",
          })}
          value={email}
          onChange={this.handleChangeEmail}
        />
        <button onClick={this.sendOtp} disabled={loading}>
          {loading
            ? this.props.intl.formatMessage({ id: "bookingHistory.sending" })
            : this.props.intl.formatMessage({ id: "bookingHistory.sendOtp" })}
        </button>
      </>
    );
  };
  renderOtpStep = () => {
    const { otp, loading } = this.state;

    return (
      <>
        <p>
          <FormattedMessage id="bookingHistory.checkEmailOtp" />
        </p>
        <input
          type="text"
          placeholder={this.props.intl.formatMessage({
            id: "bookingHistory.enterOtp",
          })}
          value={otp}
          onChange={this.handleChangeOtp}
        />
        <button onClick={this.verifyOtp} disabled={loading}>
          {loading
            ? this.props.intl.formatMessage({ id: "bookingHistory.verifying" })
            : this.props.intl.formatMessage({ id: "bookingHistory.verify" })}
        </button>
        <button
          onClick={() => this.setState({ step: "email", errMsg: "", otp: "" })}
          className="secondary-button"
        >
          <FormattedMessage id="bookingHistory.resendEmail" />
        </button>
      </>
    );
  };

  renderResultStep = () => {
    const { loading, history } = this.state;
    const { intl } = this.props;

    return (
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

              {item.statusId === "S3" && (
                <>
                  <p>
                    <strong>
                      <FormattedMessage id="bookingHistory.diagnosis" />:
                    </strong>{" "}
                    {item.remedyData?.diagnosis || "Không có"}
                  </p>
                  {item.remedyData?.medications?.length > 0 && (
                    <div className="prescription-detail">
                      <p>
                        <strong>
                          <FormattedMessage id="bookingHistory.prescription" />:
                        </strong>
                      </p>
                      {Array.isArray(item.remedyData?.medications) &&
                      item.remedyData.medications.length > 0 ? (
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
                      ) : (
                        <p>
                          <FormattedMessage
                            id="bookingHistory.noMedications"
                            defaultMessage="Không có thuốc kê đơn"
                          />
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            this.setState({
              step: "email",
              email: "",
              otp: "",
              verified: false,
              history: [],
              errMsg: "",
            })
          }
          className="secondary-button"
        >
          <FormattedMessage id="bookingHistory.newLookup" />
        </button>
      </>
    );
  };

  render() {
    const { step, errMsg } = this.state;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="booking-history-container">
          <h2>
            <FormattedMessage id="bookingHistory.title" />
          </h2>
          {errMsg && <p className="error-message">{errMsg}</p>}

          {step === "email" && this.renderEmailStep()}
          {step === "otp" && this.renderOtpStep()}
          {step === "result" && this.renderResultStep()}
        </div>
      </>
    );
  }
}

export default injectIntl(BookingHistory);
